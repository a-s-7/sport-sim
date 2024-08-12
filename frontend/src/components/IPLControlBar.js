import React, {useState} from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRotateLeft, faShuffle} from "@fortawesome/free-solid-svg-icons";

function IPLControlBar({}) {
    const [lockStatus, setLockStatus] = useState(true);

  const iplTeams = [
    { value: 'csk', label: 'Chennai Super Kings' },
    { value: 'mi', label: 'Mumbai Indians' },
    { value: 'dc', label: 'Delhi Capitals' },
    { value: 'gt', label: 'Gujarat Titans' },
    { value: 'kkr', label: 'Kolkata Knight Riders' },
    { value: 'lsg', label: 'Lucknow Super Giants' },
    { value: 'pbks', label: 'Punjab Kings' },
    { value: 'rr', label: 'Rajasthan Royals' },
    { value: 'rcb', label: 'Royal Challengers Bengaluru' },
    { value: 'srh', label: 'Sunrisers Hyderabad' },
];

    const handleChange = (selectedOptions) => {
        alert(selectedOptions.map(team => team.label).join(", "));
        // sst(selectedOptions);
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
                        // value={teams}
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