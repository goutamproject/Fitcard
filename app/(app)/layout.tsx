
import { ClerkProvider } from '@clerk/nextjs';

import { SanityLive } from "@/sanity/lib/live";
import { AppHeader } from '@/components/app/layout/AppHeader';
import { OnboardingGuard } from '@/components/app/onboarding/OnboardingGuard';
import { ChatStoreProvider } from '@/lib/store/chat-store-provider';
import { AppShell } from '@/components/app/layout/AppShell';
import { ChatButton } from '@/components/app/chat/ChatButton';
import { ChatSheet } from '@/components/app/chat/ChatSheet';
export default function Applayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider >
      <ChatStoreProvider>
        
          <AppShell>
          <OnboardingGuard>
            <AppHeader />
            {children}
           </OnboardingGuard>
          </AppShell>
          <ChatButton />
          <ChatSheet />
        
        <SanityLive />
      </ChatStoreProvider>
    </ClerkProvider>
  );
}

//export default Applayout
