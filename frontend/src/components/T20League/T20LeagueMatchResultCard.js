import React from "react";

function T20LeagueMatchResultCard({
                                      homeGradient, awayGradient, homeTeamName, homeTeamLogo, awayTeamName, awayTeamLogo,
                                      leagueName, matchNum, venue, date, time, matchResult, homeTeamRuns, homeTeamOvers,
                                      awayTeamRuns, awayTeamOvers, awayTeamWickets, homeTeamWickets, neutralGradient
                                  }) {

   const getStyle = (section, num) => {
        let background = 'transparent';
        let color = 'black';
        const gradients = [homeGradient, neutralGradient, awayGradient];

        background = matchResult === section ? gradients[num] : 'whitesmoke';
        color = matchResult === section ? 'white' : 'black';

        return {
            background: background,
            color: color
        };
    }

    return (
        <div className="matchCardBody">
            <div className="body">
                <div className="mainBody">
                    <div className='homeTeam'
                         style={getStyle("Home-win", 0)}>

                        <div className="homeScore">
                            <div className="homeRunsWickets">
                                <input className="runsInput"
                                       type={"number"}
                                       min="0"
                                       step="1"
                                       value={homeTeamRuns}
                                       style={{color: matchResult === "Home-win" ? "white" : "black"}}/>
                                <h2>/</h2>
                                <input className="wicketInput"
                                       type={"number"}
                                       min="0"
                                       max="10"
                                       step="1"
                                       value={homeTeamWickets}
                                       style={{color: matchResult === "Home-win" ? "white" : "black"}}/>
                            </div>
                            <div className="homeOvers">
                                <input className="oversInput"
                                       type={"number"}
                                       min="0.0"
                                       max="20.0"
                                       step="0.1"
                                       value={homeTeamOvers}
                                       style={{color: matchResult === "Home-win" ? "white" : "black"}}/>
                            </div>
                        </div>
                        <div className="t20homeName">
                            {homeTeamName}
                        </div>
                        <div className="homeLogo">
                            <img src={homeTeamLogo} alt={`${homeTeamName} Logo`}></img>
                        </div>
                    </div>
                    <div className='neutral'
                         style={getStyle("No-result", 1)}>
                        <div className="date">{date}</div>
                        <div className="vs">VS</div>
                        <div className="time">{time} your time</div>
                    </div>
                    <div className='awayTeam'
                         style={getStyle('Away-win', 2)}>

                        <div className="awayLogo">
                            <img src={awayTeamLogo} alt={`${awayTeamName} Logo`}></img>
                        </div>

                        <div className="t20AwayName">
                            {awayTeamName}
                        </div>

                        <div className="awayScore">
                            <div className="awayRunsWickets">
                                <input className="runsInput"
                                       type={"number"}
                                       min="0"
                                       step="1"
                                       value={awayTeamRuns}
                                       style={{color: matchResult === "Away-win" ? "white" : "black"}}/>
                                <h2>/</h2>
                                <input className="wicketInput"
                                       type={"number"}
                                       min="0"
                                       max="10"
                                       step="1"
                                       value={awayTeamWickets}
                                       style={{color: matchResult === "Away-win" ? "white" : "black"}}/>
                            </div>
                            <div className="awayOvers">
                                <input className="oversInput"
                                       type={"number"}
                                       min="0.0"
                                       max="20.0"
                                       step="0.1"
                                       value={awayTeamOvers}
                                       style={{color: matchResult === "Away-win" ? "white" : "black"}}/>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="infoBody">
                    <div className="matchInfo"
                         style={{
                             color: 'black'
                         }}>
                        {`${leagueName} · Match ${matchNum} · ${venue}`}
                    </div>

                </div>
            </div>
        </div>
    )
        ;
}

export default T20LeagueMatchResultCard;