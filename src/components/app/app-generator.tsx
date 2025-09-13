'use client';

import { useEffect, useState, useTransition } from 'react';
import { useActionState } from 'react';
import { BotMessageSquare, LoaderCircle, Sparkles } from 'lucide-react';

import { generateAppAction, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CodeView } from './code-view';
import { PreviewFrame } from './preview-frame';

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
  const [state, formAction, isPending] = useActionState(generateAppAction, initialState);
  const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    if (state.timestamp) { // Only run on new state updates
      if (state.success && state.data) {
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
      }
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6 h-full">
      <Card className="flex flex-col overflow-hidden bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            <Sparkles className="text-primary" />
            <span>Describe Your App</span>
          </CardTitle>
          <CardDescription>Be specific. Include features, look, and feel.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-4">
          <form action={formAction} className="flex-grow flex flex-col gap-4">
            <Textarea
              id="prompt-input"
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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

      <Card className="flex flex-col overflow-hidden bg-card/70 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="p-2 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code" disabled={!generatedCode}>Code</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-grow relative mt-0 rounded-b-lg bg-background/50">
            <TabsContent value="preview" className="w-full h-full">
              {generatedCode ? (
                <PreviewFrame code={generatedCode} />
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
    </div>
  );
}
