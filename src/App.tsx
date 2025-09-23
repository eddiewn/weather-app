import {useCallback, useMemo, useEffect, useState} from "react";

import SearchBar from "./searchBar";
import DisplayLineChart from "./DisplayLineChart";
type DisplayDataItem = {
    name: string;
    Temperature: number;
    Description: string;
    icon: string;
};

type WeatherApiResponse = {
    cod: string;
    message: number;
    cnt: number;
    list: {
        dt: number;
        dt_txt: string;
        main: {
            temp: number;
            pressure: number;
            humidity: number;
        };
        weather: {
            description: string;
            icon: string;
        }[];
    }[];
    city: {
        id: number;
        name: string;
    };
};

function App() {
    const [city, setCity] = useState<string>("malmo");
    const [loading, setLoading] = useState<boolean>(true);
    const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
        null
    );
    const [displayData, setDisplayData] = useState<DisplayDataItem[]>([]);
    const [checked, setChecked] = useState<boolean>(false);
    const [unit, setUnit] = useState<string>("metric");
    const [fiveDayForecast, setFiveDayForecast] = useState<
        WeatherApiResponse["list"][]
    >([]);
    const [meanTemp, setMeanTemp] = useState<number[]>([]);

    const apiKey: string = import.meta.env.VITE_WEATHER_API_KEY;
    const apiCall = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

    const fetchData = useCallback(async () => {
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
    }, [apiCall, city]);

    useEffect(() => {
        fetchData();
    }, [fetchData, unit]);

    const weekday = useMemo(
        () => [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        []
    );

    useEffect(() => {
        if (!loading && weatherData) {
            setDisplayData(
                weatherData.list.slice(0, 8).map((item) => ({
                    name: `${
                        weekday[new Date(item.dt * 1000).getDay()]
                    } ${item.dt_txt.slice(11, 16)}`,
                    Temperature: item.main.temp,
                    Description: item.weather[0].description,
                    icon: item.weather[0].icon,
                }))
            );

            const days: WeatherApiResponse["list"][] = [];
            let currentDay: string | null = null;

            weatherData.list.forEach((listItem) => {
                const date = listItem.dt_txt.slice(0, 10);
                if (date !== currentDay) {
                    days.push([]);
                    currentDay = date;
                }
                days[days.length - 1].push(listItem);
            });

            const meanTemp = days.map((day) => {
                const sum = day.reduce((acc, item) => acc + item.main.temp, 0);
                return sum / day.length;
            });
            console.log(meanTemp);
            setMeanTemp(meanTemp);

            setFiveDayForecast(days);

            console.log(days);
        }
    }, [weatherData, loading, unit, weekday]);

    useEffect(() => {
        setUnit(checked ? "imperial" : "metric");
    }, [checked]);

    console.log();

    return (
        <>
            <h1>{weatherData ? weatherData.city.name : "Loading"}</h1>

            <SearchBar onSubmitCity={setCity} />

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
                                <DisplayLineChart displayData={displayData} checked={checked}/>         
                            }
                        </div>
                        <div className="w-100% h-50 text-black">
                            <ul className="flex justify-around items-center h-[80%]">
                                {fiveDayForecast.map((day, index: number) => {
                                    return (
                                        <li key={index}>
                                            {weekday[
                                                new Date(
                                                    day[0].dt * 1000
                                                ).getDay()
                                            ] + " "}

                                            {meanTemp[index]
                                                .toString()
                                                .slice(0, 4)}
                                            {!checked ? "°C" : "F"}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                )}

            <div></div>
        </>
    );
}

export default App;
