import React, {useEffect, useState} from "react";
import {NavLink, Route} from "react-router-dom";

function IccEventsLandingPage() {
    const [wtcs, setWtcs] = useState([]);

    const fetchWtcs = async () => {
        let url = '/wtc/info';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setWtcs(result);
            console.log(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchWtcs();
    }, []);

    return (
        <div className="leagueLandingPage">
            <h1>ICC EVENTS</h1>
                {wtcs.map(wtc => (
                    <NavLink key={wtc["edition"]}
                             to={"/" + wtc["acronym"] + "/" + wtc["edition"]}>
                        {wtc["name"] + " " + wtc["edition"] + "-" + (wtc["edition"] + 2)}
                    </NavLink>
                ))}
        </div>
    );
}

export default IccEventsLandingPage;