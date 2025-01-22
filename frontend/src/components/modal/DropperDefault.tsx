"use client";

import { Icon } from "@iconify/react";

const DropperDefault = () => {
  return (
      <div>
        <Icon className="mx-auto" icon="solar:cloud-upload-bold-duotone" width="60" height="60" /> 
        <p className="text-sm">Drag or click to add an image</p>
      </div>
  );
};

export default DropperDefault;
