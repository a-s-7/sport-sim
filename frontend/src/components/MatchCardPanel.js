import React, {useEffect, useState} from "react";
import WTCMatchCard from "./WTCMatchCard";

function MatchCardPanel({series}) {
    const [data, setData] = useState([])

    useEffect(() => {
    fetch("http://127.0.0.1:5000/WTC_matches")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            }
            return res.json();
        })
        .then(data => {
            setData(data);
        })
        .catch(error => console.error("Error fetching data:", error));
}, []);

    return (
    data.map(seriesItem => (
        seriesItem.matches.map(match => (
            <div key={`${seriesItem.id}${match.matchNumber}`}>
                <WTCMatchCard
                    homeGradient={seriesItem.homeGradient}
                    awayGradient={seriesItem.awayGradient}
                    homeTeamName={seriesItem.homeTeam}
                    homeTeamFlag={seriesItem.homeFlag}
                    awayTeamName={seriesItem.awayTeam}
                    awayTeamFlag={seriesItem.awayFlag}
                />
            </div>
        ))
    ))
);
}

export default MatchCardPanel;