import React from "react";
import {NavLink, useLocation} from "react-router-dom";

function NavBar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="navContainer">
            <div className="logoArea">
                <NavLink to="/">CRIC SIM</NavLink>
            </div>
            <div className="appModeArea">
                <NavLink to="/leagues"
                         style={{
                            borderBottom: path === "/leagues" ? "1px solid black" : "none"
                         }}>
                    LEAGUES
                </NavLink>
                <NavLink to="/events"
                         style={{
                            borderBottom: path === "/icc_events" ? "1px solid black" : "none"
                         }}>
                    EVENTS
                </NavLink>
            </div>
        </div>
    );
}

export default NavBar;