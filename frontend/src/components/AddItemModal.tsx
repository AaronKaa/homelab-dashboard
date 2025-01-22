"use client";

import React, { useState, FormEvent, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (title: string, url: string, file: File) => void | Promise<void>;
}

export default function AddItemModal({ onClose, onAdd }: AddItemModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  // Callback for react-dropzone when files are dropped or selected
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // We only allow one image in this example, so take the first file
    if (acceptedFiles && acceptedFiles.length > 0) {
      setDroppedFile(acceptedFiles[0]);
    }
  }, []);

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // When the form is submitted (Add button clicked)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!droppedFile) {
      alert("Please drop an image file.");
      return;
    }
    onAdd(title, url, droppedFile);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div className="relative bg-white rounded-lg  dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add an Item
            </h3>
          </div>
          <div className="p-2  space-y-2">
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "0.5rem" }}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="Link"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              {/* Dropzone area */}
              <div
                {...getRootProps()}
                style={{
                  border: "3px dashed #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                  background: isDragActive ? "rgb(60 75 90)" : "rgb(55 65 81",
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the file here...</p>
                ) : droppedFile ? (
                  <p>File ready: {droppedFile.name}</p>
                ) : (
                  <p>Drop an image here, or click to select</p>
                )}
              </div>

              <div className="flex items-center p-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  zIndex: 100,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "rgb(55 65 81 / var(--tw-bg-opacity, 1))",
  width: "400px",
  margin: "100px auto",
  borderRadius: "10px",
};
