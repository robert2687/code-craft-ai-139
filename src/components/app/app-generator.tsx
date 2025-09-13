'use client';

import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { BotMessageSquare, LoaderCircle, Sparkles, PanelLeft, Copy } from 'lucide-react';
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
import { useSidebar } from '../ui/sidebar';

const examplePrompts = [
  { name: 'Calculator', prompt: 'A simple calculator app. It should have buttons for numbers 0-9, basic operations (+, -, *, /), a clear button, and an equals button. The design should be dark, clean, and modern.' },
  { name: 'Weather App', prompt: 'A weather app that shows the current weather. It should have an input for a city name. On search, it should display the temperature, humidity, and wind speed. Use a simple, clean interface with weather icons. The app doesn\'t need a real API, just mock data.' },
  { name: 'Joke Generator', prompt: 'Create a joke generator app. It should have a button that says "Tell me a joke". When clicked, it displays a new random joke. Include a list of at least 10 jokes in the Javascript.' },
];

const initialState: FormState = {
  success: false,
  data: null,
  error: null,
};

export function AppGenerator() {
  const { toggleSidebar } = useSidebar();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(generateAppAction, initialState);
  const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    if (state.timestamp) { // Only run on new state updates
      if (state.success && state.data) {
        // Store the generated code in localStorage
        localStorage.setItem('generatedCode', state.data);
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
        // Clear localStorage on error
        localStorage.removeItem('generatedCode');
      }
    }
  }, [state, toast]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isPending && prompt && formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  const generatedCode = typeof window !== 'undefined' ? localStorage.getItem('generatedCode') || '' : '';

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode).then(() => {
        toast({ title: "Copied to clipboard!" });
      }).catch(err => {
        toast({ title: "Failed to copy", description: err.message, variant: "destructive" });
      });
    }
  };


  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={40} minSize={30}>
        <Card className="flex flex-col overflow-hidden bg-card/70 backdrop-blur-sm h-full rounded-none border-0 border-r">
           <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                <PanelLeft size={18} />
              </Button>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                Describe Your App
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4">
             <CardDescription>Be specific. Include features, look, and feel. Press Enter to submit, Shift+Enter for a new line.</CardDescription>
            <form ref={formRef} action={formAction} className="flex-grow flex flex-col gap-4">
              <Textarea
                id="prompt-input"
                name="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                className="w-full flex-grow p-4 bg-background/50 rounded-lg border-2 border-border focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none min-h-[200px] text-base"
                placeholder="e.g., 'A simple to-do list app where I can add and delete items. The design should be dark and minimalist.'"
                required
              />
              <div className="mt-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Or try an example:</h3>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map(({ name, prompt: examplePrompt }) => (
                    <Button key={name} variant="secondary" size="sm" type="button" onClick={() => setPrompt(examplePrompt)}>
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-4">
                 <Button type="submit" className="w-full font-bold py-3 text-lg" disabled={isPending || !prompt}>
                  {isPending ? (
                    <>
                      <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span>Generate App</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={30}>
         <Card className="flex flex-col overflow-hidden bg-card/70 backdrop-blur-sm h-full rounded-none border-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="p-2 border-b flex justify-between items-center">
              <TabsList className="grid w-full max-w-sm grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code" disabled={!generatedCode}>Code</TabsTrigger>
              </TabsList>
              {generatedCode && (
                 <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="mr-2" />
                  Copy Code
                </Button>
              )}
            </div>
            <div className="flex-grow relative mt-0 rounded-b-lg bg-background/50">
              <TabsContent value="preview" className="w-full h-full">
                {generatedCode ? (
                  <PreviewFrame />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                    <BotMessageSquare className="w-16 h-16 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">Your app will appear here</h3>
                    <p className="mt-1">Describe your idea and click 'Generate App' to start.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="code" className="w-full h-full overflow-hidden">
                {generatedCode && <CodeView code={generatedCode} />}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
