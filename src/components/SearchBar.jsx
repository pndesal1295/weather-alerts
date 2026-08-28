import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (input.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${input}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Autocomplete fetch error", err);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setShowDropdown(false);
      setInput('');
    }
  };

  return (
    <div className="relative w-full md:w-96" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="flex border-4 border-black bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowDropdown(true); }}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          placeholder="ENTER LOCATION..."
          // Added text-base below to prevent iOS auto-zoom
          className="w-full px-4 py-3 bg-white focus:outline-none focus:bg-yellow-100 font-bold uppercase placeholder-black/50 text-black rounded-none text-base"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 font-black hover:bg-zinc-800 transition-colors border-l-4 border-black flex items-center justify-center"
        >
          <Search className="w-6 h-6" strokeWidth={3} />
        </button>
      </form>

      {/* Brutalist Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id || suggestion.url}
              onClick={() => {
                onSearch(`${suggestion.lat},${suggestion.lon}`);
                setInput('');
                setShowDropdown(false);
              }}
              className={`px-6 py-4 hover:bg-black hover:text-white cursor-pointer font-bold transition-colors ${index !== suggestions.length - 1 ? 'border-b-4 border-black' : ''
                }`}
            >
              <div className="text-lg">{suggestion.name}</div>
              <div className="text-sm opacity-75 mt-1">
                {suggestion.region && `${suggestion.region}, `}{suggestion.country}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}