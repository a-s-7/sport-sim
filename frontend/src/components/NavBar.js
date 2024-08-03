import React from "react";

function NavBar() {
    return (
        <div className="navContainer">
            <div className="logoArea">SPORT SIM</div>
            <div className="appModeArea">
                <button>PRESET</button>
                <button>UPLOAD</button>
                <button>GENERATE</button>
            </div>
            <div className="userArea">
                USER
            </div>
        </div>
    );
}

export default NavBar;