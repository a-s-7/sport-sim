import React, {useState, useEffect} from "react";
import {NavLink} from "react-router-dom";

function LeagueLandingPage() {
    const [leagues, setLeagues] = useState([]);

    const fetchLeagues = async () => {
        let url = '/league_info';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setLeagues(result);
            console.log(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchLeagues();
    }, []);

    return (
        <div className="leagueLandingPage">
            {leagues.map(league => (
                <NavLink key={league["id"]} to={"/" + league["id"]}>
                    {league["name"]}
                </NavLink>
            ))}
        </div>
    );
}

export default LeagueLandingPage;