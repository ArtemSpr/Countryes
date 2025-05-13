import axios from "axios";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const CountryCard = ({ country }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
      )
      .then((res) => {
        const found = res.data.features.find(
          (f) => f.properties.name === country.name // використовуємо 'name' замість 'ADMIN'
        );
        if (found) setGeoJsonData(found);
      })
      .catch((err) => {
        console.error("GeoJSON error:", err);
      });
  }, [country.name]);

  if (!country) return null;

  const [weatherSituation, setWeatherSituation] = useState("");
  const [temperature, setTemperature] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [windDeg, setWindDeg] = useState("");
  const [clouds, setClouds] = useState("");
  const [rain, setRain] = useState("");
  const [snow, setSnow] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  const apiKey = "5fcf12dc7ab9215a2f9a553a494db439";
  const city = country.capital;
  const countryName = country.name;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  axios
    .get(url)
    .then((response) => {
      const weatherData = response.data;
      setWeatherSituation(weatherData.weather.main);
      setTemperature((weatherData.main.temp - 273.15).toFixed(1));
      setFeelsLike((weatherData.main.feels_like - 273.15).toFixed(1));
      setHumidity(weatherData.main.humidity);
      setWindSpeed(weatherData.wind.speed);
      setWindDeg(weatherData.wind.deg);
      setClouds(weatherData.clouds.all);
      setRain(weatherData.rain ? weatherData.rain["1h"] : 0);
      setSnow(weatherData.snow ? weatherData.snow["1h"] : 0);
      setSunrise(new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString());
      setSunset(new Date(weatherData.sys.sunset * 1000).toLocaleTimeString());
    })
    .catch((error) => {
      console.error(error);
    });

  const { latitude, longitude } = country;

  // Фікс для іконок Leaflet у React:
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  return (
    <div className="countryCard">
      <div className="cardTitle">
        {country.name}
        <div className="flagWrapper">
          <img src={country.flag} alt="flag" className="countryFlag" />
        </div>
      </div>
      <div className="cardInfo">
        <div className="cardInfoTitle">Detail info about country</div>
        <div className="cardInfoBlock">
          <ul className="infoList">
            <li>
              <span className="label">Capital:</span> {country.capital}
            </li>
            <li>
              <span className="label">Region:</span> {country.region}
            </li>
            <li>
              <span className="label">Official name:</span>{" "}
              {country.officialName}
            </li>
            <li>
              <span className="label">Currency:</span> {country.currency}
            </li>
            <li>
              <span className="label">Languages:</span>{" "}
              {country.languages.join(", ")}
            </li>
            <li>
              <span className="label">Area:</span> {country.area} m²
            </li>
            <li>
              <span className="label">Population:</span> {country.population}
            </li>
            <li>
              <span className="label">Timezones:</span>{" "}
              {country.timezones.join(", ")}
            </li>
          </ul>

          <div className="extraInfo">
            {/* Блок погоди */}
            <div className="weatherContainer">
              <div className="weatherTitle">Weather in {country.capital}</div>

              <div className="weatherTop">
                {weatherSituation !== undefined && (
                  <div className="weatherSituation">🌤️ {weatherSituation}</div>
                )}
                <div className="weatherTempBlock">
                  <div className="temperature">{temperature}°C</div>
                  <div className="feelsLike">Feels like {feelsLike}°C</div>
                </div>
              </div>

              <div className="weatherGrid">
                <div>💧 Humidity: {humidity}%</div>
                <div>
                  🌬️ Wind: {windSpeed} m/s ({windDeg}°)
                </div>
                <div>☁️ Clouds: {clouds}%</div>
                {rain !== undefined && <div>🌧️ Rain (1h): {rain} mm</div>}
                {snow !== undefined && <div>❄️ Snow (1h): {snow} mm</div>}
                <div>🌅 Sunrise: {sunrise}</div>
                <div>🌇 Sunset: {sunset}</div>
              </div>
            </div>
            {/* Блок карти */}
            <div className="mapContainer">
              <MapContainer
                center={[latitude, longitude]}
                zoom={4}
                style={{ height: "400px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[latitude, longitude]}>
                  <Popup>{country.capital}</Popup>
                </Marker>
                {geoJsonData && (
                  <GeoJSON
                    data={geoJsonData}
                    style={{ color: "blue", weight: 2 }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;

//& Пояснення API запитів:
//&   weather.main - погодна ситуація (дощ, сніг, сонце і т.д.)
//&   weather.icon - іконка погоди
//&   main.temp - температура
//&   main.feels_like - як відчувається температура
//&   main.humidity - вологість
//&   wind.speed - швидкість вітру
//&   wind.deg - напрямок вітру
//&   clouds.all - хмари
//&   rain - дощ
//&   snow - сніг
//&   sys.sunrise - Час сходу сонця, unix UTC
//&   sys.sunset - Час заходу сонця, unix, UTC
