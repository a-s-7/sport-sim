import React, {useState, useEffect} from "react";
import WTCControlBar from "../components/WTCControlBar";
import MatchCardPanel from "../components/MatchCardPanel";
import WTCPointsTable from "../components/WTCPointsTable";

function WorldTestChampionship() {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [data, setData] = useState([]);

    const [matchAreaKey, setMatchAreaKey] = useState(0);
    const [pointsTableKey, setPointsTableKey] = useState(0);

    const refreshPointsTable = () => {
        setPointsTableKey(pointsTableKey + 1);
    }

    const refreshMatchArea = () => {
        setMatchAreaKey(matchAreaKey + 1);
    }

    const handleRefresh = async () => {
        await fetchData();
        refreshMatchArea();
        refreshPointsTable();
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
    }, [selectedTeams]);


    return (
        <div className="WTC">
            <WTCControlBar refFunc={handleRefresh}
                           matchCount={Array.isArray(data[2]) ? data[2].length : 0}
                           teams={selectedTeams}
                           sst={setSelectedTeams}>
            </WTCControlBar>

            <div className="matchArea">
                <div className="matchCardContainer">
                    <MatchCardPanel key={matchAreaKey}
                                    onMatchUpdate={refreshPointsTable}
                                    matches={data}/>
                </div>
                <div className="tableContainer">
                    <WTCPointsTable key={pointsTableKey}/>
                </div>
            </div>
        </div>
    );
}

export default WorldTestChampionship;