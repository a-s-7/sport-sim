import React, {useEffect, useState} from "react";
import IPLControlBar from "../components/IPLControlBar";
import T20MatchCardPanel from "../components/T20MatchCardPanel";
import IPLMatchCard from "../components/IPLMatchCard";
import T20PointsTable from "../components/T20PointsTable";

function IPLPage() {
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
        let url = `http://127.0.0.1:5000/IPL/matches/All`;

        if (selectedTeams.length > 0) {
            let teamNames = selectedTeams.map(team => team.value).join("-");
            url = `http://127.0.0.1:5000/IPL/matches/${teamNames}`;
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
        <div className="IPLPage">
            <IPLControlBar
                refreshFunction={handleRefresh}
                matchCount={Array.isArray(data[2]) ? data[2].length : 0}
                teams={selectedTeams}
                sst={setSelectedTeams}></IPLControlBar>


            <div className="matchArea">
                <div className="matchCardContainer">
                    <T20MatchCardPanel key={matchAreaKey}
                                       onMatchUpdate={refreshPointsTable}
                                       matches={data}/>
                </div>
                <div className="tableContainer">
                    <T20PointsTable key={pointsTableKey}/>
                </div>
            </div>
        </div>
    );
}

export default IPLPage;
