import {useState} from "react";
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
    const [weatherData, setWeatherData] = useState<any>({});

    const apiKey: string = import.meta.env.VITE_WEATHER_API_KEY;
    const apiCall = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    async function fetchData() {
        try {
            const res = await fetch(apiCall);
            const data = await res.json();
            setWeatherData(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    let data: any = [
        weatherData.list
            ? weatherData.list.slice(0, 8).map((item: any, index: number) => {
                  console.log(item);
              })
            : [],
    ];

    return (
        <>
            <h1>Hello world</h1>
            <input
                type="text"
                placeholder="Name city"
                onChange={(e) => {
                    setCity(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    fetchData();
                    console.log(data);

                }}
            >
                Get data
            </button>

            <LineChart width={500} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            </LineChart>
        </>
    );
}

export default App;
