let userInputCard = document.querySelector('#input-card');
let searchButton = document.querySelector('#search-card');

searchButton.addEventListener('click', function () {
  cardWeatherDisplay(userInputCard.value);
});

function cardWeatherDisplay(data) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=a6dfadb0e5ed5408bd344f8dbd9df8d2&units=metric`
  )
    .then(response => response.json())
    .then(data => {
      document.querySelector('.degree-c').innerHTML =
        Math.round(data.main.temp) + '°C';
      document.querySelector('.city-name').innerHTML = data.name;
      document.querySelector('.humid').innerHTML = data.main.humidity + '%';
      document.querySelector('.wind').innerHTML = data.wind.speed + 'Km/h';
      document.getElementById('card-icon').src =
        'images/' + data.weather[0].main + '.png';
    });
}
cardWeatherDisplay('addis abeba');

function chartDrawer(data) {
  document.getElementById('conImg').innerHTML = '';
  var country = data.name;
  var temperature = data.main.temp;
  var humidity = data.main.humidity;
  var wind = data.wind.speed;
  let i = document.createElement('img');
  i.style = 'width: 60px; height: 60px';
  i.src = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
  document.getElementById('conImg').appendChild(i);

  var chartData = [
    { name: 'Temperature', y: temperature },
    { name: 'Humidity', y: humidity },
    { name: 'Wind', y: wind },
  ];

  var chartOptions = {
    chart: {
      backgroundColor: 'transparent',
      type: 'column',
    },

    title: {
      text: 'Weather Data ' + country,
      style: {
        color: 'white',
      },
    },
    xAxis: {
      type: 'category',
      style: {
        color: 'white',
      },
      labels: {
        style: {
          color: 'white',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Value',
        style: {
          color: 'white',
        },
      },
      labels: {
        style: {
          color: 'white',
        },
      },
    },
    series: [
      {
        color: 'rgb(185, 255, 15)',
        name: 'Weather Data',
        data: chartData,
        dataLabels: {
          style: {
            color: 'white',
          },
        },
      },
    ],
  };

  Highcharts.chart('chartContainer', chartOptions);
}
window.addEventListener('load', function () {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Addis+Ababa&appid=a6dfadb0e5ed5408bd344f8dbd9df8d2&units=metric`
  )
    .then(response => response.json())
    .then(data => {
      chartDrawer(data);
    });
});
function getWeatherData() {
  var countryInput = document.getElementById('countryInput').value;
  var apiKey = 'a6dfadb0e5ed5408bd344f8dbd9df8d2';
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${countryInput}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      chartDrawer(data);
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

fetch('https://api.covidtracking.com/v1/states/current.json')
  .then(response => response.json())
  .then(data => {
    chartData = data.map(d => ({
      name: d.state,
      cases: d.positive,
      death: d.death,
    }));
    // Create the chart after the data is loaded
    console.log(chartData);
    createChart();
  })
  .catch(err => console.log(err));

function createChart() {
  Highcharts.chart('container', {
    f: console.log(chartData),
    chart: {
      style: {
        fontFamily: 'sans-serif',
        color: '#fff',
      },
      backgroundColor: '#161936',
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
      },
    },
    title: {
      text: 'COVID-19 Cases and Deaths by State',
      align: 'left',
    },
    subtitle: {
      text: '3D Donut Chart',
      align: 'left',
    },
    plotOptions: {
      pie: {
        innerSize: '50%',
        depth: 45,
      },
    },
    series: [
      {
        name: 'Cases',
        data: chartData.map(d => [d.name, d.cases]),
      },
      {
        name: 'Deaths',
        data: chartData.map(d => [d.name, d.death]),
      },
    ],
  });
}

// Function to fetch data from the World Bank API
function fetchData() {
  fetch(
    'http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json'
  )
    .then(response => response.json())
    .then(data => {
      // Extract the necessary data for the chart
      const chartData = data[1].map(item => ({
        year: item.date,
        population: item.value,
      }));

      // Create the Highcharts chart
      createPopulationChart(chartData);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to create the population chart using Highcharts
function createPopulationChart(data) {
  Highcharts.chart('populationChartContainer', {
    chart: {
      backgroundColor: '#161936',
      type: 'line',
    },
    title: {
      style: {
        fontFamily: 'monospace',
        color: '#fff',
      },
      text: 'World Population Over Time',
    },
    xAxis: {
      title: {
        text: 'Year',
        style: {
          color: '#209594', // Set the desired title text color
        },
      },
      labels: {
        style: {
          color: '#fff', // Set the desired categories text color
        },
      },
      categories: data.map(item => item.year),
    },

    yAxis: {
      title: {
        text: 'Population',
        style:{
          color: '#209594',
        },
      },
        labels: {
          style: {
            color: '#fff',
          },
        }
      },
    series: [
      {
        name: 'Population',
        data: data.map(item => parseInt(item.population)),
      },
    ],
  });
}

fetchData();




let death = 494;
let hospitalized = 10148;
let selectedState = document.getElementById('selectState');
selectedState.addEventListener('change', async function () {
  let resp = await fetch(
    `https://api.covidtracking.com/v2/states/${selectedState.value}/daily.json`
  );
  let d = await resp.json();
  hospitalized = d.data[0].outcomes.hospitalized.currently.value;
  death = d.data[0].outcomes.death.total.value;
   const selectedOption = selectedState.options[selectedState.selectedIndex];
   const stateText = selectedOption.textContent;
 console.log(stateText)
  console.log(d);
  console.log(death);
  console.log(hospitalized);
  covid19Bystate(death, hospitalized,stateText);
});
function covid19Bystate(dea,hos,stateName) {
  document.getElementById('death-Value').innerHTML = dea; 
  document.getElementById('hosp-Value').innerHTML = hos;

  

  Highcharts.chart('covidDataByState', {
    chart: {
      type: 'column',
      backgroundColor: '#161936',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 70,
      },
    },
    title: {
      text: `USA Covid 19 Cases & Deaths ${stateName}`,
      align: 'left',
      style: {
        color: '#fff',
      },
    },
    subtitle: {
      text:
        'Source: ' +
        '<a href="https://www.ssb.no/en/statbank/table/08804/"' +
        'target="_blank">SSB</a>',
      align: 'left',
      style: {
        color: '#fff',
      },
    },
    plotOptions: {
      column: {
        depth: 25,
      },
    },
    xAxis: {
      categories: ['Deaths', 'Hospitalized'],
      labels: {
        skew3d: true,
        style: {
          color: '#fff',
          fontSize: '16px',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Deaths and Hospitalized',
        margin: 20,
        style: {
          color: '#fff',
        },
      },
      labels: {
        style: {
          color: '#fff',
        },
      },
    },

    tooltip: {
      valueSuffix: ' ',
    },
    series: [
      {
        name: 'Covid-19',
        data: [dea, hos],
      },
    ],
  });
}

covid19Bystate(death, hospitalized, 'alabama');
