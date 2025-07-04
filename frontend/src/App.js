import './App.css';
import NavBar from "./components/NavBar";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import T20LeaguePage from "./pages/T20LeaguePage";
import LeagueLandingPage from "./pages/LeagueLandingPage";
import IccEventsLandingPage from "./pages/IccEventsLandingPage";
import React, {useEffect, useState} from "react";
import WTCPage from "./pages/WTCPage";

// const DEV_ON = false;
// export const BASE_URL = DEV_ON === true ? "http://127.0.0.1:5000" : "";

function App() {
    const [leagues, setLeagues] = useState([]);
    const [wtc, setWtc] = useState([]);

    const fetchLeagues = async () => {
        let url = `/league_info`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setLeagues(result);
            console.log(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

     const fetchWtc = async () => {
        let url = '/WTC/info';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const result = await response.json();
            setWtc(result);
            console.log(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchLeagues();
        fetchWtc();
    }, []);

    return (
        <div className="App">
            <NavBar></NavBar>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/leagues" element={<LeagueLandingPage/>}/>
                <Route path="/icc_events" element={<IccEventsLandingPage/>}/>

                {leagues.map(league => (
                    <Route path={"/" + league["id"]} key={league["id"]} element={
                         <T20LeaguePage leagueUrlTag={league["id"]}
                                        leagueName = {league["name"]}
                                        leagueLogoSrc = {league["logo"]}
                                        leagueColor = {league["controlBarColor"]}
                                        pointsTableColor = {league["pointsTableColor"]}/>
                    }>
                    </Route>))
                }
                {
                    <Route path={"/" + wtc["id"]} key={wtc["id"]} element={
                        <WTCPage leagueUrlTag={wtc["id"]}
                                 leagueName = {wtc["name"]}
                                 leagueLogoSrc = {wtc["logo"]}
                                 leagueColor = {wtc["controlBarColor"]}
                                 pointsTableColor = {wtc["pointsTableColor"]}/>}>
                    </Route>
                }


            </Routes>
        </div>
    );
}

export default App;