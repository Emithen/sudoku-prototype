import { HashRouter, Route, Routes } from "react-router";
import { Home } from "./pages/home/Home";
import { Game } from "./pages/game/Game";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="game" element={<Game />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
