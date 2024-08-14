import React from "react";

function IPLMatchCard({homeTeamName, homeTeamLogo, awayTeamName, awayTeamLogo,
                          leagueName, matchNum, venue, date, time}) {
    return (
        <div className="matchCardBody">
            <div className="body">
                <div className="mainBody">
                    <div className='homeTeam'>
                        <div className="homeName">
                            {homeTeamName}
                        </div>
                        <div className="homeLogo">
                            <img src={homeTeamLogo}></img>
                        </div>
                    </div>
                    <div className='neutral'>
                        <div className="date">{date}</div>
                        <div className="vs">VS</div>
                        <div className="time">{time} your time</div>
                    </div>
                    <div className='awayTeam'>
                        <div className="awayLogo">
                            <img src={awayTeamLogo}></img>
                        </div>
                        <div className="awayName">
                            {awayTeamName}
                        </div>
                    </div>
                </div>
                <div className="infoBody">
                    <div className="matchInfo">
                        {leagueName + " · " + "Match " + matchNum + " · " + venue}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default IPLMatchCard;