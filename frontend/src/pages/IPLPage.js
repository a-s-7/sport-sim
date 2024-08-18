import React, {useEffect, useState} from "react";
import IPLControlBar from "../components/IPLControlBar";
import T20MatchCardPanel from "../components/T20MatchCardPanel";
import T20PointsTable from "../components/T20PointsTable";

function IPLPage() {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [matchesData, setMatchesData] = useState([]);

    const [oldPointsTableData, setOldPointsTableData] = useState([]);
    const [pointsTableData, setPointsTableData] = useState([]);

    const [matchAreaKey, setMatchAreaKey] = useState(0);

    const refreshPointsTable = async () => {
        await fetchPointsTableData();
    }

    const refreshMatchArea = async () => {
        await fetchMatchData();
        setMatchAreaKey(matchAreaKey + 1);
    }

    const handleRefresh = async () => {
        await refreshMatchArea();
        await refreshPointsTable();
    }

    const fetchMatchData = async () => {
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
            setMatchesData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchPointsTableData = async () => {
        let url = `http://127.0.0.1:5000/IPL/points_table`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();

            if (pointsTableData.length > 0) {
                const diffs = calculatePointsTableChanges(result);
                result.map(team => {
                    team["diff"] = diffs.get(team.acronym);
                });

                // console.log("IF:", result);
            } else {
                result.map(team => {
                    team["diff"] = 0;
                });
                // console.log("ELSE: ", result);
            }

            setPointsTableData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const calculatePointsTableChanges = (newData) => {
        const diffMap = new Map();

        pointsTableData.map((team, index) => {
            diffMap.set(team.acronym, index)
        })

        newData.map((team, index) => {
            diffMap.set(team.acronym, diffMap.get(team.acronym) - index)
        })

        return diffMap;
    }

    useEffect(() => {
        fetchMatchData();
        fetchPointsTableData()
    }, [selectedTeams]);

    return (
        <div className="IPLPage">
            <IPLControlBar
                refreshFunction={handleRefresh}
                matchCount={Array.isArray(matchesData[2]) ? matchesData[2].length : 0}
                teams={selectedTeams}
                sst={setSelectedTeams}></IPLControlBar>

            <div className="matchArea">
                <div className="matchCardContainer">
                    <T20MatchCardPanel key={matchAreaKey}
                                       onMatchUpdate={refreshPointsTable}
                                       matches={matchesData}/>
                </div>
                <div className="tableContainer">
                    <div className="tableWrapper">
                        <T20PointsTable pointsTableData={pointsTableData}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IPLPage;
