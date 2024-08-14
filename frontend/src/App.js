import './App.css';
import NavBar from "./components/NavBar";
import WTCPage from "./pages/WTCPage";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import IPLPage from "./pages/IPLPage";

function App() {
    return (
        <div className="App">
            <NavBar></NavBar>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/wtc" element={<WTCPage/>}/>
                <Route path="/ipl" element={<IPLPage/>}/>
            </Routes>
        </div>
    );
}

export default App;