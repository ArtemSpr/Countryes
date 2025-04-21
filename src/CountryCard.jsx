const CountryCard = ({ country }) => {
  if (!country) return null;

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
        </div>
      </div>
    </div>
  );
};

export default CountryCard;
