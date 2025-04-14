import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [allCapitals, setAllCapitals] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = () => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log("Дані про країни отримано");
        const countries = response.data;

        //* Отримуємо назви країн
        const allRegions = countries.map((c) => c.name.common);
        const uniqueRegions = [...new Set(allRegions)];
        // uniqueRegions.sort();

        //* Отримуємо назви столиць
        const allCapitals = countries.map((c) => c.capital);
        const uniqueCap = [...new Set(allCapitals)];
        // uniqueCap.sort();

        const countryData = countries.map((c) => ({
          name: c.name.common,
          capital: c.capital?.[0] || "No capital",
          region: c.region || "No region",
        }));

        setAllCountries(countryData);

        // setAllCountries(uniqueRegions);
        setAllCapitals(uniqueCap);
      })
      .catch((error) => {
        console.error("Помилка при отриманні даних:", error);
      });
  };

  return (
    <div className="countriesContainer">
      <h2>Countries</h2>

      {/* <form onSubmit={}>
        <input></input>
      </form> */}

      <table>
        <thead>
          <tr>
            <th className="tit">Name</th>
            <th className="tit">Capital</th>
            <th className="tit">Region</th>
          </tr>
        </thead>
        <tbody>
          {allCountries.map((country, index) => (
            <tr key={index}>
              <td>{country.name}</td>
              <td>{country.capital}</td>
              <td>{country.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

//? Программа повинна:
//? Отримувати данні з віддаленного сервера
//? Фільтрувати їх у режимі реального часу
//? Рахувати кількість знайдених країн
//?   --- Якшо країн більше 10 то попросити користувача ввести більше символів
//?   --- Якшо краЇн менше 10 то показати список країн
//?   --- Якшо є лише 1 країна то показати детальну інформацію про неї
//?
