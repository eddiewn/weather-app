import React from "react";
import { useRef,useState, useEffect, useMemo } from "react";
import cityData from "../public/cities_only.json";
import Fuse from "fuse.js";

type SearchBarProps = {
    onSubmitCity: (newCity: string) => void;
}

const SearchBar = ({onSubmitCity}: SearchBarProps) => {
    const [fuzzySearchResults, setFuzzySearchResults] = useState<string[]>([]);
    const [city, setCity] = useState<string>("malmo");
    const [showResults, setShowResults] = useState<boolean>(false);

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
                onFocus={() => setShowResults(true)}
                onBlur={() => setShowResults(false)}
                onChange={(e) => {
                    setCity(e.target.value);
                }}
            />
            <input type="button"
                onClick={() => {
                            onSubmitCity(city)
                        }}
                value="Get data"
            />
            {showResults && fuzzySearchResults.length > 0 && (
                <ul className="">
                    {fuzzySearchResults.slice(0, 5).map((e) => (
                        <li><button className="cursor-pointer">{e}</button></li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default SearchBar;
