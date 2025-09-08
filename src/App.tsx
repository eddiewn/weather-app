import {useEffect, useState} from "react";
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import "./App.css";

function App() {
    const [city, setCity] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const [weatherData, setWeatherData] = useState<any>();
    const [displayData, setDisplayData] = useState<any>();

    const [malmoData, setMalmoData] = useState<any>();
    const [displayMalmoData, setDisplayMalmoData] = useState<any>({});

    const apiKey: string = import.meta.env.VITE_WEATHER_API_KEY;
    const apiCall = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const staticMalmoApiCall = `https://api.openweathermap.org/data/2.5/forecast?q=malmö&units=metric&appid=${apiKey}`;

    async function fetchData() {
        if (!city) return;
        setLoading(true);

        try {
            const res = await fetch(apiCall);
            const data = await res.json();


            if (data.cod !== "200") {
            alert(`Error: ${data.message}`);
            return;
        }

            setWeatherData(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!loading) {
            setDisplayData(
                weatherData.list.slice(0, 8).map((item: any) => ({
                    name: item.dt_txt.slice(5, 16),
                    Temperature: item.main.temp,
                }))
            );
        }
    }, [weatherData]);

    useEffect(() => {
        if (malmoData?.list) {
            setDisplayMalmoData(
                malmoData.list.slice(0, 8).map((item: any) => ({
                    name: item.dt_txt.slice(5, 16),
                    Temperature: item.main.temp,
                }))
            );
        }
    }, [malmoData]);

    useEffect(() => {
        async function fetchMalmo() {
            try {
                const resMalmo = await fetch(staticMalmoApiCall);
                const dataMalmo = await resMalmo.json();
                setMalmoData(dataMalmo);
                console.log(dataMalmo);
            } catch (error) {
                console.log(error);
            }
        }
        fetchMalmo();
    }, []);

    return (
        <>
            <h1>{weatherData ? weatherData.city.name : malmoData ? malmoData.city.name : "Loading"}</h1>
            <input
                type="text"
                placeholder="Name city"
                onChange={(e) => {
                    setCity(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    if (city) {
                        fetchData();
                    }
                }}
            >
                Get data
            </button>

            {displayMalmoData?.length > 0 && (
                <div>
                    <p>
                        {
                            <LineChart
                                width={500}
                                height={300}
                                data={displayData?.length > 0 ? displayData : displayMalmoData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis label={{value: "°C", dx: -10,}} />
                                <Tooltip
                                    formatter={(value) => [
                                        `${value} °C`,
                                        "Temperature",
                                    ]}
                                />{" "}
                                <Line
                                    type="monotone"
                                    dataKey="Temperature"
                                    stroke="#8884d8"
                                    activeDot={{r: 8}}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#82ca9d"
                                />
                            </LineChart>
                        }
                    </p>
                </div>
            )}
        </>
    );
}

export default App;
