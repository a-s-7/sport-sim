import './App.css';
import WTCPointsTable from "./components/WTCPointsTable";
import NavBar from "./components/NavBar";
import {useState, useEffect} from "react";
import MatchCardPanel from "./components/MatchCardPanel";

function App() {
   const teams = {
    "INDIA": {
        name: "INDIA",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/4.png?v=",
        played: 9,
        won: 6,
        lost: 2,
        draw: 1,
        ded: 2,
        points: 74,
        pct: 68.52,
        gradient: 'linear-gradient(135deg, blue, darkorange)'
    },
    "AUSTRALIA": {
        name: "AUSTRALIA",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/1.png?v=7",
        played: 12,
        won: 8,
        lost: 3,
        draw: 1,
        ded: 10,
        points: 90,
        pct: 62.50,
        gradient: 'linear-gradient(135deg, green, forestgreen, gold)'
    },
    "NEW ZEALAND": {
        name: "NEW ZEALAND",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/5.png?v=7",
        played: 6,
        won: 3,
        lost: 3,
        draw: 0,
        ded: 0,
        points: 36,
        pct: 50.00,
        gradient: 'linear-gradient(135deg, black, teal)'
    },
    "SRI LANKA": {
        name: "SRI LANKA",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/8.png?v=7",
        played: 4,
        won: 2,
        lost: 2,
        draw: 0,
        ded: 0,
        points: 24,
        pct: 50.00,
        gradient: 'linear-gradient(135deg, darkblue, rgb(255, 180, 0))'
    },
    "PAKISTAN": {
        name: "PAKISTAN",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/6.png?v=7",
        played: 5,
        won: 2,
        lost: 3,
        draw: 0,
        ded: 2,
        points: 22,
        pct: 36.66,
        gradient: 'linear-gradient(135deg, darkgreen, darkgreen, lawngreen)'
    },
    "ENGLAND": {
        name: "ENGLAND",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/3.png?v=7",
        played: 12,
        won: 5,
        lost: 6,
        draw: 1,
        ded: 19,
        points: 45,
        pct: 31.25,
        gradient: 'linear-gradient(135deg, red, red, white)'
    },
    "SOUTH AFRICA": {
        name: "SOUTH AFRICA",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/7.png?v=7",
        played: 4,
        won: 1,
        lost: 3,
        draw: 0,
        ded: 0,
        points: 12,
        pct: 25.00,
        gradient: 'linear-gradient(135deg, darkgreen, gold)'
    },
    "BANGLADESH": {
        name: "BANGLADESH",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/2.png?v=7",
        played: 4,
        won: 1,
        lost: 3,
        draw: 0,
        ded: 0,
        points: 12,
        pct: 25.00,
        gradient: 'linear-gradient(135deg, darkred, darkred, forestgreen)'
    },
    "WEST INDIES": {
        name: "WEST INDIES",
        flagUrl: "https://assets-icc.sportz.io/static-assets/buildv3-stg/images/teams/9.png?v=7",
        played: 6,
        won: 1,
        lost: 4,
        draw: 1,
        ded: 0,
        points: 16,
        pct: 22.22,
        gradient: 'linear-gradient(135deg, maroon, rgb(255, 235, 0))'
    }
};

    return (
    <div className="App">
        <NavBar></NavBar>
        <div className="matchArea">
            <div className="matchCardContainer">
                <MatchCardPanel/>
            </div>
            <div className="tableContainer">
                <WTCPointsTable data={Object.values(teams)}/>
            </div>
        </div>
    </div>
  );
}

export default App;
