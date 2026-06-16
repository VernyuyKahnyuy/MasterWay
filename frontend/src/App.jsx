import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-1">
        <AppRouter />
      </main>
    </BrowserRouter>
  );
}

export default App;
