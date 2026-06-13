import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRouter";
import RecommendationsPage from "./pages/RecommendationPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;