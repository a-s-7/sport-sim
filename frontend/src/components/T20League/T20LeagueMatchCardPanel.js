import React from "react";
import T20LeagueMatchCard from "./T20LeagueMatchCard";

function T20LeagueMatchCardPanel({onMatchUpdate, matches}) {

    const [league = "", teamData = {}, matchData = []] = matches;

    return (
        matchData.map(match => (
            <div key={`${match.matchNumber}`}>
                    <T20LeagueMatchCard
                        homeGradient={teamData[match.homeTeam].gradient}
                        awayGradient={teamData[match.awayTeam].gradient}
                        homeTeamName={match.homeTeam}
                        homeTeamLogo={teamData[match.homeTeam].logo}
                        awayTeamName={match.awayTeam}
                        awayTeamLogo={teamData[match.awayTeam].logo}
                        leagueName={league}
                        matchNum={match.matchNumber}
                        venue={match.location}
                        date={match.date}
                        time={match.startTime}
                        matchResult={match.result}
                        status={match.status}
                        onMatchUpdate={onMatchUpdate}

                        homeTeamRuns={match.homeTeamRuns}
                        homeTeamOvers={match.homeTeamOvers}
                        awayTeamRuns={match.awayTeamRuns}
                        awayTeamOvers={match.awayTeamOvers}
                    />
            </div>
        ))
    );
}

export default T20LeagueMatchCardPanel;