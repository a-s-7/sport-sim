import React, {useState} from "react";

function WTCMatchCard({
                          homeGradient, awayGradient, homeTeamName, homeTeamFlag, awayTeamName, awayTeamFlag,
                          seriesName, testNum, venue, dateRange, time, seriesId, onMatchUpdate, matchResult
                      }) {
    const neutralGradient = 'linear-gradient(135deg, black, black, silver)';
    const [selected, setSelected] = useState(matchResult)

    const handleClick = async (team) => {
        setSelected(team);

        try {
            const response = await fetch(`http://127.0.0.1:5000/WTC/match/${seriesId}/${testNum.charAt(0)}/${team}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response.ok) {
                const result = await response.json();
                onMatchUpdate();
            } else {
                alert("Error: Response not ok")
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div className="matchCardBody">
            <div className="body">
                <div className="mainBody">
                    <div className='homeTeam' onClick={() => handleClick('Home-win')}
                         style={{
                             background: selected === 'Home-win' ? homeGradient : 'transparent',
                             color: selected === 'Home-win' ? 'white' : 'black'
                         }}>
                        <div className="homeName">
                            {homeTeamName}
                        </div>
                        <div className="homeFlag">
                            <img src={homeTeamFlag}></img>
                        </div>
                    </div>
                    <div className='neutral' onClick={() => handleClick('Draw')}
                         style={{
                             background: selected === 'Draw' ? neutralGradient : 'transparent',
                             color: selected === 'Draw' ? 'white' : 'black'
                         }}>
                        <div className="date">{dateRange}</div>
                        <div className="vs">VS</div>
                        <div className="time">{time + " your time"}</div>
                    </div>
                    <div className='awayTeam' onClick={() => handleClick('Away-win')}
                         style={{
                             background: selected === 'Away-win' ? awayGradient : 'transparent',
                             color: selected === 'Away-win' ? 'white' : 'black'
                         }}>
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