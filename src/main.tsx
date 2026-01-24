import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeNativeApp, createNotificationChannel } from "./lib/capacitor";

// Initialize native app features
const initApp = async () => {
  await createNotificationChannel();
  await initializeNativeApp();
};

initApp();

createRoot(document.getElementById("root")!).render(<App />);
