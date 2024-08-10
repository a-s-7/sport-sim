import './App.css';
import NavBar from "./components/NavBar";
import {useState, useEffect} from "react";
import WTCControlBar from "./components/WTCControlBar";
import WTCMatchArea from "./components/WTCMatchArea";


function App() {
    const [pointsTableKey, setPointsTableKey] = useState(0);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [data, setData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshPointsTable = () => {
        setPointsTableKey(pointsTableKey + 1);
    }

    const refreshMatchArea = () => {
        setRefreshKey(refreshKey + 1);
    }

    const fetchData = async () => {
        let url = `http://127.0.0.1:5000/WTC/matches/All`;

        if (selectedTeams.length > 0) {
            let teamNames = selectedTeams.map(team => team.label).join("-");
            url = `http://127.0.0.1:5000/WTC/matches/${teamNames}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTeams, refreshKey]);


    return (
        <div className="App">
            <NavBar></NavBar>
            <WTCControlBar rMeth={refreshMatchArea}
                           matchCount={Array.isArray(data[2]) ? data[2].length : 0}
                           teams={selectedTeams}
                           sst={setSelectedTeams}></WTCControlBar>
            <WTCMatchArea key={refreshKey}
                            pTableKey={pointsTableKey}
                          rPointsTable={refreshPointsTable}
                          data={data}></WTCMatchArea>
        </div>
    );
}

export default App;
