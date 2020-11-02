//starting variables for fetching data;
let locationMarker;
let lat;
let lng;
let country_name;
let borderLayer;
let currency;
let mymap = L.map("mapid").setView([51.505, -0.09], 5);
let dataDump;
let country_code;
// let today = new Date().toJSON().slice(0, 10);
// let tenDays = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 10)
//   .toJSON()
//   .slice(0, 10);
let xs = [];
let ys = [];

//navigator getting the geolocation from browser
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log("--- Your Position: ---");
    console.log("Lat: " + position.coords.latitude);
    lat = position.coords.latitude;
    console.log("Long: " + position.coords.longitude);
    lng = position.coords.longitude;
    console.log("---------------------");
    let popup = L.popup()
      .setLatLng([lat, lng])
      .setContent("You are here")
      .openOn(mymap);
  });
}

function getCountryList() {
  $.ajax({
    url: "libs/php/getCountryList.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result[0].code == 200) {
        $("#countries").append(
          `<option value="" disabled selected>Select a country</option>`
        );
        for (i = 1; i < result.length; i++) {
          $("#countries").append(
            `<option value="${result[i].iso_a2}">${result[i].name}</option>`
          );
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown, jqXHR);
    },
  });
}

getCountryList();

//initialize map
function mapStart() {
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2JlbmF0dGkiLCJhIjoiY2tnbjBtYnlzMTg4OTJ1bmFqZzBqNnRtNCJ9.UDgPFngvQmeW3XbRk16-wQ",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(mymap);
  // L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
  //     maxZoom: 20,
  //     subdomains:['mt0','mt1','mt2','mt3'],
  //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  //       '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  //       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //   }).addTo(mymap)
}

// Easy Buttons
L.easyButton(
  "fa-info-circle",
  function () {
    $("#infoModal").modal("show");
  },
  "Country Information"
).addTo(mymap);

L.easyButton(
  "fa-money-bill-wave",
  function () {
    $("#Money").modal("show");
    updateChart();
  },
  "Country Currency"
).addTo(mymap);

L.easyButton(
  "fa-cloud-sun",
  function () {
    $("#Weather").modal("show");
  },
  "Country Weather"
).addTo(mymap);

//  L.easyButton('fa-street-view', function(){L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2JlbmF0dGkiLCJhIjoiY2tnbjBtYnlzMTg4OTJ1bmFqZzBqNnRtNCJ9.UDgPFngvQmeW3XbRk16-wQ', {
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1
// }).addTo(mymap);

L.easyButton(
  "fa-satellite",
  function () {
    L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(mymap);
  },
  "Satellite View"
).addTo(mymap);

// Set all the country info
function setCountryInfo(result) {
  capital = result["data"][0]["capital"];
  currency = result["data"][0]["currencyCode"];
  country_name = result["data"][0]["countryName"];
  $("#capital").html(capital);
  $("#population").html(formatPopulation(result["data"][0]["population"]));
  $("#area").html(
    `${formatArea(result["data"][0]["areaInSqKm"])} km<sup>2</sup>`
  );
  $("#continent").html(result["data"][0]["continentName"]);
}

// Changes on country selection
$("#countries").change(function () {
  $.ajax({
    url: "libs/php/getCountryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      country: $("#countries").val(),
      lang: "en",
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        setFlag($("#countries").val());
        setCountryInfo(result);
        getWeatherData(capital);
        getExchangeRateData();
        getWikipedia();
        country_code = $("#countries").val();
        if (borderLayer) {
          mymap.removeLayer(borderLayer);
        }
        applyCountryBorder($("#countries").val());
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`${textStatus} ${errorThrown}`);
    },
  });
});

//Function for APIS

//apply the borders on the map and move the map to new location
function applyCountryBorder(iso2) {
  $.ajax({
    url: "libs/php/getCountry.php",
    type: "POST",
    dataType: "json",
    data: {
      code: iso2,
    },
    success: function (result) {
      if (result.status.code == 200) {
        borderLayer = L.geoJSON(result, {
          color: "blue",
          weight: 3,
          opacity: 1,
          fillOpacity: 0.0,
          dashArray: 20,
        }).addTo(mymap);
        mymap.addLayer(borderLayer);
        mymap.flyToBounds(borderLayer);
      }
    },
  });
}

function getExchangeRateData() {
  $.ajax({
    url: "libs/php/getExchange.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result) {
        console.log(result);
        dataDump = result;
        $("#currency").html(`${currency}`);
        $("#exchangeRate").html(
          `${currency}/USD <span class="bold">${result[0]["data"]["rates"][
            currency
          ].toFixed(2)} / ${result[0]["data"]["rates"]["USD"].toFixed(
            2
          )}</span><br>`
        );
        xs = [];
        ys = [];
        for (let i = 0; i < result.length; i++) {
          ys.push(result[i]["data"]["rates"][currency]);
          xs.push(timeConverter(result[i]["data"]["timestamp"]));
        }
        console.log(xs, ys);
        updateChart();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`Error in exchange: ${textStatus} ${errorThrown} ${jqXHR}`);
    },
  });
}

