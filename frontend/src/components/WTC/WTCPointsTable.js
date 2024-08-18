import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faMinus} from "@fortawesome/free-solid-svg-icons";

function WTCPointsTable({pointsTableData}) {
      const getDiffDisplay = (diff) => {
        if (diff > 0) {
            return <div className="diffArea">
                <FontAwesomeIcon icon={faCaretUp} size="lg" color="green" style={{ marginRight: '5px'}} />
                 {diff}
            </div>
        } else if (diff < 0) {
            return <div className="diffArea">
                <FontAwesomeIcon icon={faCaretDown} size="lg" color="red" style={{ marginRight: '5px'}}/>
                {diff * -1}
            </div>
        } else {
            return <div className="diffArea">
                <FontAwesomeIcon icon={faMinus} size="lg" color="black"/>
            </div>
        }
    }

    return (
        <table className="WTCTable">
            <thead>
            <tr>
                <th>POS</th>
                <th></th>
                <th>TEAM</th>
                <th>PLAYED</th>
                <th>WON</th>
                <th>LOST</th>
                <th>DRAW</th>
                <th>DED</th>
                <th>POINTS</th>
                <th>PCT</th>
                <th>PCT</th>
            </tr>
            </thead>
            <tbody>
            {pointsTableData.map((team, index) => (
                <tr key={team.name}>
                    <td>{index + 1}</td>
                    <td>
                        {getDiffDisplay(team.diff)}
                    </td>
                    <td>
                        <div className="teamNameInfo">
                            <img src={team.flag} alt={team.name + "Flag"}/>
                            {team.name}
                        </div>
                    </td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.lost}</td>
                    <td>{team.draw}</td>
                    <td>{team.deduction}</td>
                    <td>{team.points}</td>
                    <td>{(team.pointsPercentage).toFixed(2)}</td>
                    <td>{(team.pointsPercentage).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default WTCPointsTable;