import React, {useEffect, useState} from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateLeft, faShuffle} from "@fortawesome/free-solid-svg-icons";

function ControlBar({refreshFunction, matchCount, teams, sst, urlTag, logoSrc, name, color}) {
    const [teamOptions, setTeamOptions] = useState([]);

    const fetchTeamOptions = async () => {
        let url = `http://127.0.0.1:5000/${urlTag}/teams`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setTeamOptions(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = (selectedOptions) => {
        sst(selectedOptions);
    };

    const resetIncompleteMatches = async () => {
        let teamAcs = "All";

        if (teams.length > 0) {
            teamAcs = teams.map(team => team.value).join("-");
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/${urlTag}/clear/${teamAcs}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response.ok) {
                refreshFunction();
            } else {
                alert("Error: Response not ok")
            }
        } catch (error) {
            alert(error)
        }
    };

    const randomlySimIncompleteMatches = async () => {
        let teamAcs = "All";

        if (teams.length > 0) {
            teamAcs = teams.map(team => team.value).join("-");
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/${urlTag}/sim/${teamAcs}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response.ok) {
                refreshFunction();
            } else {
                alert("Error: Response not ok")
            }
        } catch (error) {
            alert(error)
        }
    };

    useEffect(() => {
        fetchTeamOptions();
    }, []);


    return (
        <div className="controlBarHeader" style={{background: color}}>
            <div className="controlBarLogoContainer">
                <img
                    src={logoSrc} alt={`${name} Logo`}></img>
            </div>
            <div className="controlBarMatchCountContainer">
                {matchCount + " MATCHES"}
            </div>
            <div className="controlBarFilterContainer">
                <div className="teamFilterBar">
                    <Select
                        isMulti
                        borderRadius="10px"
                        menuPosition="fixed"
                        options={teamOptions}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                border: 0,
                                boxShadow: 'none'
                            }),
                        }}
                        value={teams}
                        onChange={handleChange}
                        placeholder="Select teams"
                        noOptionsMessage={({inputValue}) => `No result found for "${inputValue}"`}
                    />
                </div>
            </div>
            <div className="controlBarButtonContainer">
                <button onClick={resetIncompleteMatches}>
                    <FontAwesomeIcon icon={faArrowRotateLeft} size="lg"/>
                </button>
                <button onClick={randomlySimIncompleteMatches}>
                    <FontAwesomeIcon icon={faShuffle} size="lg"/>
                </button>
            </div>
        </div>
    );
}

export default ControlBar;