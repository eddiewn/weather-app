import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type LineChartProps = {
    displayData: {
        name: string;
        Temperature: number;
        Description: string;
        icon: string;
    }[];
    checked: boolean;
};

const DisplayLineChart = ({ displayData, checked }: LineChartProps) => {
    return (
        <ResponsiveContainer>
            <LineChart
                width={500}
                height={300}
                data={displayData?.length > 0 ? displayData : []}
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
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="flex flex-col border-solid border-1 rounded p-2">
                                    <p>{label}</p>
                                    <p>{`Temperature: ${data.Temperature.toString().slice(
                                        0,
                                        -1
                                    )}${!checked ? "°C" : "°F"}`}</p>
                                    <div className="flex items-center h-[100%] justify-evenly">
                                        <p>{data.Description}</p>
                                        <img
                                            className="w-[40%]"
                                            src={`https://openweathermap.org/img/wn/${data.icon}.png`}
                                            alt={data.Description}
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
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DisplayLineChart;