function getWeatherData(capital) {
  $.ajax({
    url: "libs/php/getWeather.php",
    type: "POST",
    dataType: "json",
    data: {
      capital: capital,
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        $("#temperature").html(
          `${Math.round(result["dataToday"]["main"]["temp"])} <sup>o</sup>C `
        );
        $("#feelsLike").html(`<span class="temperature">
                feels like <span class="bold">${Math.round(
                  result["data"]["daily"][0]["feels_like"]["day"]
                )} </span><span class="degree">&#8451;</span>
                 - <span class="small">max</span> <span class="bold">${Math.round(
                   result["data"]["daily"][0]["temp"].max
                 )} </span> <span class="degree">&#8451;</span> 
                 / <span class="small">min</span> <span class="bold">${Math.round(
                   result["data"]["daily"][0]["temp"].min
                 )}</span> <span class="degree">&#8451;</span></span>`);
        $("#humidity").html(
          `Humidity: <span class="bold">${result["dataToday"]["main"]["humidity"]}</span> % - Wind speed: <span class="bold">${result["dataToday"]["wind"]["speed"]}</span>`
        );
        $("#sysCountry").html(`${country_code}`);
        $("#nameWeather").html(`${capital}`);
        $("#iconWeather").html(
          "<img src='http://openweathermap.org/img/wn/" +
            result["dataToday"]["weather"][0]["icon"] +
            "@4x.png'>"
        );
        $("#descriptionWeather").html(
          `${result["dataToday"]["weather"][0]["description"]}`
        );
        //reseting the html to append new
        $("#days").html("");
        //loop through the data and append to the #days
        for (i = 1; i < 4; i++) {
          $("#days").append(`<li><span class="day-name">${timeConverter(
            result["data"]["daily"][i].dt
          )}</span>
                 <div><img src='http://openweathermap.org/img/wn/${
                   result["data"]["daily"][i]["weather"][0]["icon"]
                 }.png'> </div><br>
                 <div class="temperature">${Math.round(
                   result["data"]["daily"][i]["temp"].max
                 )} <span class="degree">&#8451;</span> / ${Math.round(
            result["data"]["daily"][i]["temp"].min
          )} <span class="degree">&#8451;</span></div>
                </li>`);
        }
        updateMarker(
          result["dataToday"]["coord"]["lat"],
          result["dataToday"]["coord"]["lon"]
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(
        `Error in weather: ${textStatus} : ${errorThrown} : ${jqXHR}`
      );
    },
  });
}

function getWikipedia() {
  $.ajax({
    url: "libs/php/getWikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      q: country_name,
    },
    success: function (result) {
      $("#wikipedia").html(`${result["data"][0]["summary"]}`);
      $("#wikiurl").html(
        `<a href='http://${result["data"][0]["wikipediaUrl"]}' target="_blank">${result["data"][0]["wikipediaUrl"]} </a>`
      );
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown, jqXHR);
    },
  });
}

//update the marker for the country capital
function updateMarker(lng, lat) {
  if (locationMarker != undefined) {
    mymap.removeLayer(locationMarker);
  }
  locationMarker = L.marker([lng, lat])
    .addTo(mymap)
    .bindPopup(`Capital City: ${capital}`)
    .openPopup();
}

//Sets the flag for the Country
function setFlag(iso2) {
  $("#country-flag").html(
    `<img src="https://www.countryflags.io/${iso2}/flat/64.png">`
  );
}

//chart functions
async function updateChart() {
  await getWeatherData();
  let myChart = null;
  if (myChart != null) {
    myChart.destroy();
  }
  const ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xs,
      datasets: [
        {
          label: `Changes on the last 5 days of ${currency}`,
          data: ys,
          fill: false,
          backgroundColor: "orange",
          borderColor: "orange",
          borderWidth: 1,
        },
      ],
    },
    // options: {
    //   scales: {
    //     yAxes: [
    //       {
    //         ticks: {
    //           beginAtZero: true,
    //         },
    //       },
    //     ],
    //   },
    // },
  });
}

//functions for formatting numbers
function formatPopulation(num) {
  let pop = parseInt(num);
  if (pop / 1000000 > 1) {
    return `${(pop / 1000000).toFixed(2)} m`;
  } else if (pop / 1000 > 1) {
    return `${(pop / 1000).toFixed(2)} thousand`;
  } else {
    return `${pop.toFixed()}`;
  }
}

function formatArea(num) {
  let area = Number(num).toPrecision();
  if (area / 1000000 > 1) {
    return `${(area / 1000000).toFixed(2)} m`;
  } else if (area / 1000 > 1) {
    return `${(area / 1000).toFixed(2).toString()} thousand`;
  } else {
    return `${area}`;
  }
}

//format date for fiveday forecast
// function formatDate (input) {
//   var datePart = input.match(/\d+/g),
//   year = datePart[0].substring(2), // get only two digits
//   month = datePart[1], day = datePart[2];

//   return day+'/'+month;
// }

// function converter(UNIX_timestamp) {
//   var a = new Date(UNIX_timestamp * 1000);
//   var months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   var year = a.getFullYear();
//   var month = a.getMonth();
//   var date = a.getDate();
//   var hour = a.getHours();
//   var min = a.getMinutes();
//   var sec = a.getSeconds();
//   var time =
//     date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
//   return time;
// }

//convert unix time to date/month
function timeConverter(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[a.getMonth()];
  const date = a.getDate();
  const time = date + "/" + month;
  return time;
}

//start the map
mapStart();
