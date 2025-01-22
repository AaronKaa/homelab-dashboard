"use client";

import { Icon } from "@iconify/react";

const DropperDragActive = () => {
  return (
      <div>
          <Icon className="mx-auto" icon="solar:cloud-upload-bold-duotone" width="60" height="60" /> 
          <p className="text-sm">Drop here</p>
      </div>
  );
};

export default DropperDragActive;
