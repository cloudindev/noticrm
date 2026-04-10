"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSessionAction, createCustomerPortalSessionAction } from "../billing.actions";
import { Loader2 } from "lucide-react";

interface UpgradeButtonProps extends React.ComponentProps<typeof Button> {
  tenantId: string;
  productId: string;
  isAnnual?: boolean;
  children?: React.ReactNode;
}

export function UpgradeButton({ tenantId, productId, isAnnual = false, children, ...props }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError(null);
      const { url } = await createCheckoutSessionAction(productId, tenantId, isAnnual);
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al iniciar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <Button onClick={handleUpgrade} disabled={loading} {...props}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
      {error && <p className="text-[10px] text-red-500 font-medium text-center">{error}</p>}
    </div>
  );
}

interface PortalButtonProps extends React.ComponentProps<typeof Button> {
  tenantId: string;
  children?: React.ReactNode;
}

export function PortalButton({ tenantId, children, ...props }: PortalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    try {
      setLoading(true);
      const { url } = await createCustomerPortalSessionAction(tenantId);
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "No se pudo acceder al portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePortal} disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
