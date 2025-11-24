package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/jomei/notionapi"
	"github.com/rs/cors"
)

type GuestbookEntry struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Message string `json:"message"`
	Date    string `json:"date"`
}

type NewEntryRequest struct {
	Name    string `json:"name"`
	Message string `json:"message"`
	Date    string `json:"date,omitempty"`
}

var notionClient *notionapi.Client
var databaseID notionapi.DatabaseID

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	token := os.Getenv("NOTION_TOKEN")
	dbID := os.Getenv("NOTION_DATABASE_ID")

	if token == "" || dbID == "" {
		log.Fatal("NOTION_TOKEN and NOTION_DATABASE_ID must be set in environment variables")
	}

	notionClient = notionapi.NewClient(notionapi.Token(token))
	databaseID = notionapi.DatabaseID(dbID)
	log.Println("Notion client initialized successfully")

	// Check database and print properties
	db, err := notionClient.Database.Get(context.Background(), databaseID)
	if err != nil {
		log.Printf("Error retrieving database: %v", err)
	} else {
		keys := make([]string, 0, len(db.Properties))
		for k, v := range db.Properties {
			keys = append(keys, k+"("+string(v.GetType())+")")
		}
		log.Printf("Database connected. Available properties: %v", keys)
	}
}

func getEntriesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Query Notion database
	query := &notionapi.DatabaseQueryRequest{}

	resp, err := notionClient.Database.Query(r.Context(), databaseID, query)
	if err != nil {
		log.Printf("Error querying Notion database: %v", err)
		http.Error(w, "Failed to fetch entries", http.StatusInternalServerError)
		return
	}

	var entries []GuestbookEntry
	for _, page := range resp.Results {
		// Debug: Print available properties
		if len(entries) == 0 {
			keys := make([]string, 0, len(page.Properties))
			for k := range page.Properties {
				keys = append(keys, k)
			}
			log.Printf("Available properties: %v", keys)
		}

		entry := GuestbookEntry{
			ID: page.ID.String(),
		}

		// Extract Name (Title property)
		if nameProperty, ok := page.Properties["Name"].(*notionapi.TitleProperty); ok && len(nameProperty.Title) > 0 {
			entry.Name = nameProperty.Title[0].PlainText
		}

		// Extract Message (Rich Text property)
		if messageProperty, ok := page.Properties["Message"].(*notionapi.RichTextProperty); ok && len(messageProperty.RichText) > 0 {
			entry.Message = messageProperty.RichText[0].PlainText
		}

		// Extract Date (Date property)
		if dateProperty, ok := page.Properties["Date"].(*notionapi.DateProperty); ok && dateProperty.Date != nil {
			if dateProperty.Date.Start != nil {
				entry.Date = time.Time(*dateProperty.Date.Start).Format("2006-01-02")
			}
		}

		entries = append(entries, entry)
	}

	if entries == nil {
		entries = []GuestbookEntry{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
	log.Printf("Returned %d entries from Notion", len(entries))
}

func saveEntryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req NewEntryRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.Message == "" {
		http.Error(w, "Name and message are required", http.StatusBadRequest)
		return
	}

	// Use provided date or current date
	date := req.Date
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}

	// Parse date for Notion
	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		parsedDate = time.Now()
	}

	// Create new page in Notion database
	pageRequest := &notionapi.PageCreateRequest{
		Parent: notionapi.Parent{
			Type:       notionapi.ParentTypeDatabaseID,
			DatabaseID: databaseID,
		},
		Properties: notionapi.Properties{
			"Name": notionapi.TitleProperty{
				Title: []notionapi.RichText{
					{
						Text: &notionapi.Text{
							Content: req.Name,
						},
					},
				},
			},
			"Message": notionapi.RichTextProperty{
				RichText: []notionapi.RichText{
					{
						Text: &notionapi.Text{
							Content: req.Message,
						},
					},
				},
			},
			"Date": notionapi.DateProperty{
				Date: &notionapi.DateObject{
					Start: (*notionapi.Date)(&parsedDate),
				},
			},
		},
	}

	page, err := notionClient.Page.Create(r.Context(), pageRequest)
	if err != nil {
		log.Printf("Error creating Notion page: %v", err)
		http.Error(w, "Failed to save entry", http.StatusInternalServerError)
		return
	}

	response := GuestbookEntry{
		ID:      page.ID.String(),
		Name:    req.Name,
		Message: req.Message,
		Date:    date,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
	log.Printf("Saved new entry to Notion: %s - %s", req.Name, req.Message)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/guestbook", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			getEntriesHandler(w, r)
		} else if r.Method == http.MethodPost {
			saveEntryHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// CORS configuration for frontend
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	handler := corsHandler.Handler(mux)

	log.Println("Starting server on :8080 with Notion API...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
