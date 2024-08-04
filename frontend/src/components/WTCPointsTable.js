import React, {useEffect, useState} from 'react';

function WTCPointsTable() {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/WTC/points_table")
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
                    <td>{team.pointsPercentage}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default WTCPointsTable;