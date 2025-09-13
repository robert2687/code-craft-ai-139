import { AppGenerator } from '@/components/app/app-generator';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground antialiased">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 shadow-sm z-10 shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
            CodeCraft AI
          </h1>
          <p className="text-center text-muted-foreground text-sm mt-1">
            Turn your ideas into applications, powered by Gemini.
          </p>
        </div>
      </header>

      <main className="flex-grow overflow-hidden relative">
        <AppGenerator />
      </main>
    </div>
  );
}
