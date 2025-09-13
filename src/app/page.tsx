import { AppGenerator } from '@/components/app/app-generator';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background text-foreground antialiased">
          <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 shadow-sm z-10 shrink-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                  CodeCraft AI
                </h1>
              </div>
              <p className="text-center text-muted-foreground text-sm">
                Turn your ideas into applications, powered by Gemini.
              </p>
            </div>
          </header>

          <main className="flex-grow overflow-hidden relative">
            <AppGenerator />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
