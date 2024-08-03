import React, {useState} from "react";

function WTCMatchCard({homeGradient, awayGradient, homeTeamName, homeTeamFlag, awayTeamName, awayTeamFlag,
                      seriesName, testNum, venue, dateRange, time}) {
    const neutralGradient = 'linear-gradient(135deg, black, black, silver)';
    const [selected, setSelected] = useState(null);
    const handleClick = (team) => {
        setSelected(team);
    }

    return (
        <div className="matchCardBody">
            <div className="body">
                <div className="mainBody">
                    <div className='homeTeam' onClick={() => handleClick('home')}
                    style={{background: selected === 'home' ? homeGradient: 'transparent',
                            color: selected === 'home' ? 'white': 'black'}}>
                        <div className="homeName">
                            {homeTeamName}
                        </div>
                        <div className="homeFlag">
                            <img src={homeTeamFlag}></img>
                        </div>
                    </div>
                    <div className='neutral' onClick={() => handleClick('neutral')}
                         style={{background: selected === 'neutral' ? neutralGradient : 'transparent',
                                color: selected === 'neutral' ? 'white': 'black'}}>
                        <div className="date">{dateRange}</div>
                        <div className="vs">VS</div>
                        <div className="time">{time + " your time"}</div>
                    </div>
                    <div className='awayTeam' onClick={() => handleClick('away')}
                         style={{background: selected === 'away' ? awayGradient : 'transparent',
                                color: selected === 'away' ? 'white': 'black'}}>
                        <div className="awayFlag">
                            <img src={awayTeamFlag}></img>
                        </div>
                        <div className="awayName">
                        {awayTeamName}
                        </div>
                    </div>
                </div>
                <div className="infoBody">
                    {seriesName + " · " + testNum + " · " + venue}
                </div>
            </div>
        </div>
    );
}

export default WTCMatchCard