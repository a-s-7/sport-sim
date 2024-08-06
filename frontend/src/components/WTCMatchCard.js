import React, {useState} from "react";

function WTCMatchCard({
                          homeGradient, awayGradient, homeTeamName, homeTeamFlag, awayTeamName, awayTeamFlag,
                          seriesName, testNum, venue, dateRange, time, seriesId, onMatchUpdate, matchResult,
                          homeDeduction, awayDeduction
                      }) {
    const neutralGradient = 'linear-gradient(135deg, black, black, silver)';

    const [selected, setSelected] = useState(matchResult)
    const [hoveredSection, setHoveredSection] = useState(null);

    const [homeDed, setHomeDed] = useState(homeDeduction);
    const [awayDed, setAwayDed] = useState(awayDeduction);


    const getStyle = (section, num) => {
        let background = 'transparent';
        let color = 'black';

        const gradients = [homeGradient, neutralGradient, awayGradient];

        background = selected === section ? gradients[num] : 'transparent';
        color = selected === section ? 'white' : 'black';

        const isHovered = hoveredSection === section;

        return {
            background: isHovered ? 'rgba(0, 0, 0, 0.1)' : background,
            color: isHovered ? 'black' : color
        };
    }

    const handleClick = async (result) => {
        setSelected(result);

        try {
            const response = await fetch(`http://127.0.0.1:5000/WTC/match/${seriesId}/${testNum.charAt(0)}/${result}`,
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

    const updateDeduction = async (num, teamName) => {
        let val = num

        if (val === "") {
            val = 0;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/WTC/deduction/${seriesId}/${testNum.charAt(0)}/${teamName}/${val}`,
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

    const resetMatch = async (result) => {
        setHomeDed(0);
        setAwayDed(0);
        updateDeduction(0, 'home-team');
        updateDeduction(0, 'away-team');
        handleClick(result);
    }

    return (
        <div className="matchCardBody">
            <div className="body">
                <div className="mainBody">
                    <div className='homeTeam'
                         onClick={() => handleClick('Home-win')}
                         onMouseEnter={() => setHoveredSection("Home-win")}
                         onMouseLeave={() => setHoveredSection(null)}
                         style={getStyle("Home-win", 0)}>
                        <div className="homeName">
                            {homeTeamName}
                        </div>
                        <div className="homeFlag">
                            <img src={homeTeamFlag}></img>
                        </div>
                    </div>
                    <div className='neutral'
                         onClick={() => handleClick('Draw')}
                         onMouseEnter={() => setHoveredSection("Draw")}
                         onMouseLeave={() => setHoveredSection(null)}
                         style={getStyle("Draw", 1)}>
                        <div className="date">{dateRange}</div>
                        <div className="vs">VS</div>
                        <div className="time">{time + " your time"}</div>
                    </div>
                    <div className='awayTeam'
                         onClick={() => handleClick('Away-win')}
                         onMouseEnter={() => setHoveredSection("Away-win")}
                         onMouseLeave={() => setHoveredSection(null)}
                         style={getStyle("Away-win", 2)}>
                        <div className="awayFlag">
                            <img src={awayTeamFlag}></img>
                        </div>
                        <div className="awayName">
                            {awayTeamName}
                        </div>
                    </div>
                </div>
                <div className="infoBody">
                    <div className="homeDed">
                        <input type="number"
                               placeholder="Point Deduction"
                               value={homeDed === 0 ? "" : homeDed}
                               min="0"
                               onChange={(event) => {
                                   setHomeDed(event.target.value)
                                   updateDeduction(event.target.value, 'home-team')
                               }
                               }/>
                    </div>
                    <div className="matchInfo"
                         onClick={() => resetMatch('None')}>
                        {seriesName + " · " + testNum + " · " + venue}
                    </div>
                    <div className="awayDed">
                        <input type="number"
                               placeholder="Point Deduction"
                               value={awayDed === 0 ? "" : awayDed}
                               min="0"
                               onChange={(event) => {
                                   setAwayDed(event.target.value)
                                   updateDeduction(event.target.value, 'away-team')
                               }
                               }/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WTCMatchCard