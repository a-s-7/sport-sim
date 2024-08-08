import React, {useEffect, useState} from "react";
import WTCMatchCard from "./WTCMatchCard";

function MatchCardPanel({onMatchUpdate}) {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/WTC/matches");
                if (!response.ok) {
                    throw new Error("Response was not ok");
                }
                const result = await response.json();
                console.log("Fetched data:", result);
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    const [teamData = {}, seriesData = {}, matchData = []] = data;

    return (
        matchData.map(match => (
            <div key={match.matchSeriesID + "-" + match.matchNumber.charAt(0)}>
                <WTCMatchCard
                    homeGradient={teamData[match.homeTeam].gradient}
                    awayGradient={teamData[match.awayTeam].gradient}
                    homeTeamName={match.homeTeam}
                    homeTeamFlag={teamData[match.homeTeam].flag}
                    awayTeamName={match.awayTeam}
                    awayTeamFlag={teamData[match.awayTeam].flag}
                    seriesName={seriesData[match.seriesID]}
                    testNum={match.matchNumber}
                    venue={match.location}
                    dateRange={match.dateRange}
                    time={match.startTime}
                    seriesId={match.seriesID}
                    matchResult={match.result}
                    onMatchUpdate={onMatchUpdate}
                    homeDeduction={match.homeDed}
                    awayDeduction={match.awayDed}
                />
            </div>
        ))
    );
}

export default MatchCardPanel;