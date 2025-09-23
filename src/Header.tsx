type Props = {
    weatherData: {city: {name: string}} | null;
};

const header = ({weatherData}: Props) => {
    if (!weatherData) return <h1>Loading...</h1>;
    return <h1>{weatherData.city.name}</h1>;
};

export default header;
