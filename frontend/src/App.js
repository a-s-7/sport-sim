import './App.css';
import WTCPointsTable from "./components/WTCPointsTable";
import NavBar from "./components/NavBar";
import {useState, useEffect} from "react";
import MatchCardPanel from "./components/MatchCardPanel";

function App() {
    const [pointsTableKey, setPointsTableKey] = useState(0);

    const refreshPointsTable = () => {
        setPointsTableKey(pointsTableKey + 1);
    }

    return (
    <div className="App">
        <NavBar></NavBar>

        <div className="matchArea">
            <div className="matchCardContainer">
                <MatchCardPanel onMatchUpdate={refreshPointsTable}/>
            </div>
            <div className="tableContainer">
                <WTCPointsTable key={pointsTableKey}/>
            </div>
        </div>
    </div>
  );
}

export default App;
