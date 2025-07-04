import React, {useEffect, useState} from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateLeft, faShuffle} from "@fortawesome/free-solid-svg-icons";

function ControlBar({
                        refreshFunction, matchCount, teams, stadiums, sst, setStadiums,
                        urlTag, edition, logo, name, color, matchesFiltered
                    }) {

    const [teamOptions, setTeamOptions] = useState([]);
    const [stadiumOptions, setStadiumOptions] = useState([]);

    const fetchTeamOptions = async () => {

        let url = urlTag === "wtc" ? `/${urlTag}/${edition}/teams` : `/leagues/${urlTag}/${edition}/teams`;
        console.log(url);

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
        let url = urlTag === "wtc" ? `/${urlTag}/${edition}/venues` : `/leagues/${urlTag}/${edition}/venues`;
        console.log(url);

        console.log("edition");

        console.log(edition);


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
        let matchNums = "";

        if (urlTag === "wtc") {
            matchNums = matchesFiltered.map(match => `${match.seriesID}.${match.matchNumber.charAt(0)}`).join("-");
        } else {
            matchNums = matchesFiltered.map(match => match.MatchNumber).join("-")
        }

        try {
            let url = urlTag === "wtc" ? `/${urlTag}/${edition}` : `/leagues/${urlTag}/${edition}`;

            const response = await fetch(`${url}/clear/${matchNums}`,
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
       let matchNums = "";

        if (urlTag === "wtc") {
            matchNums = matchesFiltered.map(match => `${match.seriesID}.${match.matchNumber.charAt(0)}`).join("-");
        } else {
            matchNums = matchesFiltered.map(match => match.MatchNumber).join("-")
        }

        try {

            let url = urlTag === "wtc" ? `/${urlTag}/${edition}` : `/leagues/${urlTag}/${edition}`;

            const response = await fetch(`${url}/sim/${matchNums}`,
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
        // eslint-disable-next-line
    }, [urlTag]);


    return (
        <div className="controlBarHeader" style={{background: color}}>
            <div className="controlBarLogoContainer">
                <img src={logo} alt={`${name} Logo`}></img>
            </div>
            <div className="controlBarMatchCountContainer">
                {matchCount + " MATCHES"}
            </div>
            <div className="controlBarFilterContainer">
                <div className="teamFilterBar">
                    <Select
                        isMulti
                        menuPosition="fixed"
                        options={teamOptions}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                border: 0,
                                boxShadow: 'none',
                                borderRadius: '10px'
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
                                boxShadow: 'none',
                                borderRadius: '10px'
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