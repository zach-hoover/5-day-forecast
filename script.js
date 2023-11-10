var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var savedEl = document.querySelector('.saved-search')
var searchInput = document.querySelector('#search-input');

function searchApi(city) {
    console.log(city)
    var QueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=d46c57eb1f7861925e3e0b827d2f5be8';
    fetch(QueryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (res) {
        // write query to page so user knows what they are viewing  
        console.log(res); 
        var city = res.city.name
        var forecast = res.list.slice(0,5)
        resultTextEl.textContent=city
        printSearch(forecast)
      })
      .catch(function (error) {
        console.error(error);
      });
}
function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}


function printSearch(forecast) {
    resultContentEl.innerHTML = '';
    
    forecast.forEach(function (search) {
        var temperatureKelvin = search.main.temp;
        var temperatureCelsius = kelvinToCelsius(temperatureKelvin);
        var temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);

        var forecastCard = document.createElement('div');
        forecastCard.classList.add('card', 'card-rounded', 'bg-light', 'text-dark', 'mb-3', 'p-3');
        
        var dateEl = document.createElement('h2');
        dateEl.classList.add('card-header');
        dateEl.textContent = search.dt_txt;
        forecastCard.appendChild(dateEl);

        var cloudEl = document.createElement('img');
        cloudEl.classList.add('card-img-top');
        var iconCode = search.weather[0].icon;
        var iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
        cloudEl.src = iconUrl;
        forecastCard.appendChild(cloudEl);

        var tempEl = document.createElement('p');
        tempEl.textContent = 'Temperature: ' + temperatureFahrenheit.toFixed(2);
        forecastCard.appendChild(tempEl);

        var humidityEl = document.createElement('p');
        humidityEl.textContent = 'Humidity: ' + search.main.humidity;
        forecastCard.appendChild(humidityEl);

        var windEl = document.createElement('p');
        windEl.textContent = 'Wind: ' + search.wind.speed + ' MPH';
        forecastCard.appendChild(windEl);

        resultContentEl.appendChild(forecastCard);
    });
}

function handlePriorSearchClick(event){
    searchInput.value = event.target.textContent;
    searchApi(searchInput.value);
}
function priorSearches() {
    var savedSearches = localStorage.getItem('searchInput')
    if (savedSearches) {
        var searchesArray = savedSearches.split(',');
        savedEl.innerHTML = '';
        searchesArray.forEach(function (search) {
          var listItem = document.createElement('button');
          listItem.classList.add('btn', 'btn-dark', 'btn-block', 'pl-0')
          listItem.textContent = search;
          savedEl.appendChild(listItem);
        });
    }
}
function handleSearchFormSubmit(event) {
    event.preventDefault();
  
    var search = searchInput.value
  
    if (!search) {
      console.error('You need a search input value!');
      return;
    }
    console.log(search)
    localStorage.setItem('searchInput', search);
    searchApi(search);
  }
savedEl.addEventListener('click',handlePriorSearchClick)
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
priorSearches()