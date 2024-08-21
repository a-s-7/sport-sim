import React, {useEffect, useState} from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateLeft, faShuffle} from "@fortawesome/free-solid-svg-icons";

function ControlBar({refreshFunction, matchCount, teams, stadiums, sst, setStadiums,
                        urlTag, logoSrc, name, color, matchesFiltered}) {
    const [teamOptions, setTeamOptions] = useState([]);
    const [stadiumOptions, setStadiumOptions] = useState([]);

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

     const fetchVenueOptions = async () => {
        let url = `http://127.0.0.1:5000/${urlTag}/venues`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setStadiumOptions(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleTeamChange = (selectedOptions) => {
        sst(selectedOptions);
    };

    const handleVenueChange = (selectedOptions) => {
        setStadiums(selectedOptions);
    };


    const resetIncompleteMatches = async () => {
        let matchNums = matchesFiltered.map(match => match.matchNumber).join("-")
        console.log(matchNums)

        try {
            const response = await fetch(`http://127.0.0.1:5000/${urlTag}/clear/${matchNums}`,
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
        let matchNums = matchesFiltered.map(match => match.matchNumber).join("-")
        console.log(matchNums)

        try {
            const response = await fetch(`http://127.0.0.1:5000/${urlTag}/sim/${matchNums}`,
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
        fetchVenueOptions();
    }, [urlTag]);


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
                        onChange={handleTeamChange}
                        placeholder="Select teams"
                        noOptionsMessage={({inputValue}) => `No result found for "${inputValue}"`}
                    />
                </div>
                <div className="stadiumFilterBar">
                    <Select
                        isMulti
                        borderRadius="10px"
                        menuPosition="fixed"
                        options={stadiumOptions}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                border: 0,
                                boxShadow: 'none'
                            }),
                        }}
                        value={stadiums}
                        onChange={handleVenueChange}
                        placeholder="Select venues"
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