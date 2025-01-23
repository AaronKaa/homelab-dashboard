package handlers

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "io"
    //"log"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
    "strconv"
    "strings"
)

type Item struct {
    ID       int64  `json:"id"`
    Title    string `json:"title"`
    URL      string `json:"url"`
    ImageURL string `json:"imageUrl"`
}

// ItemsHandler returns an http.HandlerFunc that handles /items route.
func ItemsHandler(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {

        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        switch r.Method {
        case http.MethodGet:
            handleGetItems(db, w, r)
        case http.MethodPost:
            handlePostItem(db, w, r)
        case http.MethodDelete:
            handleDeleteItem(db, w, r)
        default:
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    }
}

// handleGetItems handles GET /items
func handleGetItems(db *sql.DB, w http.ResponseWriter, r *http.Request) {
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

// handlePostItem handles POST /items
func handlePostItem(db *sql.DB, w http.ResponseWriter, r *http.Request) {

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

    // Return the path with a leading slash so it matches your usage in /items
    return "/" + filePath, nil
}

// handleDeleteItem handles DELETE /items?id=...
func handleDeleteItem(db *sql.DB, w http.ResponseWriter, r *http.Request) {

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
