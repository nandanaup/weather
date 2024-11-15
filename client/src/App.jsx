import { useState, useEffect } from "react";

const App = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const apiKey = "7ce73aa3d81ceb1c27f658a4044234c1";

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            if (!response.ok) {
              throw new Error("Unable to fetch weather for your location");
            }
            const data = await response.json();
            setWeather(data);
            setLocation(`${data.name}, ${data.sys.country}`);
            setError("");
          } catch (err) {
            console.log(err);
            setError("Error fetching weather data.");
          }
        },
        () => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  const handleSearch = async () => {
    if (!location) {
      setError("Please enter a location");
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Location not found");
      }

      const data = await response.json();
      setWeather(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="flex justify-center bg-[url('/src/assets/bgImage.jpg')] items-center min-h-screen bg-cover bg-center overflow-hidden">
      <div className="container relative w-[400px] bg-black bg-opacity-10 backdrop-blur-lg border-2 border-white border-opacity-20 rounded-lg p-5 text-white transition-all duration-600 ease-in-out">
        <div className="search-box relative w-full h-[55px] flex items-center mb-4">
          <i className="bx bxs-map absolute left-2 text-2xl"></i>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
            className="absolute w-full h-full bg-transparent border-2 border-white border-opacity-20 outline-none rounded-lg text-xl font-semibold text-white uppercase pl-10 pr-10"
          />
          <button
            className="bx bx-search absolute right-2 text-2xl text-white cursor-pointer"
            onClick={handleSearch}
          ></button>
        </div>

        {error && (
          <div className="not-found text-center transition-all duration-1000 ease-out">
            <p className="text-xl font-semibold">{error}</p>
          </div>
        )}

        {weather && (
          <div className="weather-box text-center my-10 transition-all duration-1000 ease-out">
            <div className="info-weather">
              <div className="weather">
                <img
                  src={getWeatherIcon(weather.weather[0].icon)}
                  alt="Weather Icon"
                  className="w-3/5 mx-auto"
                />
                <p className="temperature text-5xl font-bold relative inline-block">
                  {Math.round(weather.main.temp)}
                  <span className="absolute text-xl ml-1">°C</span>
                </p>
                <p className="description text-2xl font-semibold capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
          </div>
        )}

        {weather && (
          <div className="weather-details flex justify-between mt-4">
            <div className="humidity flex flex-col items-center">
              <i className="bx bx-water text-3xl mb-1"></i>
              <span className="text-xl font-bold">
                {weather.main.humidity}%
              </span>
              <p className="text-sm">Humidity</p>
            </div>
            <div className="wind flex flex-col items-center">
              <i className="bx bx-wind text-3xl mb-1"></i>
              <span className="text-xl font-bold">
                {Math.round(weather.wind.speed)} Km/h
              </span>
              <p className="text-sm">Wind Speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
