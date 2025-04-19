import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [nameFilter, setFilterName] = useState("");
  const [inputError, setInputError] = useState(false);

  const checkboxRef = useRef(null);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = () => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const countries = response.data;
        const countryData = countries.map((c) => ({
          name: c.name.common,
          capital: c.capital?.[0] || "No capital",
          region: c.region || "No region",
          officialName: c.name.official,
          currency: c.currencies
            ? Object.values(c.currencies)[0].name
            : "No currency",
          languages: c.languages
            ? Object.values(c.languages)
            : ["No languages"],
          area: c.area,
          flag: c.flags.svg,
          population: c.population,
          timezones: c.timezones,
        }));
        setAllCountries(countryData);
      })
      .catch((error) => {
        console.error("Помилка при отриманні даних:", error);
      });
  };

  const handleFilterNameChange = (event) => setFilterName(event.target.value);

  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  useEffect(() => {
    if (nameFilter.length === 0) {
      setInputError(false);
    } else if (filteredCountries.length > 10) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  }, [filteredCountries, nameFilter]);

  const handleThemeChange = () => {
    const block = document.body;

    if (checkboxRef.current?.checked) {
      block.classList.add("darkTheme");
    } else {
      block.classList.remove("darkTheme");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("darkTheme");
    }
  }, []);

  return (
    <div className="countriesContainer" id="mainDiv">
      <h2 id="mainTitle">Countries</h2>

      <label>
        <input
          type="checkbox"
          className="colorThemeCheckbox"
          ref={checkboxRef}
          onChange={handleThemeChange}
        />
        <button
          onClick={() => {
            document.body.classList.toggle("darkTheme");
            localStorage.setItem(
              "theme",
              document.body.classList.contains("darkTheme") ? "dark" : "light"
            );
          }}
        >
          🌓
        </button>
        Dark theme
      </label>

      <form>
        <p
          className="inputError"
          style={{ display: inputError ? "block" : "none" }}
        >
          Enter more symbols
        </p>
        <input
          id="filterInput"
          value={nameFilter}
          onChange={handleFilterNameChange}
          placeholder="Enter country name..."
        />
      </form>

      <table>
        <thead>
          <tr>
            <th className="title">Name</th>
            <th className="title">Capital</th>
            <th className="title">Region</th>
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map((country, index) => (
            <tr key={index}>
              <td>{country.name}</td>
              <td>{country.capital}</td>
              <td>{country.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredCountries.length === 1 && (
        <div className="countryCard">
          <div className="cardTitle">
            {filteredCountries[0].name}
            <div className="flagWrapper">
              <img
                src={filteredCountries[0].flag}
                alt="flag"
                className="countryFlag"
              />
            </div>
          </div>
          <div className="cardInfo">
            <div className="cardInfoTitle">Detail info about country</div>
            <div className="cardInfoBlock">
              <ul className="infoList">
                <li>
                  <span className="label">Capital:</span>{" "}
                  {filteredCountries[0].capital}
                </li>
                <li>
                  <span className="label">Region:</span>{" "}
                  {filteredCountries[0].region}
                </li>
                <li>
                  <span className="label">Official name:</span>{" "}
                  {filteredCountries[0].officialName}
                </li>
                <li>
                  <span className="label">Currency:</span>{" "}
                  {filteredCountries[0].currency}
                </li>
                <li>
                  <span className="label">Languages:</span>{" "}
                  {filteredCountries[0].languages.join(", ")}
                </li>
                <li>
                  <span className="label">Area:</span>{" "}
                  {filteredCountries[0].area} m²
                </li>
                <li>
                  <span className="label">Population:</span>{" "}
                  {filteredCountries[0].population}
                </li>
                <li>
                  <span className="label">Timezones:</span>{" "}
                  {filteredCountries[0].timezones.join(", ")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

//? Программа повинна:
//? Отримувати данні з віддаленного сервера - ✅
//? Фільтрувати їх у режимі реального часу - ✅
//? Рахувати кількість знайдених країн
//?   --- Якшо країн більше 10 то попросити користувача ввести більше символів - ✅
//?   --- Якшо краЇн менше 10 то показати список країн - ✅
//?   --- Якшо є лише 1 країна то показати детальну інформацію про неї  - ✅
//? Додати темну тему
//?   --- Додати кнопку для перемикання теми
//?   --- Додати стилі для темної теми
