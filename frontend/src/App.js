import './App.css';
import NavBar from "./components/NavBar";
import WorldTestChampionship from "./pages/WorldTestChampionship";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import IPL from "./pages/IPL";

function App() {
    return (
        <div className="App">
            <NavBar></NavBar>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/wtc" element={<WorldTestChampionship/>}/>
                <Route path="/ipl" element={<IPL/>}/>
            </Routes>
        </div>
    );
}

export default App;