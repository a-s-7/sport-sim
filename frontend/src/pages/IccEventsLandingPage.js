import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";

function IccEventsLandingPage() {
    const [wtc, setWtc] = useState([]);

    const fetchWtc = async () => {
        let url = '/WTC/info';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setWtc(result);
            console.log(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchWtc();
    }, []);

    return (
        <div className="leagueLandingPage">
            <h1>ICC EVENTS</h1>
                <NavLink key={wtc["id"]} to={"/" + wtc["id"]}>
                    {wtc["name"]}
                </NavLink>
        </div>
    );
}

export default IccEventsLandingPage;