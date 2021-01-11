import React, {useState, useEffect} from 'react';
import {FormControl, Select, MenuItem, Card, CardContent, Typography, Tab} from "@material-ui/core";
import InfoBox from './InfoBox';
import Table from './Table';
import LineGraph from './LineGraph';
import {sortData} from './util';
import './App.css';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("All");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [caseType, setCaseType] = useState("active");

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        const sortedData = sortData(data);
        setCountries(countries);
        setTableData(sortedData);
      })
    };

    getCountries();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      console.log(data);
    })
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = countryCode === 'All' ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      
    })
  }

  const onCaseTypeChange = (e) => {
    setCaseType(e.target.value);
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>C<img style={{transform: "translate(0, 7px)"}} src="https://img.icons8.com/nolan/48/coronavirus.png"/>VID <span>Tracker</span></h1>
          <FormControl className="app__dropdown">
            <Select
              variant="standard"
              value={country}
              onChange={onCountryChange}>
                <MenuItem value ="All">All</MenuItem>
                {countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <label for='active'>
            <input id="active" type="radio" name="cases" onChange={onCaseTypeChange} value="active" defaultChecked/>
            <InfoBox title="Active" cases={countryInfo.todayCases} total={countryInfo.cases}/>
            <span className='check'></span>
          </label>
          
          <label for='recovered'>
            <input id="recovered" type="radio" onChange={onCaseTypeChange} value="recovered" name="cases"/>
            <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
            <span className='check'></span>
          </label>
            
          <label for='deaths'>
            <input id="deaths" type="radio" onChange={onCaseTypeChange} value="deaths" name="cases"/>
            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
            <span className='check'></span>
          </label>
        </div>
        <LineGraph caseType={caseType} country={country} />
      </div>

      <div className="app__right">
          <Card>
            <CardContent>
              <h3>Total cases by country</h3>
              <Table countries={tableData} />
              
            </CardContent>
          </Card>
          
      </div>
     
    </div>
  );
}

export default App;
