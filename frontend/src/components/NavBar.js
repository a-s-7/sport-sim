import React from "react";
import {NavLink, useLocation} from "react-router-dom";

function NavBar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="navContainer">
            <div className="logoArea">
                <NavLink to="/">SPORT SIM</NavLink>
            </div>
            <div className="appModeArea">
                <NavLink to="/wtc"
                         style={{
                             background: path === "/wtc" ? "black" : "white",
                             color: path === "/wtc" ? "white" : "black"
                         }}>
                    ICC WTC
                </NavLink>
                <NavLink to="/ipl"
                          style={{
                             background: path === "/ipl" ? "black" : "white",
                             color: path === "/ipl" ? "white" : "black"
                         }}>
                    IPL
                </NavLink>
            </div>
            <div className="userArea">
                USER
            </div>
        </div>
    );
}

export default NavBar;