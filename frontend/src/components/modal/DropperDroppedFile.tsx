"use client";

import { Icon } from "@iconify/react";
import { FC } from "react";

interface DropperDroppedFileProps {
    link: string;
}

const DropperDroppedFile: FC<DropperDroppedFileProps> = ({ link }) => {
  return (
      <div>
          <Icon className="mx-auto" icon="solar:file-smile-line-duotone" width="60" height="60" />
          <p className="text-sm">{link}</p>
      </div>
  );
};

export default DropperDroppedFile;