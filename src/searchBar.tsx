import React from "react";
import { useState, useEffect, useMemo } from "react";
import cityData from "../public/cities_only.json";
import Fuse from "fuse.js";

type SearchBarProps = {
    city: string;
    setCity: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({city, setCity}: SearchBarProps) => {
    const [fuzzySearchResults, setFuzzySearchResults] = useState<string[]>([]);


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
            <ul>
                {fuzzySearchResults.slice(0, 5).map((e) => (
                    <li>{e}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
