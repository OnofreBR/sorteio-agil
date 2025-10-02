import { hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

// Detect if we have SSR-rendered content
const hasSSRContent = rootElement.hasChildNodes();

if (hasSSRContent) {
  // Hydrate pre-rendered content
  hydrateRoot(rootElement, <App />);
} else {
  // Fallback: mount as regular client app (dev mode)
  import("react-dom/client").then(({ createRoot }) => {
    createRoot(rootElement).render(<App />);
  });
}
