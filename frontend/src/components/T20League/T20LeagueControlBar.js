import React from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateLeft, faShuffle} from "@fortawesome/free-solid-svg-icons";

function T20LeagueControlBar({refreshFunction, matchCount, teams, sst}) {
    const iplTeams = [
        {value: 'CSK', label: 'Chennai Super Kings'},
        {value: 'MI', label: 'Mumbai Indians'},
        {value: 'DC', label: 'Delhi Capitals'},
        {value: 'GT', label: 'Gujarat Titans'},
        {value: 'KKR', label: 'Kolkata Knight Riders'},
        {value: 'LSG', label: 'Lucknow Super Giants'},
        {value: 'PBKS', label: 'Punjab Kings'},
        {value: 'RR', label: 'Rajasthan Royals'},
        {value: 'RCB', label: 'Royal Challengers Bengaluru'},
        {value: 'SRH', label: 'Sunrisers Hyderabad'},
    ];

    const handleChange = (selectedOptions) => {
        sst(selectedOptions);
    };

    const resetIncompleteMatches = async () => {
        let teamNames = "All";

        if (teams.length > 0) {
            teamNames = teams.map(team => team.value).join("-");
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/IPL/clear/${teamNames}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response.ok) {
                const result = await response.json();
                refreshFunction();
            } else {
                alert("Error: Response not ok")
            }
        } catch (error) {
            alert(error)
        }
    };


    const randomlySimIncompleteMatches = async () => {
         let teamNames = "All";

        if (teams.length > 0) {
            teamNames = teams.map(team => team.value).join("-");
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/IPL/sim/${teamNames}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response.ok) {
                const result = await response.json();
                refreshFunction();
            } else {
                alert("Error: Response not ok")
            }
        } catch (error) {
            alert(error)
        }
    };


    return (
        <div className="iplHeader">

            <div className="iplLogoContainer">
                <img
                    src="https://www.iplt20.com/assets/images/ipl-logo-new-old.png"></img>
            </div>
            <div className="iplMatchCountContainer">
                {matchCount + " MATCHES"}
            </div>
            <div className="iplFilterContainer">
                <div className="filterBar">
                    <Select
                        isMulti
                        borderRadius="10px"
                        menuPosition="fixed"
                        options={iplTeams}
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
            <div className="iplButtonContainer">
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

export default T20LeagueControlBar;