# **App Name**: CodeCraft AI

## Core Features:

- HTML Generation: Generates HTML code based on user prompt using the Gemini API, to create the structure and content of the web app.
- CSS Styling with Tailwind: Uses Tailwind CSS classes to style the HTML elements, based on the user's prompt, for a modern look.
- JavaScript Logic: Generates the JavaScript code that adds dynamic behavior to the application based on the prompt.
- Live Preview: Renders the generated HTML code in an iframe for live preview.
- Code Display: Displays the generated code in a highlighted, readable format using highlight.js.
- Tabbed Interface: Uses tabs to switch between the live preview and the code display.
- Error Handling Tool: Error messages are displayed to the user when something goes wrong during the API call or rendering process. LLM uses this tool to avoid responses blocked for safety reasons, or invalid responses. The tool uses reasoning to attempt a safer answer and present the code block.

## Style Guidelines:

- Primary color: Indigo (#4f46e5) to evoke creativity and innovation.
- Background color: Dark gray (#1e1b4b) for a modern, dark-themed look.
- Accent color: Purple (#4338ca) for highlighting interactive elements.
- Font: 'Inter' (sans-serif) for clean and modern typography. Note: currently only Google Fonts are supported.
- Two-panel layout with user controls on the left and the output on the right. The layout adapts well to different screen sizes.
- Simple, clear icons for the 'generate' button and other actions.
- Subtle loading spinner on the 'Generate' button to indicate activity.