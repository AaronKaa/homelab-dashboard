package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "io"
    "log"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
    "strconv"
    "strings"

    _ "modernc.org/sqlite"
)

type Item struct {
    ID       int64  `json:"id"`
    Title    string `json:"title"`
    URL      string `json:"url"`
    ImageURL string `json:"imageUrl"`
}

var db *sql.DB

func main() {
    initDB()
    
    http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

    http.HandleFunc("/items", itemsHandler)

    log.Println("Go server running on http://localhost:3001")
    log.Fatal(http.ListenAndServe(":3001", nil))
}

func initDB() {
    var err error
    db, err = sql.Open("sqlite", "items.db")
    if err != nil {
        log.Fatalf("Failed to open DB: %v", err)
    }

    createTableSQL := `
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        image_url TEXT NOT NULL
    );
    `
    _, err = db.Exec(createTableSQL)
    if err != nil {
        log.Fatalf("Failed to create table: %v", err)
    }
}

func itemsHandler(w http.ResponseWriter, r *http.Request) {

    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return
    }

    switch r.Method {
    case http.MethodGet:
        handleGetItems(w, r)
    case http.MethodPost:
        handlePostItem(w, r)
    case http.MethodDelete:
        handleDeleteItem(w, r)
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func handleGetItems(w http.ResponseWriter, r *http.Request) {
    // If no rows, ensure we start with an empty slice, not nil
    items := []Item{}

    rows, err := db.Query("SELECT id, title, url, image_url FROM items")
    if err != nil {
        http.Error(w, "Failed to query items", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    for rows.Next() {
        var it Item
        if err := rows.Scan(&it.ID, &it.Title, &it.URL, &it.ImageURL); err != nil {
            http.Error(w, "Failed to scan item", http.StatusInternalServerError)
            return
        }
        items = append(items, it)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "Failed during row iteration", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(items)
}

func handlePostItem(w http.ResponseWriter, r *http.Request) {

    err := r.ParseMultipartForm(10 << 20)
    if err != nil {
        http.Error(w, "Error parsing multipart form", http.StatusBadRequest)
        return
    }

    title := r.FormValue("title")
    url := r.FormValue("url")

    file, fileHeader, err := r.FormFile("image")
    if err != nil {
        http.Error(w, "Missing image file", http.StatusBadRequest)
        return
    }
    defer file.Close()

    imagePath, err := saveUploadedFile(file, fileHeader)
    if err != nil {
        http.Error(w, fmt.Sprintf("Error saving file: %v", err), http.StatusInternalServerError)
        return
    }

    result, err := db.Exec("INSERT INTO items (title, url, image_url) VALUES (?, ?, ?)",
        title, url, imagePath)
    if err != nil {
        http.Error(w, "Failed to insert item", http.StatusInternalServerError)
        return
    }
    newID, err := result.LastInsertId()
    if err != nil {
        http.Error(w, "Failed to get inserted ID", http.StatusInternalServerError)
        return
    }

    newItem := Item{
        ID:       newID,
        Title:    title,
        URL:      url,
        ImageURL: imagePath,
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(newItem)
}

func saveUploadedFile(file multipart.File, header *multipart.FileHeader) (string, error) {

    if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
        return "", err
    }

    filename := header.Filename
    filePath := filepath.Join("uploads", filename)

    out, err := os.Create(filePath)
    if err != nil {
        return "", err
    }
    defer out.Close()

    _, err = io.Copy(out, file)
    if err != nil {
        return "", err
    }

    return "/" + filePath, nil
}

func handleDeleteItem(w http.ResponseWriter, r *http.Request) {

    idStr := r.URL.Query().Get("id")
    if idStr == "" {
        http.Error(w, "Missing id parameter", http.StatusBadRequest)
        return
    }
    id, err := strconv.ParseInt(idStr, 10, 64)
    if err != nil {
        http.Error(w, "Invalid id parameter", http.StatusBadRequest)
        return
    }

    var imageURL string
    err = db.QueryRow("SELECT image_url FROM items WHERE id = ?", id).Scan(&imageURL)
    if err == sql.ErrNoRows {
        http.Error(w, "Item not found", http.StatusNotFound)
        return
    } else if err != nil {
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    if imageURL != "" {
        localPath := strings.TrimPrefix(imageURL, "/")

        _ = os.Remove(localPath)
    }

    res, err := db.Exec("DELETE FROM items WHERE id = ?", id)
    if err != nil {
        http.Error(w, "Failed to delete item", http.StatusInternalServerError)
        return
    }
    rowsAffected, err := res.RowsAffected()
    if err != nil {
        http.Error(w, "Cannot confirm deletion", http.StatusInternalServerError)
        return
    }
    if rowsAffected == 0 {
        http.Error(w, "Item not found", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}
