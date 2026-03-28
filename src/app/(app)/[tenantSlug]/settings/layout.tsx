import React from 'react';
import { SettingsSidebar } from './components/settings-sidebar';

export default async function SettingsLayoutWrapper({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  return (
    <div className="fixed inset-0 z-50 flex bg-background h-screen w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <SettingsSidebar tenantSlug={tenantSlug} />
      
      {/* Settings Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-background flex flex-col">
        {children}
      </main>
    </div>
  );
}
