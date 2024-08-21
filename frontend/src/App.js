import './App.css';
import NavBar from "./components/NavBar";
import WTCPage from "./pages/WTCPage";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import T20LeaguePage from "./pages/T20LeaguePage";

function App() {
    return (
        <div className="App">
            <NavBar></NavBar>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/wtc" element={<WTCPage/>}/>
                <Route path="/ipl" element={<T20LeaguePage leagueUrlTag={"IPL"}
                                                           leagueName={"IPL"}
                                                           leagueColor={"linear-gradient(135deg, darkblue, darkblue, orange)"}
                                                           leagueLogoSrc={"https://www.iplt20.com/assets/images/ipl-logo-new-old.png"}/>}
                />
            </Routes>
        </div>
    );
}

export default App;