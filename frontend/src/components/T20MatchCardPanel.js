import React, {useEffect, useState} from "react";
import IPLMatchCard from "./IPLMatchCard";

function T20MatchCardPanel({matches}) {
    const [league = "", teamData = {}, matchData = []] = matches;

    return (
        matchData.map(match => (
            <div key={`${match.matchNumber}`}>
                    <IPLMatchCard
                        // homeGradient={teamData[match.homeTeam].gradient}
                        // awayGradient={teamData[match.awayTeam].gradient}
                        homeTeamName={match.homeTeam}
                        homeTeamLogo={teamData[match.homeTeam].logo}
                        awayTeamName={match.awayTeam}
                        awayTeamLogo={teamData[match.awayTeam].logo}
                        leagueName={league}
                        matchNum={match.matchNumber}
                        venue={match.location}
                        date={match.date}
                        time={match.startTime}
                    />
            </div>
        ))
    );
}

export default T20MatchCardPanel;