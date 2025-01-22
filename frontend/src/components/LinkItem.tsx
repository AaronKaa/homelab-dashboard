"use client";

import { FC } from "react";
import { Icon } from "@iconify/react";

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
        className="transition ease-in-out hover:opacity-90 opacity-0 absolute top-0 right-0 text-xs py-2 px-2 me-1 mt-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={() => {
          onDelete(item.id);
        }}
      >
        <Icon icon="solar:close-square-line-duotone" width="24" height="24" />
      </button>
    </div>
  );
};

export default LinkItemAdv;
