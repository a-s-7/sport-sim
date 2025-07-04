import React, {useState, useEffect} from "react";
import WTCMatchCardPanel from "../components/WTC/WTCMatchCardPanel";
import WTCPointsTable from "../components/WTC/WTCPointsTable";
import ControlBar from "../components/ControlBar";

function WTCPage({leagueUrlTag, leagueName, leagueLogoSrc, leagueColor, pointsTableColor}) {
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
            teamVal = selectedTeams.map(team => team.label).join("-");
        }

        if(selectedStadiums.length > 0) {
            stadiumVal = selectedStadiums.map(stadium => stadium.label).join("#");
        }

        console.log(stadiumVal)

        let url = `/${leagueUrlTag}/matches/${teamVal}/${stadiumVal}`;

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
        let url = `/${leagueUrlTag}/points_table`;

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
            } else {
                result.forEach(team => {
                    team["diff"] = 0;
                });
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
                        urlTag={leagueUrlTag}
                        logoSrc={leagueLogoSrc}
                        name={leagueName}
                        color={leagueColor}
                        matchesFiltered={matchesData[2]}
            />

            <div className="matchArea">
                <div className="matchCardContainer">
                    <WTCMatchCardPanel key={matchAreaKey}
                                       onMatchUpdate={refreshPointsTable}
                                       matches={matchesData}/>
                </div>
                <div className="tableContainer">
                    <div className="tableWrapper">
                        <WTCPointsTable pointsTableData={pointsTableData}
                                        headerColor={pointsTableColor}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WTCPage;