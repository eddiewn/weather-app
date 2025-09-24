import { useState, useEffect, useMemo } from "react";
import cityData from "../public/cities_only.json";
import Fuse from "fuse.js";

type SearchBarProps = {
    onSubmitCity: (newCity: string) => void;
};

const SearchBar = ({ onSubmitCity }: SearchBarProps) => {
    const [fuzzySearchResults, setFuzzySearchResults] = useState<string[]>([]);
    const [city, setCity] = useState<string>("malmo");
    const [showResults, setShowResults] = useState<boolean>(false);

    const fuse = useMemo(() => {
        return new Fuse(cityData, { threshold: 0.3 });
    }, []);

    useEffect(() => {
        if (!city) {
            setFuzzySearchResults([]);
            return;
        } else {
            const handler = setTimeout(() => {
                const searchResults = fuse.search(city);
                setFuzzySearchResults(
                    searchResults.map((result) => result.item)
                );
            }, 300);

            return () => clearTimeout(handler);
        }
    }, [city, fuse]);

    return (
        <div className="flex flex-col">
            <input
                type="text"
                placeholder="Name city"
                onFocus={() => setShowResults(true)}
                onBlur={() => {
                    const handler = setTimeout(() => {
                        setShowResults(false);
                    }, 100);
                    return () => clearTimeout(handler);
                }}
                onChange={(e) => {
                    setCity(e.target.value);
                }}
            />

            {showResults && fuzzySearchResults.length > 0 && (
                <div className="relative">
                    <ul className="absolute bg-white z-10 top-full">
                        {fuzzySearchResults.slice(0, 5).map((e) => (
                            <li className="">
                                <button
                                    className="cursor-pointer relative"
                                    onClick={() => {
                                        onSubmitCity(e);
                                    }}
                                >
                                    {e}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
