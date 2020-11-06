//starting variables for fetching data;
let locationMarker;
let lat;
let lng;
let countryName;
let borderLayer;
let iso2;
let currency;
let mymap = L.map("mapid").setView([51.505, -0.09], 5);
let dataDump;
// let today = new Date().toJSON().slice(0, 10);
// let tenDays = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 10)
//   .toJSON()
//   .slice(0, 10);
let xs = [];
let ys = [];
let markers = L.markerClusterGroup();
let markerCluster;
let icon = L.icon({
  iconUrl: "./libs/misc/map-pin.png",
  iconAnchor: [24, 40],
  popupAnchor: [0, -30],
});
let api_key = "563492ad6f9170000100000111ea22fd186042d187ad50892156775b";

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
      if (result[0] == 200) {
        $("#countries").append(
          `<option value="" disabled selected>Select a country</option>`
        );
        for (i = 1; i < result.length; i++) {
          $("#countries").append(
            `<option value="${result[i].name}">${result[i].name}</option>`
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

L.easyButton(
  "fa-camera",
  function () {
    $("#photos").modal("show");
  },
  "Astronomy picture of the Day"
).addTo(mymap);

L.easyButton(
  "fa-street-view",
  function () {
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2JlbmF0dGkiLCJhIjoiY2tnbjBtYnlzMTg4OTJ1bmFqZzBqNnRtNCJ9.UDgPFngvQmeW3XbRk16-wQ",
      {
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(mymap);
  },
  "Street View"
).addTo(mymap);

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

L.easyButton(
  "fa-landmark",
  function () {
    if (mymap.hasLayer(markers)) {
      mymap.removeLayer(markers);
    } else {
      mymap.addLayer(markers);
    }
  },
  "Remove Markers"
).addTo(mymap);

// Set all the country info
function setCountryInfo(result) {
  capital = result["data"][0]["capital"];
  currency = result["data"][0]["currencies"][0]["code"];
  countryName = result["data"][0]["name"];
  countryName = countryName.replace(" ", "+");
  geoNameID = result["data"][0]["geonameId"];
  iso2 = result["data"][0]["alpha2Code"];
  $("#capital").html(capital);
  $("#population").html(formatPopulation(result["data"][0]["population"]));
  $("#area").html(`${formatArea(result["data"][0]["area"])} km<sup>2</sup>`);
  $("#continent").html(result["data"][0]["region"]);
  $("#subcontinent").html(result["data"][0]["subregion"]);
  $("#nativeName").html(result["data"][0]["nativeName"]);
  $("#country-flag").html(`<img src="${result["data"][0]["flag"]}">`);
  $("#languages").html("");
  let lang = [];
  for (let i = 0; i < result.data[0].languages.length; i++) {
    lang.push(`${result.data[0].languages[i].name}`);
  }
  lang.join(",");
  $("#languages").append(`<span> ${lang}</span>`);
  let bord = [];
  $("#borders").html("");
  for (let i = 0; i < result.data[0].borders.length; i++) {
    bord.push(`${result.data[0].borders[i]}`);
  }
  bord.join(",");
  $("#borders").append(`<span> ${bord}</span>`);
  // $("#timeZone").html(result["data"][0]["timezones"]);
  let tz = [];
  $("#timeZone").html("");
  for (let i = 0; i < result.data[0].timezones.length; i++) {
    tz.push(`${result["data"][0]["timezones"][i]}`);
  }
  tz.join(",");
  $("#timeZone").append(`<span> ${tz}</span>`);
}

// Changes on country selection
$("#countries").change(function () {
  $.ajax({
    url: "libs/php/getCountryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      country: $("#countries").val(),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        dataDump = result;
        setCountryInfo(result);
        getWikipedia();
        getExchangeRateData();
        // country_code = $("#countries").val();
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
        mymap.fitBounds(borderLayer.getBounds());
        addPOI();
        getWeatherData();
        getPhotos();
      }
    },
  });
}

function addPOI() {
  $.ajax({
    url: "libs/php/getUnesco.php",
    type: "POST",
    dataType: "json",
    data: {
      q: countryName,
    },
    success: function (result) {
      console.log(result);
      if (result.status.code == 200) {
        if (markers != undefined) {
          markers.clearLayers();
        }
        for (let i = 0; i < result.data.records.length; i++) {
          markers.addLayer(
            L.marker([
              result.data.records[i].fields.coordinates[0],
              result.data.records[i].fields.coordinates[1],
            ]).bindPopup(`Name: ${result.data.records[i].fields.site} <br><br>
            Description: ${result.data.records[i].fields.short_description} <br>
             <a href='${result.data.records[i].fields.http_url}' target="_blank" class="customA">Unesco website</a>`)
          );
        }
        mymap.addLayer(markers);
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
        // $("#currency").html(`${currency}`);
        // $("#exchangeRate").html(
        //   `${currency}/USD <span class="bold">${result[0]["data"]["rates"][
        //     currency
        //   ].toFixed(2)} / ${result[0]["data"]["rates"]["USD"].toFixed(
        //     2
        //   )}</span><br>`
        // );
        // xs = [];
        // ys = [];
        // for (let i = 0; i < result.length; i++) {
        //   ys.push(result[i]["data"]["rates"][currency]);
        //   xs.push(timeConverter(result[i]["data"]["timestamp"]));
        // }
        // xs.reverse();
        // ys.reverse();
        // updateChart();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`Error in exchange: ${textStatus} ${errorThrown} ${jqXHR}`);
    },
  });
}

function getWeatherData() {
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
          `${Math.round(
            result["data"]["daily"][0]["temp"]["day"]
          )} <sup>o</sup>C `
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
          `Humidity: <span class="bold">${result["data"]["daily"][0]["humidity"]}</span> % - Wind speed: <span class="bold">${result["data"]["daily"][0]["wind_speed"]}</span>`
        );
        $("#sysCountry").html(`${iso2}`);
        $("#nameWeather").html(`${capital}`);
        $("#iconWeather").html(
          "<img src='https://openweathermap.org/img/wn/" +
            result["data"]["daily"][0]["weather"][0]["icon"] +
            "@4x.png'>"
        );
        $("#descriptionWeather").html(
          `${result["data"]["daily"][0]["weather"][0]["description"]}`
        );
        //reseting the html to append new
        $("#days").html("");
        //loop through the data and append to the #days
        for (i = 1; i < 4; i++) {
          $("#days").append(`<li><span class="day-name">${timeConverter(
            result["data"]["daily"][i].dt
          )}</span>
                 <div><img src='https://openweathermap.org/img/wn/${
                   result["data"]["daily"][i]["weather"][0]["icon"]
                 }.png'> </div><br>
                 <div class="temperature">${Math.round(
                   result["data"]["daily"][i]["temp"].max
                 )} <span class="degree">&#8451;</span> / ${Math.round(
            result["data"]["daily"][i]["temp"].min
          )} <span class="degree">&#8451;</span></div>
                </li>`);
        }
        updateMarker(result["data"]["lat"], result["data"]["lon"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown, jqXHR);
    },
  });
}

function getWikipedia() {
  $.ajax({
    url: "libs/php/getWikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      q: countryName,
    },
    success: function (result) {
      $("#wikipedia").html(`${result["data"][0]["summary"]}`);
      $("#wikiurl").html(
        `More info: <a href='http://${result["data"][0]["wikipediaUrl"]}' target="_blank" class="customA">${result["data"][0]["wikipediaUrl"]} </a>`
      );
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown, jqXHR);
    },
  });
}

function getPhotos() {
  $.ajax({
    method: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", api_key);
    },
    url: `https://api.pexels.com/v1/search?query=${countryName}`,
    success: function (result) {
      markup = "";
      for (let i = 0; i < result.photos.length; i++) {
        markup += '<div class="carousel-item">';
        markup += `<img src="${result.photos[i].src.original}">
        <br>
        `;
        markup += `<p>${result.photos[i].photographer}</p><br>`;
        markup += `<a href='${result.photos[i].url}' target="_blank" class="customA">View on Pexels</a> <br>`;

        markup += "</div>";
      }
      $("#carousel-deck .carousel-inner").html(markup);
      $("#carousel-deck .carousel-item").first().addClass("active");
      $("#carousel-deck .carousel-indicators > li").first().addClass("active");
      $("#carousel-deck").carousel({
        pause: true,
        interval: false,
      });
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
  locationMarker = L.marker([lng, lat], { icon: icon })
    .addTo(mymap)
    .bindPopup(`Capital City: ${capital}`)
    .openPopup();
}

//chart functions
function updateChart() {
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
