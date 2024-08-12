import React from "react";
import {NavLink} from "react-router-dom";

function NavBar() {
    return (
        <div className="navContainer">
            <div className="logoArea">
                <NavLink to="/">SPORT SIM</NavLink>
            </div>
            <div className="appModeArea">
                <NavLink to="/wtc">ICC WTC</NavLink>
            </div>
            <div className="userArea">
                USER
            </div>
        </div>
    );
}

export default NavBar;