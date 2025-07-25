import React from "react";
import T20LeagueMatchCard from "./T20LeagueMatchCard";
import T20LeagueMatchResultCard from "./T20LeagueMatchResultCard";


function T20LeagueMatchCardPanel({onMatchUpdate, matches, leagueUrlTag, leagueEdition, cardNeutralGradient}) {

    const [league = "", leagueName = "", teamData = {}, matchData = []] = matches;

    return (
        matchData.map(match => (
            <div key={`${match.MatchNumber}`}>
                {match.status === "incomplete" ? <T20LeagueMatchCard
                    homeGradient={teamData[match.HomeTeam].gradient}
                    awayGradient={teamData[match.AwayTeam].gradient}
                    homeTeamName={match.HomeTeam}
                    homeTeamLogo={teamData[match.HomeTeam].logo}
                    awayTeamName={match.AwayTeam}
                    awayTeamLogo={teamData[match.AwayTeam].logo}
                    leagueName={league}
                    leagueID={leagueName}
                    matchNum={match.MatchNumber}
                    venue={match.Location}
                    date={match.date}
                    time={match.startTime}
                    matchResult={match.result}
                    onMatchUpdate={onMatchUpdate}
                    leagueUrlTag={leagueUrlTag}
                    homeTeamRuns={match.homeTeamRuns}
                    homeTeamWickets={match.homeTeamWickets}
                    homeTeamOvers={match.homeTeamOvers}
                    awayTeamRuns={match.awayTeamRuns}
                    awayTeamWickets={match.awayTeamWickets}
                    awayTeamOvers={match.awayTeamOvers}
                    neutralGradient={cardNeutralGradient}
                    leagueEdition={leagueEdition}
                /> : <T20LeagueMatchResultCard
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

                    homeTeamRuns={match.homeTeamRuns}
                    homeTeamWickets={match.homeTeamWickets}
                    homeTeamOvers={match.homeTeamOvers}
                    awayTeamRuns={match.awayTeamRuns}
                    awayTeamWickets={match.awayTeamWickets}
                    awayTeamOvers={match.awayTeamOvers}
                    neutralGradient={cardNeutralGradient}
                />
                }

            </div>
        ))
    );
}

export default T20LeagueMatchCardPanel;