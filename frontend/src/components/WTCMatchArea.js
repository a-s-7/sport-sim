import React from "react";
import MatchCardPanel from "./MatchCardPanel";
import WTCPointsTable from "./WTCPointsTable";

function WTCMatchArea({pTableKey, rPointsTable, data}) {
    return (
        <div className="matchArea">
        <div className="matchCardContainer">
            <MatchCardPanel onMatchUpdate={rPointsTable} matches={data}/>
        </div>
        <div className="tableContainer">
            <WTCPointsTable key={pTableKey}/>
        </div>
    </div>);
}

export default WTCMatchArea;