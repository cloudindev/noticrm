"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SignoutPage() {
  const router = useRouter();
  const [isSignoutOut, setIsSignoutOut] = useState(false);

  const handleSignout = async () => {
    setIsSignoutOut(true);
    // next-auth signOut handles the API POST and local storage clearing securely.
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Cerrar sesión</h1>
        <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
          ¿Seguro que quieres cerrar sesión?
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 pt-2">
        <Button 
          onClick={handleSignout} 
          disabled={isSignoutOut}
          className="w-full bg-[#2f6bff] hover:bg-[#1a55e8] text-white"
        >
          {isSignoutOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Cerrar sesión
        </Button>
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          disabled={isSignoutOut}
          className="w-full"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
