"use client"

import { useState, useEffect } from "react"
import AddItemModal from "../components/AddItemModal"
import LinkItem from "../components/LinkItem"
import NoLinks from "../components/NoLinks"
import { Icon } from "@iconify/react";

interface Item {
  id: number
  title: string
  url: string
  imageUrl: string
}

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([])
  const [showModal, setShowModal] = useState(false)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  
  useEffect(() => {
    fetchItems(backendUrl)
  }, [backendUrl])

  // Fetch items from the backend
  const fetchItems = async (backendUrl: string) => {
    try {
      const res = await fetch(`${backendUrl}/items`)
      if (!res.ok) throw new Error("Failed to fetch items")
      const data: Item[] = await res.json()
      setItems(data)
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleDeleteItem = async (id: number) => {
    console.log(id)
    try {
      const res = await fetch(`${backendUrl}/items?id=${id}`, {
        method: "DELETE",
      })
      if (res.status === 204) {
        // Successfully deleted
        // Update your state to remove the item from the list
        fetchItems(backendUrl)
      } else if (res.status === 404) {
        alert("Item not found.")
      } else {
        alert("Failed to delete item.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred.")
    }
  }
  
  // Called by the AddItemModal after user selects file & enters title/url
  const handleAddItem = async (title: string, url: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("url", url)
      formData.append("image", file)

      const res = await fetch(`${backendUrl}/items`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to create item")

      const createdItem: Item = await res.json()
      setItems((prev) => [...prev, createdItem])

      setShowModal(false) // close modal on success
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ padding: "2rem" }}>

      <button className="absolute top-5 right-5 text-white hover:bg-gray-700 bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => setShowModal(true)}>
          <Icon icon="solar:add-square-bold" width="24" height="24" />
      </button>

      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddItem}
        />
      )}

      {items.length === 0 ? (
          <NoLinks />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {items.map((item) => (
              <LinkItem key={item.id} item={item} onDelete={handleDeleteItem}/>
            ))}
          </div>
        )}
    </div>
  )
}
