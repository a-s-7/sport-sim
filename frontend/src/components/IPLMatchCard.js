import React, {useState} from "react";

function IPLMatchCard({
                          homeGradient, awayGradient, homeTeamName, homeTeamLogo, awayTeamName, awayTeamLogo,
                          leagueName, matchNum, venue, date, time, matchResult, status, onMatchUpdate
                      }) {

    const neutralGradient = 'linear-gradient(135deg, #1B2A7D, #1B2A7D, #FF2A5A)';

    const [selected, setSelected] = useState(matchResult)
    const [hoveredSection, setHoveredSection] = useState(null);


    const getStyle = (section, num) => {
        let background = 'transparent';
        let color = 'black';

        const gradients = [homeGradient, neutralGradient, awayGradient];

        background = (selected === section && section !== "None") ? gradients[num] : 'transparent';
        color = (selected === section && section !== "None") ? 'white' : 'black';

        const isHovered = hoveredSection === section;

        return {
            background: isHovered ? 'whitesmoke' : background,
            color: isHovered ? 'black' : color
        };
    }

    const handleClick = async (result) => {
        setSelected(result);

        try {
            const response = await fetch(`http://127.0.0.1:5000/IPL/match/${matchNum}/${result}`,
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
                        <div className="homeLogo">
                            <img src={homeTeamLogo}></img>
                        </div>
                    </div>
                    <div className='neutral'
                         onClick={() => handleClick('No-result')}
                         onMouseEnter={() => setHoveredSection("No-result")}
                         onMouseLeave={() => setHoveredSection(null)}
                         style={getStyle("No-result", 1)}>
                        <div className="date">{date}</div>
                        <div className="vs">VS</div>
                        <div className="time">{time} your time</div>
                    </div>
                    <div className='awayTeam'
                         onClick={() => handleClick('Away-win')}
                         onMouseEnter={() => setHoveredSection('Away-win')}
                         onMouseLeave={() => setHoveredSection(null)}
                         style={getStyle('Away-win', 2)}>
                        <div className="awayLogo">
                            <img src={awayTeamLogo}></img>
                        </div>
                        <div className="awayName">
                            {awayTeamName}
                        </div>
                    </div>
                </div>
                <div className="infoBody">
                    <div className="matchInfo"
                         onClick={() => resetMatch('None')}
                         onMouseEnter={() => setHoveredSection("None")}
                         onMouseLeave={() => setHoveredSection(null)}
                         style={{
                             background: hoveredSection === "None" ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                             color: 'black'
                         }}>
                        {leagueName + " · " + "Match " + matchNum + " · " + venue}
                    </div>

                </div>
            </div>
        </div>
    )
        ;
}

export default IPLMatchCard;