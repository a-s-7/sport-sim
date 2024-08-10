import React, {useState} from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateLeft, faShuffle, faUnlock} from "@fortawesome/free-solid-svg-icons";

function WTCControlBar({matchCount, teams, sst}) {

    const options = [
        {value: 'india', label: 'India'},
        {value: 'australia', label: 'Australia'},
        {value: 'england', label: 'England'},
        {value: 'newzealand', label: 'New Zealand'},
        {value: 'southafrica', label: 'South Africa'},
        {value: 'pakistan', label: 'Pakistan'},
        {value: 'westindies', label: 'West Indies'},
        {value: 'srilanka', label: 'Sri Lanka'},
        {value: 'bangladesh', label: 'Bangladesh'},
    ]

    const handleChange = (selectedOptions) => {
        sst(selectedOptions);
    };

    return (
        <div className="wtcHeader">

            <div className="wtcLogoContainer">
                <img
                    src={"https://images.icc-cricket.com/image/private/t_q-best/v1707487856/prd/assets/tournaments/worldtestchampionship/2023-25/Logo_Light_dvrowv.svg"}></img>
            </div>
            <div className="modeContainer">
                <div className="modeButton">
                    {matchCount + " MATCHES"}
                </div>
            </div>
            <div className="filterContainer">
                <div className="filterBar">
                    <Select
                        isMulti
                        borderRadius="10px"
                        menuPosition="fixed"
                        options={options}
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
            <div className="buttonContainer">
                <button>
                    <FontAwesomeIcon icon={faShuffle}/>
                </button>
                <button>
                    <FontAwesomeIcon icon={faArrowRotateLeft} size="lg"/>
                </button>
                <button>
                    <FontAwesomeIcon icon={faUnlock} size="lg"/>
                </button>
            </div>
        </div>
    );
}

export default WTCControlBar;