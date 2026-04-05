"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteWorkspaceAction } from "../actions";

export function WorkspaceDeleteZone({ 
  tenantSlug, 
  workspaceName 
}: { 
  tenantSlug: string; 
  workspaceName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const isConfirmed = confirmText === workspaceName;

  async function handleDelete() {
    if (!isConfirmed) return;
    setIsDeleting(true);
    const res = await deleteWorkspaceAction(tenantSlug);
    setIsDeleting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Espacio de trabajo eliminado correctamente.");
      router.push("/");
    }
  }

  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="text-sm font-semibold mb-4">Zona de peligro</h2>
      
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Eliminar espacio de trabajo</h3>
          <p className="text-sm text-muted-foreground">Una vez eliminado, tu espacio de trabajo no podrá recuperarse</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setConfirmText("");
        }}>
          <DialogTrigger render={
            <Button variant="destructive" size="sm" className="h-9 shadow-sm bg-red-500 hover:bg-red-600 text-white font-medium px-4 gap-2">
              <Trash2 size={16} />
              Eliminar espacio
            </Button>
          } />
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
                <Trash2 size={20} />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Esta acción es <span className="font-semibold text-foreground">permanente e irreversible</span>. 
                Se borrarán todos los datos, miembros, leads y configuraciones del espacio de trabajo <b>{workspaceName}</b>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <label className="text-sm font-medium text-foreground">
                Por favor, escribe el nombre del espacio de trabajo para confirmar:
                <br />
                <span className="text-muted-foreground select-all font-mono bg-muted px-1 py-0.5 rounded text-xs mt-1 inline-block">
                  {workspaceName}
                </span>
              </label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={workspaceName}
                className="font-medium"
              />
            </div>
            <DialogFooter className="sm:justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={!isConfirmed || isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Eliminando..." : "Eliminar permanentemente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
