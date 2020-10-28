//starting variables for fetching data;
let locationMarker;
let lat;
let lng;
let country_name;
let borderLayer;
let currency;
let countryDump;
let layerGroup;
const countriesList = document.getElementById("countries");
var mymap = L.map('mapid').setView([51.505, -0.09], 5)


navigator.geolocation.getCurrentPosition((position) => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  let currentLocation = mymap.setView([lat, lng], 13);
  
  updateMarker([lat,lng])
  let popup = L.popup().setLatLng([lat,lng]).setContent("You are here").openOn(mymap)

  console.log(position)

});




//create a list of all countries
function getCountryList(){
  $.ajax({
    url: "libs/php/getCountry.php",
    type: 'GET',
    dataType: 'json',
      success: function(result) {
        countryDump = result;
        countryDump.sort((a, b) => a.properties.name < b.properties.name ? -1 : 1)
        cList();
      },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown, jqXHR);
    }
  }); 
}

getCountryList()

function findNumber (iso2code) {
  for (i = 0 ; i < countryDump.length; i++){
    if (countryDump[i].properties.iso_a2 == iso2code){
      dataset = countryDump[i]
    }
  }
}

function cList() {
let options = "";
for (i = 0; i < countryDump.length; i++) {
    if (i == 0) {
      options += '<option value="" disabled selected>Select a country</option>';
    }
    options += `<option value="${countryDump[i].properties.iso_a2}">${countryDump[i].properties.name}</option>`;
  }

  countriesList.innerHTML = options;
}


//initialize map
function mapStart(){
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2JlbmF0dGkiLCJhIjoiY2tnbjBtYnlzMTg4OTJ1bmFqZzBqNnRtNCJ9.UDgPFngvQmeW3XbRk16-wQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    continuousWorld: false,
    noWrap: true,
    zoomOffset: -1
}).addTo(mymap);
}

  layerGroup = new L.LayerGroup();
  layerGroup.addTo(mymap);

// Easy Buttons
L.easyButton('fas fa-info-circle', function () {
$("#infoModal").modal("show");}, 'Country Introduction').addTo(mymap);

L.easyButton( 'fa-cloud-sun', function(){
 $("#Weather").modal("show");}, 'Country Introduction').addTo(mymap).addTo(mymap);

// Set all the country info
function setCountryInfo(result) {
    capital = result['data'][0]['capital'];
    currency = result['data'][0]['currencyCode'];
    country_name = result['data'][0]['countryName'];
    lng = (result['data'][0]['north'] + result['data'][0]['south']) / 2;
    lat = (result['data'][0]['east'] + result['data'][0]['west']) / 2;
    $('#capital').html(capital);
    $('#languages').html(result['data'][0]['languages']);
    $('#population').html(formatPopulation(result['data'][0]['population']));
    $('#area').html(`${formatArea(result['data'][0]['areaInSqKm'])} km<sup>2</sup>`);
    $('#continent').html(result['data'][0]['continent']);
  }


// // Changes on country selection
$('#countries').change(function(){
      $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countries').val(),
            lang: 'en'
        },
        success: function(result){
            console.log(result);
            if(result.status.code == 200){
              setFlag($('#countries').val());
              findNumber($('#countries').val());
              setCountryInfo(result);
              getWeatherData();
              getExchangeRateData();
              getWikipedia();
              applyCountryBorder();
             }
           
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(`${textStatus} ${errorThrown}`);
        }
    });
});


//Function for APIS


function applyCountryBorder() {
         borderLayer = L.geoJSON(dataset.geometry, {
        color: "blue",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.0
      }).addTo(mymap);
      layerGroup.addLayer(borderLayer);
      mymap.flyToBounds(borderLayer);
      
};



function getExchangeRateData() {
    $.ajax({
        url: "libs/php/getExchange.php",
        type: 'GET',
        dataType: 'json',
          success: function(result){
            if(result){
                console.log(result);
                $('#currency').html(`${currency}`);
                $('#exchangeTitle').html(`USD/${currency}`);
                $('#exchangeRate').html(`${result['data']['rates'][currency]}`);
                 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(`Error in exchange: ${textStatus} ${errorThrown} ${jqXHR}`);
        }
    });
}

function getWeatherData(){
    $.ajax({
        url: "libs/php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            capital: capital
        },
        success: function(result){
            if(result.status.code == 200){
                console.log(result);
                lng = result['data']['coord']['lon'];
                lat = result['data']['coord']['lat'];
                $('#temperature').html((`${Math.floor(parseFloat(result['data']['main']['temp']) - 273.15)} <sup>o</sup>C`));
                $('#humidity').html(`${result['data']['main']['humidity']} %`);
                $('#sysCountry').html(`${result['data']['sys']['country']}`);
                $('#nameWeather').html(`${result['data']['name']}`);
                console.log(result['data']['weather'][0]['icon'])
                $("#iconWeather").html("<img src='http://openweathermap.org/img/wn/" + result['data']['weather'][0]['icon'] + "@4x.png'>");
                $('#descriptionWeather').html(`${result['data']['weather'][0]['description']}`);
                updateMarker(result['data']['coord']['lat'], result['data']['coord']['lon']);
                applyCountryBorder();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(`Error in weather: ${textStatus} : ${errorThrown} : ${jqXHR}`);
        }
    });
}

function getWikipedia(){
  $.ajax({
    url: "libs/php/getWikipedia.php",
    type: 'POST',
    dataType: 'json',
    data: {
      q: country_name
    },
    success: function(result) {
    $('#wikipedia').html(`${result['data'][0]['summary']}`);
    $('#wikiurl').html(`<a href='${result['data'][0]['wikipediaUrl']}'>${result['data'][0]['wikipediaUrl']} </a>`);
      },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown, jqXHR);
    }
  }); 
}

function updateMarker(lng, lat){
     if(borderLayer != undefined){
        layerGroup.remove(borderLayer);
      }
      if(locationMarker != undefined){
        mymap.removeLayer(locationMarker);
      }
    locationMarker = L.marker([lng, lat]).addTo(mymap).bindPopup(`Capital City: ${capital}`).openPopup();

};

//Sets the flag for the Country
function setFlag(iso2code) {
    $('#country-flag').html(`<img src="https://www.countryflags.io/${iso2code}/flat/64.png">`);
}
//functions for formatting numbers
function formatPopulation(num){
    let pop = parseInt(num);
    if(pop/1000000 > 1){
        return `${(pop/1000000).toFixed(2)} millon`;
    }else if(pop/1000 > 1){
        return `${(pop/1000).toFixed(2)} thousand`;
    }else {
        return `${pop.toFixed()}`;
}
}

function formatArea(num){
    let area = Number(num).toPrecision();
    if(area/1000000 > 1){
        return `${(area/1000000).toFixed(2)} millon`;
    }else if(area/1000 > 1) {
        return `${(area/1000).toFixed(2)} thousand`
    }else {
        return `${area}`;
    }
}


//start the map
mapStart();