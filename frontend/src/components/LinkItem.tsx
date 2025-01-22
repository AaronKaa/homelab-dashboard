"use client";

import { FC } from "react";

interface Item {
  id: number;
  title: string;
  url: string;
  imageUrl: string;
}

interface LinkItemAdvProps {
  item: Item;
  onDelete: (id: number) => void | Promise<void>;
}

const LinkItemAdv: FC<LinkItemAdvProps> = ({ item, onDelete }) => {
  return (
    <div className="relative z-0">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <img
          className="transition ease-in-out hover:brightness-110 hover:scale-[1.05] object-cover h-40 w-40 max-w-full rounded-lg"
          src={`http://localhost:3001${item.imageUrl}`}
          alt={item.title}
        />
        <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
          {item.title}
        </figcaption>
      </a>
      <button
        type="button"
        className="absolute top-0 right-0 text-xs py-2 px-2 me-1 mb-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={() => {
          onDelete(item.id);
        }}
      >
        <svg class="w-[15px] h-[15px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
        </svg>
      </button>
    </div>
  );
};

export default LinkItemAdv;
