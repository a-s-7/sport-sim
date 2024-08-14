import React, {useEffect, useState} from "react";
import IPLControlBar from "../components/IPLControlBar";
import T20MatchCardPanel from "../components/T20MatchCardPanel";
import IPLMatchCard from "../components/IPLMatchCard";

function IPLPage() {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        let url = `http://127.0.0.1:5000/IPL/matches/All`;

        if (selectedTeams.length > 0) {
            let teamNames = selectedTeams.map(team => team.value).join("-");
            url = `http://127.0.0.1:5000/IPL/matches/${teamNames}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            console.log(result);
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

     useEffect(() => {
        fetchData();
    }, [selectedTeams]);

    return (
        <div className="IPLPage">
            <IPLControlBar teams={selectedTeams}
                            sst={setSelectedTeams}></IPLControlBar>

            <div className="matchArea">
                <div className="matchCardContainer">
                    <T20MatchCardPanel matches={data}></T20MatchCardPanel>
                </div>
                <div className="tableContainer">
                </div>
            </div>
        </div>
    );
}

export default IPLPage;
