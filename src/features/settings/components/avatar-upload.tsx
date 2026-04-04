"use client";

import React, { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { updateProfileAvatar } from "../actions";

interface AvatarUploadProps {
  currentImageUrl?: string | null;
  userName: string;
  userInitials: string;
  tenantSlug: string;
}

export function AvatarUpload({ currentImageUrl, userName, userInitials, tenantSlug }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
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
      
      const result = await updateProfileAvatar(tenantSlug, formData);
      if (result.error) {
        console.error("Failed to upload avatar:", result.error);
        // Revert on error
        setPreviewUrl(currentImageUrl || null);
        // Also cleanup memory (ideally use a toast to notify user here)
      } else if (result.url) {
        setPreviewUrl(result.url); // Set the permanent S3 URL
      }
    });
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
      
      <div className="flex items-center gap-6">
        <div 
          className="relative group cursor-pointer"
          onClick={() => !isPending && fileInputRef.current?.click()}
        >
          <Avatar className="h-20 w-20 ring-1 ring-border/50 ring-offset-2 ring-offset-background group-hover:opacity-90 transition-opacity">
            <AvatarImage src={previewUrl || ""} alt={userName} className="object-cover" />
            <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          {/* Overlay Hover */}
          <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity ${isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isPending ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        <div className="text-sm">
          <h4 className="font-semibold text-foreground mb-1">Foto de perfil</h4>
          <p className="text-muted-foreground">Te recomendamos una imagen cuadrada de al menos 400x400px.</p>
          <div className="flex gap-3 mt-3">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
            >
              Cambiar imagen
            </button>
            <button 
              type="button" 
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
