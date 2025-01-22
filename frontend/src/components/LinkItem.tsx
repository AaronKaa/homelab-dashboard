"use client";

import { FC } from "react";
import { Icon } from "@iconify/react";
import Image from 'next/image'

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
    
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    
  return (
    <div className="relative z-0">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
      <Image
        src={backendUrl + `${item.imageUrl}`}
        width={160}
        height={160}
        alt="Picture of the author"
        className="transition ease-in-out hover:brightness-110 hover:shadow-xl hover:scale-[1.05] h-40 w-40 object-cover max-w-full rounded-lg"
        style={{objectFit: "cover"}}
        objectFit="cover"
      />
        <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
          {item.title}
        </figcaption>
      </a>
      <button
        type="button"
        className="transition ease-in-out hover:opacity-90 opacity-0 absolute top-0 right-0 text-xs py-1 px-1 me-1 mt-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={() => {
          onDelete(item.id);
        }}
      >
        <Icon icon="solar:close-square-line-duotone" width="20" height="20" />
      </button>
    </div>
  );
};

export default LinkItemAdv;
