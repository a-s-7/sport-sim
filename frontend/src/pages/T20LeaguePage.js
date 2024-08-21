import React, {useEffect, useState} from "react";
import T20LeagueMatchCardPanel from "../components/T20League/T20LeagueMatchCardPanel";
import T20LeaguePointsTable from "../components/T20League/T20LeaguePointsTable";
import ControlBar from "../components/ControlBar";

function T20LeaguePage({leagueUrlTag, leagueName, leagueLogoSrc, leagueColor, pointsTableColor}) {
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

        let url = `http://127.0.0.1:5000/${leagueUrlTag}/matches/${teamVal}/${stadiumVal}`;

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
        let url = `http://127.0.0.1:5000/${leagueUrlTag}/points_table`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();

            if (pointsTableData.length > 0) {
                const diffs = calculatePointsTableChanges(result);
                result.forEach(team => {
                    team["diff"] = diffs.get(team.acronym);
                });

                // console.log("IF:", result);
            } else {
                result.forEach(team => {
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

        pointsTableData.forEach((team, index) => {
            diffMap.set(team.acronym, index)
        })

        newData.forEach((team, index) => {
            diffMap.set(team.acronym, diffMap.get(team.acronym) - index)
        })

        return diffMap;
    }

    useEffect(() => {
        handleRefresh();
    }, [selectedTeams, selectedStadiums]);

    const resetState = async () => {
        await setSelectedTeams([]);
        await setSelectedStadiums([]);
        await setMatchesData([]);
        await setPointsTableData([]);
    }

    useEffect(() => {
        resetState();
        handleRefresh();
    }, [leagueUrlTag]);


    return (
        <div className="T20LeaguePage">
            <ControlBar
                refreshFunction={handleRefresh}
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

            <div className="matchArea" >
                <div className="matchCardContainer">
                    <T20LeagueMatchCardPanel key={matchAreaKey}
                                             onMatchUpdate={refreshPointsTable}
                                             matches={matchesData}
                                             urlLeagueTag={leagueUrlTag}
                                             cardNeutralGradient={leagueColor}/>
                </div>
                <div className="tableContainer">
                    <div className="tableWrapper">
                        <T20LeaguePointsTable pointsTableData={pointsTableData}
                                                headerColor={pointsTableColor}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default T20LeaguePage;