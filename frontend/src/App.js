import './App.css';
import WTCPointsTable from "./components/WTCPointsTable";
import NavBar from "./components/NavBar";
import {useState, useEffect} from "react";
import MatchCardPanel from "./components/MatchCardPanel";
import Select from 'react-select'
import makeAnimated, {MultiValue} from 'react-select/animated';

function App() {
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

    const [pointsTableKey, setPointsTableKey] = useState(0);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [data, setData] = useState([]);

    const refreshPointsTable = () => {
        setPointsTableKey(pointsTableKey + 1);
    }

    const handleChange = (selectedOptions) => {
        setSelectedTeams(selectedOptions);
    };

    const fetchData = async () => {
        let url = `http://127.0.0.1:5000/WTC/matches/All`;

        if (selectedTeams.length > 0) {
            let teamNames = selectedTeams.map(team => team.label).join("-");
            url = `http://127.0.0.1:5000/WTC/matches/${teamNames}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTeams]);

    return (
        <div className="App">
            <NavBar></NavBar>

            <div className="wtcHeader">

                <div className="wtcLogoContainer">
                    <img
                        src={"https://images.icc-cricket.com/image/private/t_q-best/v1707487856/prd/assets/tournaments/worldtestchampionship/2023-25/Logo_Light_dvrowv.svg"}></img>
                </div>
                <div className="filterContainer">
                    <Select
                        isMulti
                        options={options}
                        value={selectedTeams}
                        onChange={handleChange}
                        placeholder="Select teams"
                        noOptionsMessage={({inputValue}) => `No result found for "${inputValue}"`}
                    />
                </div>
                <div className="buttonContainer">
                    <button>RANDOMIZE</button>
                    <button>CLEAR</button>
                </div>

            </div>

            <div className="matchArea">
                <div className="matchCardContainer">
                    <MatchCardPanel onMatchUpdate={refreshPointsTable} matches={data}/>
                </div>
                <div className="tableContainer">
                    <WTCPointsTable key={pointsTableKey}/>
                </div>
            </div>


        </div>
    );
}

export default App;
