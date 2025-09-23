import {useCallback, useMemo, useEffect, useState} from "react";
import DisplayFiveDayForecast from "./DisplayFiveDayForecast";
import SearchBar from "./searchBar";
import DisplayLineChart from "./DisplayLineChart";
import DisplayToggleButton from "./toggleButton";
import Header from "./Header";
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
            <Header weatherData={weatherData} />
            <SearchBar onSubmitCity={setCity} />
            <DisplayToggleButton checked={checked} setChecked={setChecked}/>
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
                            <DisplayFiveDayForecast fiveDayForeCast={fiveDayForecast} weekday={weekday} meanTemp={meanTemp} checked={checked}/>
                        </div>
                    </div>
                )}

            <div></div>
        </>
    );
}

export default App;
