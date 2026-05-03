import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/home/Home";
import { Game } from "./pages/game/Game";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="game" element={<Game />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
