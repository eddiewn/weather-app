import React from "react";
import { useState, useEffect, useMemo } from "react";
import cityData from "../public/cities_only.json";
import Fuse from "fuse.js";

type SearchBarProps = {
    onSubmitCity: (newCity: string) => void;
}

const SearchBar = ({onSubmitCity}: SearchBarProps) => {
    const [fuzzySearchResults, setFuzzySearchResults] = useState<string[]>([]);
    const [city, setCity] = useState<string>("malmo");

    const handleSubmit = () => {
        onSubmitCity(city); // only send city to parent on button click
    };

    const fuse = useMemo(() => {
        return new Fuse(cityData, {threshold: 0.3});
    }, [cityData]);

    

    useEffect(() => {
        if (!city) {
            setFuzzySearchResults([]);
            return;
        } else {
            const handler = setTimeout(() => {
            const searchResults = fuse.search(city);
            setFuzzySearchResults(searchResults.map((result) => result.item));
            }, 300)

            return () => clearTimeout(handler);
        }
    }, [city, fuse]);

    return (
        <div>
            <input
                type="text"
                placeholder="Name city"
                onChange={(e) => {
                    setCity(e.target.value);
                }}
            />
            <input type="button"
                onClick={handleSubmit}
                value="Get data"
            />
            <ul>
                {fuzzySearchResults.slice(0, 5).map((e) => (
                    <li>{e}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
