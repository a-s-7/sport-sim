import React from 'react';

function WTCPointsTable({data}){
    return (
        <table className="WTCTable">
            <thead>
                <tr>
                    <th>POS</th>
                    <th>TEAM</th>
                    <th>PLAYED</th>
                    <th>WON</th>
                    <th>LOST</th>
                    <th>DRAW</th>
                    <th>DED</th>
                    <th>POINTS</th>
                    <th>PCT</th>
                </tr>
            </thead>
            <tbody>
            {data.map((team, index) => (
                <tr key={team.name}>
                    <td>{index + 1}</td>
                    <td>
                        <div className="teamNameInfo">
                            <img src={team.flagUrl} alt={team.name + "Flag"}/>
                            {team.name}
                        </div>
                    </td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.lost}</td>
                    <td>{team.draw}</td>
                    <td>{team.ded}</td>
                    <td>{team.points}</td>
                    <td>{team.pct.toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default WTCPointsTable;