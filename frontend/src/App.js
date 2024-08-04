import './App.css';
import WTCPointsTable from "./components/WTCPointsTable";
import NavBar from "./components/NavBar";
import {useState, useEffect} from "react";
import MatchCardPanel from "./components/MatchCardPanel";

function App() {
    return (
    <div className="App">
        <NavBar></NavBar>
        <div className="matchArea">
            <div className="matchCardContainer">
                <MatchCardPanel/>
            </div>
            <div className="tableContainer">
                <WTCPointsTable/>
            </div>
        </div>
    </div>
  );
}

export default App;
