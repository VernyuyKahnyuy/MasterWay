import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
