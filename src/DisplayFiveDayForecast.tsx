type Props = {
    fiveDayForeCast: {
        dt: number;
        main: {temp: number};
        weather: {description: string; icon: string}[];
    }[][];
    weekday: string[];
    meanTemp: number[];
    checked: boolean;
};

const DisplayFiveDayForecast = ({
    fiveDayForeCast,
    weekday,
    meanTemp,
    checked,
}: Props) => {
    return (
        <ul className="flex justify-around items-center h-[80%]">
            {fiveDayForeCast.map((day, index: number) => {
                return (
                    <li key={index}>
                        {weekday[new Date(day[0].dt * 1000).getDay()] + " "}

                        {meanTemp[index].toString().slice(0, 4)}
                        {!checked ? "°C" : "F"}
                    </li>
                );
            })}
        </ul>
    );
};

export default DisplayFiveDayForecast;
