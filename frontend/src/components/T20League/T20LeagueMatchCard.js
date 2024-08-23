import React, {useRef, useState} from "react";

function T20LeagueMatchCard({
                                homeGradient,
                                awayGradient,
                                homeTeamName,
                                homeTeamLogo,
                                awayTeamName,
                                awayTeamLogo,
                                leagueName,
                                matchNum,
                                venue,
                                date,
                                time,
                                matchResult,
                                onMatchUpdate,
                                homeTeamRuns,
                                homeTeamOvers,
                                awayTeamRuns,
                                awayTeamOvers,
                                awayTeamWickets,
                                homeTeamWickets,
                                urlLeagueTag,
                                neutralGradient
                            }) {

    const [selected, setSelected] = useState(matchResult)
    const [hoveredSection, setHoveredSection] = useState(null);


    const [awayRuns, setAwayRuns] = useState(awayTeamRuns);
    const [awayWickets, setAwayWickets] = useState(awayTeamWickets);
    const [awayOvers, setAwayOvers] = useState(awayTeamOvers);

    const [homeRuns, setHomeRuns] = useState(homeTeamRuns);
    const [homeWickets, setHomeWickets] = useState(homeTeamWickets);
    const [homeOvers, setHomeOvers] = useState(homeTeamOvers);

    const homeRunsRef = useRef(homeTeamRuns);
    const awayRunsRef = useRef(awayTeamRuns);
    const homeOversRef = useRef(homeTeamOvers);
    const awayOversRef = useRef(awayTeamOvers);
    const homeWicketsRef = useRef(homeTeamWickets);
    const awayWicketsRef = useRef(homeWicketsRef);


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
            const response = await fetch(`/${urlLeagueTag}/match/${matchNum}/${result}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response.ok) {
                onMatchUpdate();
            } else {
                alert("Error: Response not ok")
            }
        } catch (error) {
            alert(error)
        }
    }


    const handleOverChange = async (val, area) => {
        // alert("OVERS:" + val)

        let value = parseFloat(val);

        if (value > 20) {
            value = 20;
        }

        value = parseFloat(value.toFixed(2));

        const [intPart, decPart] = value.toString().split('.').map(Number);


        if (decPart > 5) {
            value = intPart + 1.0;
        }

        if (area === 'home') {
            setHomeOvers(value);
        } else {
            setAwayOvers(value);
        }
    }


    const handleRunChange = async (val, area) => {
        let value = parseFloat(val);

        const [intPart, decPart] = value.toString().split('.').map(Number);

        if (decPart) {
            value = intPart + 1.0;
        }

        if (area === 'home') {
            setHomeRuns(value);
        } else {
            setAwayRuns(value);
        }
    }

    const handleWicketChange = async (val, area) => {
        let value = parseFloat(val);

        if (value > 10) {
            value = 10;
        }

        if (area === 'home') {
            setHomeWickets(value);
        } else {
            setAwayWickets(value);
        }
    }

    const handleNRRChange = async () => {
        const homeRunsValue = parseFloat(homeRunsRef.current.value);
        const awayRunsValue = parseFloat(awayRunsRef.current.value);
        const homeOversValue = parseFloat(homeOversRef.current.value);
        const awayOversValue = parseFloat(awayOversRef.current.value);
        const homeWicketsValue = parseFloat(homeWicketsRef.current.value);
        const awayWicketsValue = parseFloat(awayWicketsRef.current.value);

        if (!isNaN(homeWicketsValue) && !isNaN(awayWicketsValue) && !isNaN(homeRunsValue) && !isNaN(awayRunsValue) && !isNaN(homeOversValue) && homeOversValue !== 0 && !isNaN(awayOversValue) && awayOversValue !== 0) {
            try {
                const baseUrl = `/${urlLeagueTag}/nrr/`;
                const url = `${baseUrl}${matchNum}/${homeRunsValue}/${homeWicketsValue}/${homeOversValue}/
                                    ${awayRunsValue}/${awayWicketsValue}/${awayOversValue}`;

                const response = await fetch(url,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                if (response.ok) {
                    onMatchUpdate();
                } else {
                    alert("Error: Response not ok")
                }
            } catch (error) {
                alert(error)
            }
        }
    }

    const resetMatch = async (result) => {
        setHomeRuns('');
        setHomeWickets('');
        setHomeOvers('');

        setAwayRuns('');
        setAwayWickets('');
        setAwayOvers('');

        await handleClick(result);
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

                        <div className="homeScore">
                            <div className="homeRunsWickets">
                                <input className="runsInput"
                                       type={"number"}
                                       min="0"
                                       step="1"
                                       ref={homeRunsRef}
                                       onChange={async (event) => {
                                           await handleRunChange(event.target.value, 'home')
                                           handleNRRChange()
                                       }}
                                       value={homeRuns}
                                       onClick={(e) => e.stopPropagation()}
                                       style={{color: hoveredSection === "Home-win" || selected !== "Home-win" ? "black" : "white"}}/>

                                <h2>/</h2>
                                <input className="wicketInput"
                                       type={"number"}
                                       min="0"
                                       max="10"
                                       step="1"
                                       ref={homeWicketsRef}
                                       onChange={(event) =>
                                           handleWicketChange(event.target.value, 'home')}
                                       value={homeWickets}
                                       onClick={(e) => e.stopPropagation()}
                                       style={{color: hoveredSection === "Home-win" || selected !== "Home-win" ? "black" : "white"}}/>

                            </div>
                            <div className="homeOvers">
                                <input className="oversInput"
                                       type={"number"}
                                       min="0.0"
                                       max="20.0"
                                       step="0.1"
                                       ref={homeOversRef}
                                       onChange={async (event) => {
                                           await handleOverChange(event.target.value, 'home')
                                           handleNRRChange()
                                       }}
                                       value={homeOvers}
                                       onClick={(e) => e.stopPropagation()}
                                       style={{color: hoveredSection === "Home-win" || selected !== "Home-win" ? "black" : "white"}}/>

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
                                       ref={awayRunsRef}
                                       onChange={async (event) => {
                                           await handleRunChange(event.target.value, 'away')
                                           handleNRRChange()
                                       }}
                                       value={awayRuns}
                                       onClick={(e) => e.stopPropagation()}
                                       style={{color: hoveredSection === "Away-win" || selected !== "Away-win" ? "black" : "white"}}/>
                                <h2>/</h2>
                                <input className="wicketInput"
                                       type={"number"}
                                       min="0"
                                       max="10"
                                       step="1"
                                       ref={awayWicketsRef}
                                       onChange={(event) =>
                                           handleWicketChange(event.target.value, 'away')}
                                       value={awayWickets}
                                       onClick={(e) => e.stopPropagation()}
                                       style={{color: hoveredSection === "Away-win" || selected !== "Away-win" ? "black" : "white"}}/>
                            </div>
                            <div className="awayOvers">
                                <input className="oversInput"
                                       type={"number"}
                                       min="0.0"
                                       max="20.0"
                                       step="0.1"
                                       ref={awayOversRef}
                                       onChange={async (event) => {
                                           await handleOverChange(event.target.value, 'away');
                                           handleNRRChange();
                                       }}
                                       value={awayOvers}
                                       onClick={(e) => e.stopPropagation()}
                                       style={{color: hoveredSection === "Away-win" || selected !== "Away-win" ? "black" : "white"}}/>
                            </div>
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
                        {`${leagueName} · Match ${matchNum} · ${venue}`}
                    </div>

                </div>
            </div>
        </div>
    )
        ;
}

export default T20LeagueMatchCard;