package main

import (
    "database/sql"
    "log"
    "net/http"

    _ "modernc.org/sqlite"

    "golang-backend/handlers" // Update to your actual module path
)

var db *sql.DB

func main() {
    initDB()
    
    // Serve static files from ./uploads under /uploads/
    http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

    // Use ItemsHandler from your handlers package
    http.HandleFunc("/items", handlers.ItemsHandler(db))

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
