import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import "./App.css";

function App() {
    const [city, setCity] = useState<string>("malmo");
    const [loading, setLoading] = useState<boolean>(true);

    const [weatherData, setWeatherData] = useState<any>();
    const [displayData, setDisplayData] = useState<any>();
    const [checked, setChecked] = useState<boolean>(false);
    const [unit, setUnit] = useState<string>("metric");
    const [fiveDayForecast, setFiveDayForecast] = useState<any[][]>([]);
    const [meanTemp, setMeanTemp] = useState<number[]>([]);

    const apiKey: string = import.meta.env.VITE_WEATHER_API_KEY;
    const apiCall = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

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
        fetchData();
    }, [unit]);

    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    useEffect(() => {
        if (!loading) {
            setDisplayData(
                weatherData.list.slice(0, 8).map((item: any) => ({
                    name: `${
                        weekday[new Date(item.dt * 1000).getDay()]
                    } ${item.dt_txt.slice(11, 16)}`,
                    Temperature: item.main.temp,
                    Description: item.weather[0].description,
                    icon: item.weather[0].icon,
                }))
            );

            let days: any[][] = [];
            let currentDay: string | null = null;

            weatherData.list.forEach((listItem: any) => {
                const date = listItem.dt_txt.slice(0, 10);
                if (date !== currentDay) {
                    days.push([]);
                    currentDay = date;
                }
                days[days.length - 1].push(listItem);
            });

            const meanTemp = days.map((day: any) => {
                const sum = day.reduce(
                    (acc: number, item: any) => acc + item.main.temp,
                    0
                );
                return sum / day.length;
            });
            console.log(meanTemp);
            setMeanTemp(meanTemp);

            setFiveDayForecast(days);

            console.log(days);
        }
    }, [weatherData, loading, unit]);

    useEffect(() => {
        checked ? setUnit("imperial") : setUnit("metric");
    }, [checked]);

    console.log();

    return (
        <>
            <h1>{weatherData ? weatherData.city.name : "Loading"}</h1>
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

            <label className="relative inline-block bg-gray-500 w-15 h-7.5 rounded-full">
                <input
                    type="checkbox"
                    id="checkBox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => {
                        setChecked(e.target.checked);
                    }}
                />
                <span className="bg-blue-400 w-2/5 h-4/5 absolute rounded-full left-1/20 top-1/2 transform -translate-y-1/2 peer-checked:bg-amber-700 peer-checked:left-55/100 transition-all duration-500 ease-in-out"></span>
            </label>

            {!loading &&
                displayData?.length > 0 &&
                fiveDayForecast?.length > 0 && (
                    <div>
                        <div className="h-40 w-[100%] pr-3">
                            {
                                <ResponsiveContainer>
                                    <LineChart
                                        width={500}
                                        height={300}
                                        data={
                                            displayData?.length > 0
                                                ? displayData
                                                : "Loading"
                                        }
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <XAxis dataKey="name" />
                                        <YAxis
                                            label={{
                                                value: !checked ? "°C" : "°F",
                                                dx: -10,
                                            }}
                                        />
                                        <Tooltip
                                            content={({
                                                active,
                                                payload,
                                                label,
                                            }) => {
                                                if (
                                                    active &&
                                                    payload &&
                                                    payload.length
                                                ) {
                                                    const data =
                                                        payload[0].payload;
                                                    return (
                                                        <div className="flex flex-col border-solid border-1 rounded p-2">
                                                            <p>{label}</p>
                                                            <p>{`Temperature: ${data.Temperature.toString().slice(
                                                                0,
                                                                -1
                                                            )}${
                                                                !checked
                                                                    ? "°C"
                                                                    : "°F"
                                                            }`}</p>
                                                            <div className="flex items-center h-[100%] justify-evenly">
                                                                <p>
                                                                    {
                                                                        data.Description
                                                                    }
                                                                </p>
                                                                <img
                                                                    className="w-[40%]"
                                                                    src={`https://openweathermap.org/img/wn/${data.icon}.png`}
                                                                    alt={
                                                                        data.Description
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="Temperature"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="uv"
                                            stroke="#82ca9d"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            }
                        </div>
                        <div className="w-100% h-50 text-black">
                            <ul className="flex justify-around items-center h-[80%]">
                                {fiveDayForecast.map(
                                    (day: any, index: number) => {
                                        console.log(index, day[0]);
										console.log(typeof day.dt)
                                        return (
                                            <li key={index}>
												{
												weekday[new Date(day[0].dt * 1000).getDay()]}
												 + 
                                                {meanTemp[index]
                                                    .toString()
                                                    .slice(0, 4)}
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    </div>
                )}
        </>
    );
}

export default App;
