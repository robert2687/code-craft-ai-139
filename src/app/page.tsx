import { AppGenerator } from '@/components/app/app-generator';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground antialiased">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg z-10 shrink-0">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            AI Builder Studio
        </h1>
        <p className="text-center text-gray-400 text-sm mt-1">Generate and edit applications in a professional IDE, powered by AI.</p>
      </header>

      <main className="flex-grow overflow-hidden relative p-6">
        <AppGenerator />
      </main>
    </div>
  );
}
