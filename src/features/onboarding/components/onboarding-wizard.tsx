"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateProfileAction, createWorkspaceAction, inviteUsersAction } from '../actions';

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tenantSlug, setTenantSlug] = useState("");

  // Step 1 State
  const [profile, setProfile] = useState({ firstName: "", lastName: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  // Step 2 State
  const [workspace, setWorkspace] = useState({ companyName: "", handle: "", billingCountry: "US" });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Step 3 State
  const [invites, setInvites] = useState([{ email: "", role: "MEMBER" }]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.firstName || !profile.lastName) {
      return toast.error("Please fill in your name");
    }
    setIsLoading(true);
    const fd = new FormData();
    fd.append("firstName", profile.firstName);
    fd.append("lastName", profile.lastName);
    if (avatarFile) {
      fd.append("avatar", avatarFile);
    }
    
    const res = await updateProfileAction(fd);
    setIsLoading(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      setStep(2);
    }
  }

  async function handleWorkspaceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workspace.companyName || !workspace.handle) {
      return toast.error("Please fill in workspace details");
    }
    setIsLoading(true);
    const fd = new FormData();
    fd.append("companyName", workspace.companyName);
    fd.append("workspaceHandle", workspace.handle);
    fd.append("billingCountry", workspace.billingCountry);
    if (logoFile) {
      fd.append("logo", logoFile);
    }
    
    const res = await createWorkspaceAction(fd);
    setIsLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      setTenantSlug(res.slug!);
      setStep(3);
    }
  }

  async function handleInvitesSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const validInvites = invites.filter(i => i.email.includes("@"));
    
    if (validInvites.length > 0) {
      setIsLoading(true);
      const res = await inviteUsersAction(tenantSlug, validInvites);
      setIsLoading(false);
      if (res.error) {
        return toast.error(res.error);
      }
    }
    
    toast.success("Welcome to NotiCRM!");
    window.location.href = `/${tenantSlug}/home`;
  }

  // Animated mock UI based on the current step
  const renderMockup = () => {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F7F7F8] overflow-hidden -mt-10 lg:mt-0 p-8 lg:p-16">
        <div className="relative w-full max-w-[600px] aspect-video bg-white rounded-xl shadow-2xl overflow-hidden border border-zinc-200 transition-all duration-700 ease-in-out">
          {/* Header Mock */}
          <div className="h-10 border-b border-zinc-100 flex items-center px-4 gap-2">
             <div className="w-3 h-3 rounded-full bg-red-400"></div>
             <div className="w-3 h-3 rounded-full bg-amber-400"></div>
             <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex h-[calc(100%-40px)]">
             {/* Sidebar Mock */}
             <div className="w-48 bg-zinc-50 border-r border-zinc-100 p-4 space-y-3">
                <div className="w-full h-6 bg-zinc-200 rounded-md animate-pulse"></div>
                <div className="w-3/4 h-4 bg-zinc-200 rounded-md animate-pulse delay-75"></div>
                <div className="w-5/6 h-4 bg-zinc-200 rounded-md animate-pulse delay-150"></div>
                
                {step >= 2 && (
                   <div className="mt-8 p-3 bg-white border border-zinc-100 rounded-lg shadow-sm flex items-center gap-2 animate-in slide-in-from-left-4 duration-500">
                     <div className="w-6 h-6 rounded-md bg-rose-600 flex-shrink-0"></div>
                     <div className="w-20 h-4 bg-zinc-800 rounded"></div>
                   </div>
                )}
             </div>
             {/* Content Mock */}
             <div className="flex-1 p-6 space-y-4">
                <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
                  {step === 1 ? (
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center animate-in fade-in zoom-in duration-500">
                      <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold animate-in fade-in zoom-in duration-500">
                      {profile.firstName?.[0] || 'U'}
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="w-1/3 h-5 bg-zinc-200 rounded-md animate-pulse"></div>
                    <div className="w-1/4 h-3 bg-zinc-100 rounded-md"></div>
                  </div>
                </div>

                {step === 3 && (
                  <div className="grid grid-cols-2 gap-4 mt-6 animate-in slide-in-from-bottom-8 duration-700">
                     {invites.filter(i=>i.email).concat({email: "mock@user", role: "1"}).slice(0, 4).map((i, idx) => (
                       <div key={idx} className="p-3 border border-zinc-100 rounded-lg bg-zinc-50 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-zinc-200"></div>
                         <div className="w-1/2 h-3 bg-zinc-300 rounded"></div>
                       </div>
                     ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left side: Flow */}
      <div className="w-full lg:w-[480px] flex-shrink-0 flex flex-col px-8 py-12 lg:px-16 overflow-y-auto z-10 border-r border-zinc-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
         <div className="mb-12">
           <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold font-mono text-sm">
               N/
             </div>
             <span className="text-xl font-bold tracking-tight">noticrm</span>
           </div>
         </div>

         <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Let's get to know you</h1>
                  <p className="text-zinc-500 text-sm">We'll use this info to personalize your profile.</p>
                </div>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={avatarInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setAvatarFile(file);
                      }}
                    />
                    <div 
                      onClick={() => avatarInputRef.current?.click()}
                      className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400 cursor-pointer overflow-hidden hover:bg-zinc-100 transition-colors"
                    >
                      {avatarFile ? (
                        <img src={URL.createObjectURL(avatarFile)} alt="Avatar preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-medium">Add Photo</span>
                      )}
                    </div>
                    <div className="flex-1 text-sm text-zinc-500">
                      Upload a square image, ideally 500x500px or larger.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" value={profile.firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setProfile({...profile, firstName: e.target.value})} autoFocus placeholder="Jane" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" value={profile.lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setProfile({...profile, lastName: e.target.value})} placeholder="Doe" />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Saving..." : "Continue"}
                  </Button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Create your workspace</h1>
                  <p className="text-zinc-500 text-sm">This is your company's shared environment in NotiCRM.</p>
                </div>
                
                <form onSubmit={handleWorkspaceSubmit} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={logoInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setLogoFile(file);
                      }}
                    />
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-16 h-16 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400 cursor-pointer shadow-sm overflow-hidden hover:bg-zinc-100 transition-colors"
                    >
                      {logoFile ? (
                        <img src={URL.createObjectURL(logoFile)} alt="Logo preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">+</span>
                      )}
                    </div>
                    <div className="flex-1 text-sm text-zinc-500">
                      Company Logo
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company name</Label>
                      <Input id="companyName" value={workspace.companyName} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setWorkspace({...workspace, companyName: e.target.value})} autoFocus placeholder="Acme Inc." />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="handle">Workspace handle</Label>
                      <div className="flex items-center">
                        <span className="bg-zinc-100 border border-r-0 border-zinc-200 text-zinc-500 px-3 h-10 flex items-center rounded-l-md text-sm">noticrm.com/</span>
                        <Input id="handle" className="rounded-l-none" value={workspace.handle} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setWorkspace({...workspace, handle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} placeholder="acme-inc" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Billing Country</Label>
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={workspace.billingCountry} 
                        onChange={(e) => setWorkspace({...workspace, billingCountry: e.target.value})}
                      >
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="ES">Spain</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                        <option value="CA">Canada</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating..." : "Create Workspace"}
                  </Button>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Collaborate with your team</h1>
                  <p className="text-zinc-500 text-sm">Invite your colleagues to {workspace.companyName || 'your workspace'}. Everyone gets more done when working together.</p>
                </div>
                
                <form onSubmit={handleInvitesSubmit} className="space-y-6">
                  <div className="space-y-3">
                    {invites.map((invite, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input 
                          placeholder="colleague@company.com" 
                          type="email"
                          value={invite.email}
                          autoFocus={idx === 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newInvites = [...invites];
                            newInvites[idx].email = e.target.value;
                            setInvites(newInvites);
                          }}
                        />
                        <select 
                           className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-ring w-[120px]"
                           value={invite.role}
                           onChange={(e) => {
                             const newInvites = [...invites];
                             newInvites[idx].role = e.target.value;
                             setInvites(newInvites);
                           }}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="MEMBER">Member</option>
                        </select>
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      onClick={() => setInvites([...invites, { email: "", role: "MEMBER" }])}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-2"
                    >
                      + Add another 
                    </button>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <Button type="submit" disabled={isLoading} className="w-full h-11 bg-zinc-900 hover:bg-zinc-800">
                      {isLoading ? "Sending..." : "Send invites & Finish"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => handleInvitesSubmit()} className="w-full hover:bg-transparent hover:underline text-zinc-500">
                      I'll do this later
                    </Button>
                  </div>
                </form>
              </div>
            )}
         </div>

         {/* Steps indicator */}
         <div className="mt-12 flex gap-2 w-full max-w-sm mx-auto justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-zinc-900' : step > s ? 'w-8 bg-zinc-200' : 'w-4 bg-zinc-100'}`}></div>
            ))}
         </div>
      </div>

      {/* Right side: App UI Mockup Visualizer */}
      <div className="flex-1 relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-100/50"></div>
        <div className="absolute inset-0 pointer-events-none">
          {renderMockup()}
        </div>
      </div>
    </div>
  );
}
