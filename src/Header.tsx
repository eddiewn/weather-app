type Props = {
        weatherData: { city: { name: string } } | null;
};

const header = ({weatherData}: Props) => {
    return(
        <h1>Weather in {weatherData ? weatherData.city.name : "Loading"} </h1>
    );
}

export default header;