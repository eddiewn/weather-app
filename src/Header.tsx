type Props = {
        weatherData: { city: { name: string } } | null;
};

const header = ({weatherData}: Props) => {
    return(
        <h1 className="text-3xl">Weather in {weatherData ? weatherData.city.name : "Loading"} </h1>
    );
}

export default header;