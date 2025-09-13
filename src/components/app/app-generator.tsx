'use client';

import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { BotMessageSquare, LoaderCircle, Sparkles, Copy, Trash2, Download } from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { generateAppAction, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CodeView } from './code-view';
import { PreviewFrame } from './preview-frame';

const examplePrompts = [
  { name: 'Calculator', prompt: "A simple calculator app. It should have buttons for numbers 0-9, basic operations (+, -, *, /), a clear button, and an equals button. The design should be dark, clean, and modern." },
  { name: 'Weather App', prompt: "A weather app that shows the current weather. It should have an input for a city name. On search, it should display the temperature, humidity, and wind speed. Use a simple, clean interface with weather icons. The app doesn't need a real API, just mock data." },
  { name: 'Joke Generator', prompt: "Create a joke generator app. It should have a button that says \"Tell me a joke\". When clicked, it displays a new random joke. Include a list of at least 10 jokes in the Javascript." },
];

const initialState: FormState = {
  success: false,
  data: null,
  error: null,
};

export function AppGenerator() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(generateAppAction, initialState);
  const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  useEffect(() => {
    // Only run on new state updates
    if (!state.timestamp) return;

    if (state.success && state.data) {
      localStorage.setItem('generatedCode', state.data);
      setGeneratedCode(state.data);
      setActiveTab('preview');
      toast({
        title: "Success!",
        description: "Your application has been generated.",
      });
    } else if (state.error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: state.error,
      });
      // Do not clear on error so user can see previous code
    }
  }, [state, toast]);

  // Load code from localStorage on initial render
  useEffect(() => {
    const storedCode = localStorage.getItem('generatedCode');
    if (storedCode) {
      setGeneratedCode(storedCode);
    }
  }, []);


  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isPending && prompt && formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode).then(() => {
        toast({ title: "Copied to clipboard!" });
      }).catch(err => {
        toast({ title: "Failed to copy", description: err.message, variant: "destructive" });
      });
    }
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-generated-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const clearAll = () => {
    setPrompt('');
    localStorage.removeItem('generatedCode');
    setGeneratedCode(null);
    toast({ title: "Cleared", description: "The editor and preview have been cleared." });
  };


  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full gap-6">
      <ResizablePanel defaultSize={40} minSize={30}>
        <div className="flex flex-col bg-card rounded-xl shadow-2xl overflow-hidden ring-1 ring-border h-full">
          <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">1. Describe Your Application</h2>
              <p className="text-sm text-muted-foreground mt-1">Start with the main concept. You can refine it or edit the code directly.</p>
          </div>
          
          <div className="flex-grow p-6 flex flex-col">
              <form ref={formRef} action={formAction} className="flex-grow flex flex-col gap-4">
              <Textarea
                  id="prompt-input"
                  name="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  className="w-full flex-grow p-4 bg-background/50 rounded-lg border-2 border-input focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none min-h-[200px] text-base"
                  placeholder="E.g., 'Create a simple to-do list application with a dark, minimalist design.'"
                  required
              />
              <div className="mt-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Examples:</h3>
                  <div className="flex flex-wrap gap-2">
                  {examplePrompts.map(({ name, prompt: examplePrompt }) => (
                      <Button key={name} variant="secondary" size="sm" type="button" onClick={() => setPrompt(examplePrompt)} className="text-xs px-3 py-1 rounded-full">
                      {name}
                      </Button>
                  ))}
                  </div>
              </div>
              
              <div className="mt-auto pt-4 space-y-3">
                  <Button onClick={clearAll} type="button" variant="secondary" className="w-full">
                      <Trash2 className="w-5 h-5 mr-2" />
                      Clear All
                  </Button>
                  <Button type="submit" className="w-full font-bold py-3 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-[1.02] transition-transform" disabled={isPending || !prompt}>
                  {isPending ? (
                      <>
                      <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                      <span>Generating...</span>
                      </>
                  ) : (
                      <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span>Generate Application</span>
                      </>
                  )}
                  </Button>
              </div>
              </form>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={30}>
         <div className="flex flex-col bg-card rounded-xl shadow-2xl overflow-hidden ring-1 ring-border h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="p-2 border-b flex justify-between items-center pr-4">
              <TabsList className="grid w-full max-w-sm grid-cols-2 bg-card">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code" disabled={!generatedCode}>Code Editor</TabsTrigger>
              </TabsList>
              {generatedCode && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy Code">
                    <Copy size={18} />
                  </Button>
                   <Button variant="ghost" size="icon" onClick={downloadCode} title="Download HTML">
                    <Download size={18} />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-grow relative mt-0 rounded-b-lg bg-background/50">
              <TabsContent value="preview" className="w-full h-full m-0">
                {generatedCode ? (
                  <PreviewFrame />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                    <BotMessageSquare className="w-16 h-16 mb-4 text-gray-600" />
                    <h3 className="text-xl font-semibold text-foreground">Your app will appear here</h3>
                    <p className="mt-1">Describe your idea and click 'Generate App' to start.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="code" className="w-full h-full overflow-hidden m-0">
                {generatedCode && <CodeView code={generatedCode} />}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
