import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home.tsx";
import Choose from "./components/Choose.tsx";
import ExportImport from "./components/ExportImport.tsx";
import ClimateChange from "./components/ClimateChange.tsx";
import GlobalEvent from "./components/GlobalEvent.tsx";
import Unaffordability from "./components/Unaffordability.tsx";
import Season from "./components/Season.tsx";

// function App(){
//    return <div><Pricing></Pricing></div>
// }

// export default App;
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/exportImport" element={<ExportImport />} />
        <Route path="/climateChange" element={<ClimateChange />} />
        <Route path="/globalEvent" element={<GlobalEvent />} />
        <Route path="/unaffordability" element={<Unaffordability />} />
        <Route path="/season" element={<Season />} />
      </Routes>
    </Router>
  );
}

export default App;
