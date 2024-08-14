import React, {useState} from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateLeft, faShuffle} from "@fortawesome/free-solid-svg-icons";

function IPLControlBar({teams, sst}) {
    const [lockStatus, setLockStatus] = useState(true);

  const iplTeams = [
    { value: 'CSK', label: 'Chennai Super Kings' },
    { value: 'MI', label: 'Mumbai Indians' },
    { value: 'DC', label: 'Delhi Capitals' },
    { value: 'GT', label: 'Gujarat Titans' },
    { value: 'KKR', label: 'Kolkata Knight Riders' },
    { value: 'LSG', label: 'Lucknow Super Giants' },
    { value: 'PBKS', label: 'Punjab Kings' },
    { value: 'RR', label: 'Rajasthan Royals' },
    { value: 'RCB', label: 'Royal Challengers Bengaluru' },
    { value: 'SRH', label: 'Sunrisers Hyderabad' },
];

   const handleChange = (selectedOptions) => {
        sst(selectedOptions);
    };

    const resetIncompleteMatches = async () => {
       alert("Resetting incomplete matches");
    };


    const randomlySimIncompleteMatches = async () => {
        alert("Randomly simulating incomplete matches");
    };


    return (
        <div className="iplHeader">

            <div className="iplLogoContainer">
                <img
                    src="https://www.iplt20.com/assets/images/ipl-logo-new-old.png"></img>
            </div>
            <div className="iplMatchCountContainer">
                    {69 + " MATCHES"}
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

export default IPLControlBar;