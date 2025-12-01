package main

import (
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

type Project struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Tech        []string `json:"tech"`
	Stats       struct {
		Atk int `json:"atk"`
		Def int `json:"def"`
	} `json:"stats"`
	Link  string `json:"link"`
	Image string `json:"image"`
}

var notionClient *notionapi.Client
var databaseID notionapi.DatabaseID
var projectsClient *notionapi.Client
var projectsDBID notionapi.DatabaseID

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Guestbook Config
	token := os.Getenv("NOTION_TOKEN")
	dbID := os.Getenv("NOTION_DATABASE_ID")

	if token == "" || dbID == "" {
		log.Fatal("NOTION_TOKEN and NOTION_DATABASE_ID must be set")
	}

	notionClient = notionapi.NewClient(notionapi.Token(token))
	databaseID = notionapi.DatabaseID(dbID)
	log.Println("Guestbook Notion client initialized")

	// Projects Config
	projectsToken := os.Getenv("NOTION_PROJECTS_TOKEN")
	projectsDB := os.Getenv("NOTION_PROJECTS_DB_ID")

	if projectsToken != "" && projectsDB != "" {
		projectsClient = notionapi.NewClient(notionapi.Token(projectsToken))
		projectsDBID = notionapi.DatabaseID(projectsDB)
		log.Println("Projects Notion client initialized")
	} else {
		log.Println("Warning: Projects Notion credentials missing")
	}
}

func getProjectsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if projectsClient == nil {
		http.Error(w, "Projects API not configured", http.StatusServiceUnavailable)
		return
	}

	query := &notionapi.DatabaseQueryRequest{
		Sorts: []notionapi.SortObject{
			{
				Property:  "Name",
				Direction: notionapi.SortOrderASC,
			},
		},
	}

	resp, err := projectsClient.Database.Query(r.Context(), projectsDBID, query)
	if err != nil {
		log.Printf("Error querying Projects database: %v", err)
		http.Error(w, "Failed to fetch projects", http.StatusInternalServerError)
		return
	}

	var projects []Project
	for _, page := range resp.Results {
		project := Project{
			ID: page.ID.String(),
		}

		// Name (Title)
		if prop, ok := page.Properties["Name"].(*notionapi.TitleProperty); ok && len(prop.Title) > 0 {
			project.Name = prop.Title[0].PlainText
		}

		// Description (RichText)
		if prop, ok := page.Properties["Description"].(*notionapi.RichTextProperty); ok && len(prop.RichText) > 0 {
			project.Description = prop.RichText[0].PlainText
		}

		// Tech (MultiSelect)
		if prop, ok := page.Properties["Tech"].(*notionapi.MultiSelectProperty); ok {
			for _, opt := range prop.MultiSelect {
				project.Tech = append(project.Tech, opt.Name)
			}
		}

		// Stats (Number)
		if prop, ok := page.Properties["ATK"].(*notionapi.NumberProperty); ok {
			project.Stats.Atk = int(prop.Number)
		}
		if prop, ok := page.Properties["DEF"].(*notionapi.NumberProperty); ok {
			project.Stats.Def = int(prop.Number)
		}

		// Link (URL)
		if prop, ok := page.Properties["Link"].(*notionapi.URLProperty); ok {
			project.Link = prop.URL
		}

		// Image (URL or Files)
		if prop, ok := page.Properties["Image"].(*notionapi.URLProperty); ok {
			project.Image = prop.URL
		} else if prop, ok := page.Properties["Image"].(*notionapi.FilesProperty); ok && len(prop.Files) > 0 {
			if prop.Files[0].Type == "external" {
				project.Image = prop.Files[0].External.URL
			} else if prop.Files[0].Type == "file" {
				project.Image = prop.Files[0].File.URL
			}
		}

		projects = append(projects, project)
	}

	if projects == nil {
		projects = []Project{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
	log.Printf("Returned %d projects from Notion", len(projects))
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

	mux.HandleFunc("/api/projects", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			getProjectsHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Health check endpoint for Render
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// CORS configuration for frontend
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"https://portfolio-website-under-tail.vercel.app",
			"https://shoyahoriuchi.me",
			"https://www.shoyahoriuchi.me",
		},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	handler := corsHandler.Handler(mux)

	// Get PORT from environment variable (Render sets this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default for local development
	}

	log.Printf("Starting server on port %s with Notion API...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
