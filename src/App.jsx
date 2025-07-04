import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import TimeSwitcher from "./TimeSwitcher";
import CountryCard from "./CountryCard";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [nameFilter, setFilterName] = useState("");
  const [inputError, setInputError] = useState(false);
  const [activeCountryIndex, setActiveCountryIndex] = useState(null);
  const [didActiveCountryCard, setDidActiveCountryCard] = useState(false);

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
          latitude: c.capitalInfo.latlng?.[0] ?? null,
          longitude: c.capitalInfo.latlng?.[1] ?? null,
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

  const handleShowClick = (index) => {
    setActiveCountryIndex((prev) => {
      const isSame = prev === index;
      setDidActiveCountryCard(!isSame);
      return isSame ? null : index;
    });
  };

  return (
    <div className="countriesContainer" id="mainDiv">
      <h2 id="mainTitle">Countries</h2>
      <TimeSwitcher />
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
          autoComplete="off"
        />
      </form>

      <table>
        <thead>
          <tr>
            <th className="title">Name</th>
            <th className="title">Capital</th>
            <th className="title">Region</th>
            {filteredCountries.length <= 10 &&
              filteredCountries.length !== 1 && (
                <th className="title">Details</th>
              )}
            {didActiveCountryCard === true && (
              <th className="title">Country Card</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map((country, index) => (
            <tr key={index}>
              <td>{country.name}</td>
              <td>{country.capital}</td>
              <td>{country.region}</td>
              {filteredCountries.length <= 10 &&
                filteredCountries.length !== 1 && (
                  <td>
                    <button
                      className="button"
                      onClick={() => handleShowClick(index)}
                    >
                      {activeCountryIndex === index ? "Hide" : "Show"}
                    </button>
                  </td>
                )}
              {activeCountryIndex === index && (
                <td colSpan="4">
                  <CountryCard country={country} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredCountries.length === 1 && (
        <CountryCard country={filteredCountries[0]} />
      )}
    </div>
  );
}

//! Якшо картка показується і користувач вводить нове ім'я країни
//! то картка не закривається і показується нова країна

export default App;

//? Программа повинна:
//? Отримувати данні з віддаленного сервера - ✅
//? Фільтрувати їх у режимі реального часу - ✅
//? Рахувати кількість знайдених країн
//?   --- Якшо країн більше 10 то попросити користувача ввести більше символів - ✅
//?   --- Якшо краЇн менше 10 то показати список країн - ✅
//?   --- Якшо є лише 1 країна то показати детальну інформацію про неї  - ✅
//? Додати темну тему
//?   --- Додати кнопку для перемикання теми- ✅
//?   --- Додати стилі для темної теми- ✅
