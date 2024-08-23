import './App.css';
import NavBar from "./components/NavBar";
import WTCPage from "./pages/WTCPage";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import T20LeaguePage from "./pages/T20LeaguePage";

// const DEV_ON = false;
// export const BASE_URL = DEV_ON === true ? "http://127.0.0.1:5000" : "";

function App() {

    return (
        <div className="App">
            <NavBar></NavBar>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/wtc" element={<WTCPage/>}/>
                <Route path="/ipl" element={<T20LeaguePage leagueName={"IPL"}
                                                           leagueUrlTag={"IPL"}
                                                           leagueColor={"linear-gradient(135deg, darkblue, darkblue, orange)"}
                                                           leagueLogoSrc={"https://www.iplt20.com/assets/images/ipl-logo-new-old.png"}
                                                           pointsTableColor={"darkblue"}/>}

                />
                <Route path="/bbl" element={<T20LeaguePage leagueName={"BBL"}
                                                           leagueUrlTag={"BBL"}
                                                           leagueColor={"linear-gradient(135deg, black, black, #F9C20C)"}
                                                           leagueLogoSrc={"https://upload.wikimedia.org/wikipedia/en/c/c0/Big_Bash_League_%28logo%29.png"}
                                                           pointsTableColor={"black"}/>}

                />
            </Routes>
        </div>
    );
}

export default App;