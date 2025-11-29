# ビルド用ステージ
FROM golang:1.23-alpine AS builder
WORKDIR /app

# backendフォルダの中身をコンテナにコピー
COPY backend/ .

# 依存関係のダウンロード
RUN go mod download

# 【修正ポイント】
# パスを ./cmd/api/main.go から main.go に変更しました
RUN go build -o main main.go

# 実行用ステージ
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]