import React, {useEffect, useState} from 'react';

function T20PointsTable() {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/IPL/points_table")
            .then(res => {
                if (!res.ok) {
                    throw new Error("Response was not ok");
                }
                return res.json();
            })
            .then(data => {
                setData(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <table className="T20Table">
            <thead>
            <tr>
                <th>POS</th>
                <th>TEAM</th>
                <th>PLAYED</th>
                <th>WON</th>
                <th>LOST</th>
                <th>NR</th>
                <th>NRR</th>
                <th>FOR</th>
                <th>AGAINST</th>
                <th>POINTS</th>
                <th>LAST FIVE</th>
            </tr>
            </thead>
            <tbody>
            {data.map((team, index) => (
                <tr key={team.acronym}>
                    <td>{index + 1}</td>
                    <td>
                        <div className="teamNameInfo">
                            <img src={team.logo} alt={team.acronym + "Flag"}/>
                            {team.acronym}
                        </div>
                    </td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.lost}</td>
                    <td>{team.noResult}</td>
                    <td>{team.nrr.toFixed(3)}</td>
                    <td>{team.runsScored + "/" + (team.ballsFaced / 6).toFixed(1)}</td>
                    <td>{team.oppositionRunsScored + "/" + (team.oppositionBallsFaced / 6).toFixed(1)}</td>
                    <td>{team.points}</td>
                    <td>{team.previous5.map((value) => (
                        value === true ? 'W' : value === false ? 'L' : 'N'
                    )).join('')}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default T20PointsTable;