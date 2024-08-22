import React, {useState, useEffect} from "react";
import WTCMatchCardPanel from "../components/WTC/WTCMatchCardPanel";
import WTCPointsTable from "../components/WTC/WTCPointsTable";
import ControlBar from "../components/ControlBar";

function WTCPage() {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedStadiums, setSelectedStadiums] = useState([]);

    const [matchesData, setMatchesData] = useState([]);
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
        let teamVal = "All";
        let stadiumVal = "All";

        if(selectedTeams.length > 0) {
            teamVal = selectedTeams.map(team => team.value).join("-");
        }

        if(selectedStadiums.length > 0) {
            stadiumVal = selectedStadiums.map(stadium => stadium.value).join(",");
        }

        let url = `http://127.0.0.1:5000/WTC/matches/${teamVal}/${stadiumVal}`;

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
        let url = `http://127.0.0.1:5000/WTC/points_table`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();

            if (pointsTableData.length > 0) {
                const diffs = calculatePointsTableChanges(result);
                result.forEach(team => {
                    team["diff"] = diffs.get(team.name);
                });
                console.log("IF:", result);
            } else {
                result.forEach(team => {
                    team["diff"] = 0;
                });
                console.log("ELSE:", result);
            }

            setPointsTableData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const calculatePointsTableChanges = (newData) => {
        const diffMap = new Map();

        pointsTableData.forEach((team, index) => {
            diffMap.set(team.name, index)
        })

        newData.forEach((team, index) => {
            console.log(index);
            diffMap.set(team.name, diffMap.get(team.name) - index)
        })

        return diffMap;
    }

    useEffect(() => {
        fetchMatchData();
        fetchPointsTableData()
        // eslint-disable-next-line
    }, [selectedTeams, selectedStadiums]);


    return (
        <div className="WTC">
            <ControlBar refreshFunction={handleRefresh}
                        matchCount={Array.isArray(matchesData[2]) ? matchesData[2].length : 0}
                        teams={selectedTeams}
                        stadiums={selectedStadiums}
                        sst={setSelectedTeams}
                        setStadiums={setSelectedStadiums}
                        urlTag={"WTC"}
                        logoSrc={"https://images.icc-cricket.com/image/private/t_q-best/v1723568183/prd/assets/tournaments/worldtestchampionship/2023-2025/Logo_Light_dvrowv.svg"}
                        name={"ICC World Test Championship"}
                        color={"black"}
            />

            <div className="matchArea">
                <div className="matchCardContainer">
                    <WTCMatchCardPanel key={matchAreaKey}
                                       onMatchUpdate={refreshPointsTable}
                                       matches={matchesData}/>
                </div>
                <div className="tableContainer">
                    <div className="tableWrapper">
                        <WTCPointsTable pointsTableData={pointsTableData}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WTCPage;