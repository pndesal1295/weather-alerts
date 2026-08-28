import { useState, useEffect } from 'react';
import { Droplets, Wind, Thermometer, MapPin } from 'lucide-react';
import AlertBanner from './components/AlertBanner';
import SearchBar from './components/SearchBar';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('Legazpi City');

  const fetchWeather = async (searchQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchQuery}&alerts=yes`
      );

      if (!response.ok) throw new Error('LOCATION NOT FOUND. CHECK SPELLING.');

      const data = await response.json();
      setWeatherData(data);
      localStorage.setItem('userLocation', searchQuery);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setQuery(savedLocation);
      fetchWeather(savedLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setQuery(coords);
          fetchWeather(coords);
        },
        () => fetchWeather(query)
      );
    } else {
      fetchWeather(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans uppercase selection:bg-black selection:text-white">

      {/* Brutalist Navbar/Header */}
      <header className="border-b-4 border-black p-6 flex flex-col md:flex-row justify-between md:items-end gap-6 bg-yellow-400">
        <div>
          <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter">
            RAW WEATHER
          </h1>
          <p className="font-bold tracking-widest mt-2 text-sm">Global Weather Monitor ///</p>
        </div>
        <SearchBar onSearch={(newQuery) => { setQuery(newQuery); fetchWeather(newQuery); }} />
      </header>

      {/* Dynamic Alert Banner - Rendered as a Marquee */}
      {weatherData?.alerts?.alert?.length > 0 && (
        <div className="border-b-4 border-black">
          <AlertBanner alerts={weatherData.alerts.alert} />
        </div>
      )}

      {/* Loading & Error States */}
      {isLoading && (
        <div className="p-12 border-b-4 border-black font-black text-2xl animate-pulse">
          FETCHING SATELLITE DATA...
        </div>
      )}

      {error && (
        <div className="p-12 border-b-4 border-black font-black text-2xl bg-red-500 text-white">
          ERROR: {error}
        </div>
      )}

      {/* Main Weather Dashboard */}
      {!isLoading && !error && weatherData && (
        <main className="flex flex-col flex-1">

          {/* Hero Section */}
          <div className="border-b-4 border-black p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white relative overflow-hidden">
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-2 mb-4 bg-black text-white w-max px-4 py-1">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                <span className="font-bold tracking-widest text-xs md:text-sm">
                  {weatherData.location.region}, {weatherData.location.country}
                </span>
              </div>
              {/* Using vw for mobile so long names shrink to fit perfectly */}
              <h2 className="text-[12vw] sm:text-8xl md:text-[120px] lg:text-[140px] font-black leading-[0.85] tracking-tighter break-words hyphens-auto">
                {weatherData.location.name}
              </h2>
            </div>

            <div className="text-left lg:text-right flex flex-col items-start lg:items-end z-10 w-full mt-4 lg:mt-0">
              {/* Dynamic temp size */}
              <div className="text-[20vw] sm:text-[140px] md:text-[180px] font-black leading-none tracking-tighter">
                {weatherData.current.temp_c}°
              </div>
              <p className="font-black text-xl sm:text-3xl md:text-5xl tracking-tight bg-black text-white px-4 py-2 mt-2 md:mt-4 inline-block">
                {weatherData.current.condition.text}
              </p>
            </div>
          </div>

          {/* Brutalist Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black border-b-4 border-black flex-1">

            <div className="p-6 md:p-8 hover:bg-black hover:text-white transition-colors flex flex-col justify-between group min-h-[200px] md:min-h-0">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <p className="font-bold tracking-widest text-xs md:text-sm">FEELS LIKE</p>
                <Thermometer className="w-6 h-6 md:w-8 md:h-8 group-hover:text-white" strokeWidth={2} />
              </div>
              <p className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">{weatherData.current.feelslike_c}°C</p>
            </div>

            <div className="p-6 md:p-8 hover:bg-black hover:text-white transition-colors flex flex-col justify-between group bg-zinc-100 min-h-[200px] md:min-h-0">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <p className="font-bold tracking-widest text-xs md:text-sm">HUMIDITY</p>
                <Droplets className="w-6 h-6 md:w-8 md:h-8 group-hover:text-white" strokeWidth={2} />
              </div>
              <p className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">{weatherData.current.humidity}%</p>
            </div>

            <div className="p-6 md:p-8 hover:bg-black hover:text-white transition-colors flex flex-col justify-between group min-h-[200px] md:min-h-0">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <p className="font-bold tracking-widest text-xs md:text-sm">WIND SPEED</p>
                <Wind className="w-6 h-6 md:w-8 md:h-8 group-hover:text-white" strokeWidth={2} />
              </div>
              <p className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">{weatherData.current.wind_kph} KM/H</p>
            </div>

          </div>

        </main>


      )}

{/* Brutalist Footer / Ticker */}
      {!isLoading && !error && (
        <footer className="bg-black text-white py-4 overflow-hidden relative shrink-0">
          {/* Changed w-[200%] to w-max so it expands naturally */}
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {/* Increased array size to 8 so it never runs out of text on ultrawide monitors */}
            {Array(8).fill("/// BUILT BY KLINE /// RAW DATA PROVIDED BY WEATHERAPI.COM ").map((text, index) => (
              // Added shrink-0 here to prevent the mobile squish
              <div key={index} className="flex items-center shrink-0 px-4">
                <span className="font-black text-xl md:text-2xl tracking-widest uppercase">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}
