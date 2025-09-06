import { useEffect, useState } from 'react'

import './App.css'

function App() {

	const [city, setCity] = useState<string>("");
	const [data, setData] = useState<object>({});

const apiKey:string = import.meta.env.VITE_WEATHER_API_KEY;

	const apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

	async function fetchData(){
		try {
			const res = await fetch(apiCall);
			const result = await res.json();
			setData(result);
			console.log(result);
		} catch (error) {
			console.log(error)
		}

	}

	useEffect(() => {

	},[])


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
		}}
		>Get data</button>
    </>
  )
}

export default App
