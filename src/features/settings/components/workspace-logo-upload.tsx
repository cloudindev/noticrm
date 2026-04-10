"use client";

import React, { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Building, Trash2 } from "lucide-react";
import { updateWorkspaceLogo } from "../actions";
import { toast } from "sonner";

interface WorkspaceLogoUploadProps {
  currentLogoUrl?: string | null;
  workspaceName: string;
  tenantSlug: string;
}

export function WorkspaceLogoUpload({ currentLogoUrl, workspaceName, tenantSlug }: WorkspaceLogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to server
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await updateWorkspaceLogo(tenantSlug, formData);
      if (result.error) {
        toast.error(result.error);
        setPreviewUrl(currentLogoUrl || null);
      } else if (result.url) {
        toast.success("Logo actualizado correctamente.");
        setPreviewUrl(result.url); // Set the permanent S3 URL
      }
    });
  };

  const handleRemove = () => {
    // Basic logic for removing logic is not implemented in backend yet,
    // but we can provide the UI hook, or simply hide if not needed as per avatar-upload
    toast.info("Para eliminar el logo, sube una nueva imagen por defecto.");
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="mb-8 flex items-start gap-6">
        <div 
          className="relative group cursor-pointer"
          onClick={() => !isPending && fileInputRef.current?.click()}
        >
          {/* We use rounded-xl instead of rounded-full to fit the previous exact design */}
          <Avatar className="h-16 w-16 rounded-xl border border-border/50 shadow-sm group-hover:opacity-90 transition-opacity bg-[#00b2ff]">
            <AvatarImage src={previewUrl || ""} alt={workspaceName} className="object-cover" />
            <AvatarFallback className="rounded-xl text-2xl font-medium bg-transparent text-white">
              {workspaceName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Overlay Hover */}
          <div className={`absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center transition-opacity ${isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isPending ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-0.5">
          <h2 className="text-sm font-semibold">Logo del espacio</h2>
          <p className="text-xs text-muted-foreground mb-1">Soportamos PNGs, JPEGs y GIFs menores de 10MB</p>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isPending ? "Subiendo..." : "Cambiar imagen"}
            </button>
            <button 
              type="button" 
              onClick={handleRemove}
              disabled={isPending || !previewUrl}
              className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
