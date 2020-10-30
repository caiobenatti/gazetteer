//starting variables for fetching data;
let locationMarker;
let lat;
let lng;
let country_name;
let borderLayer;
let currency;
var mymap = L.map('mapid').setView([51.505, -0.09], 5)
let countryDump;

//navigator getting the geolocation from browser
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log('--- Your Position: ---');
    console.log('Lat: ' + position.coords.latitude);
    lat = position.coords.latitude;
    console.log('Long: ' + position.coords.longitude);
    lng = position.coords.longitude;
    console.log('---------------------');
    let popup = L.popup().setLatLng([lat,lng]).setContent("You are here").openOn(mymap)
} 
)}

function getCountryList(){
  $.ajax({
    url: "libs/php/getCountryList.php",
    type: 'GET',
    dataType: 'json',
      success: function(result) {
        console.log(result)
        if(result[0].code == 200){
        $("#countries").append(`<option value="" disabled selected>Select a country</option>`);
    for (i = 1; i < result.length; i++) {
    $("#countries").append(`<option value="${result[i].iso_a2}">${result[i].name}</option>`);
  }
  }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown, jqXHR);
    }
  }); 
  }

getCountryList()

//initialize map
function mapStart(){
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2JlbmF0dGkiLCJhIjoiY2tnbjBtYnlzMTg4OTJ1bmFqZzBqNnRtNCJ9.UDgPFngvQmeW3XbRk16-wQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1

}).addTo(mymap);
}

// Easy Buttons
L.easyButton('fa-info-circle', function () {
$("#infoModal").modal("show");}, 'Country Information').addTo(mymap);

 L.easyButton('fa-money-bill-wave', function(){
 $("#Money").modal("show");}, 'Country Currency').addTo(mymap);

L.easyButton('fa-cloud-sun', function(){
 $("#Weather").modal("show");}, 'Country Weather').addTo(mymap);


// Set all the country info
function setCountryInfo(result) {
    capital = result['data'][0]['capital'];
    currency = result['data'][0]['currencyCode'];
    country_name = result['data'][0]['countryName'];
    lng = (result['data'][0]['north'] + result['data'][0]['south']) / 2;
    lat = (result['data'][0]['east'] + result['data'][0]['west']) / 2;
    $('#capital').html(capital);
    $('#population').html(formatPopulation(result['data'][0]['population']));
    $('#area').html(`${formatArea(result['data'][0]['areaInSqKm'])} km<sup>2</sup>`);
    $('#continent').html(result['data'][0]['continent']);
  }

// Changes on country selection
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
            if(result.status.code == 200){
              setFlag($('#countries').val());
              setCountryInfo(result);
              getWeatherData();
              getExchangeRateData();
              getWikipedia();
              if (borderLayer){
                  mymap.removeLayer(borderLayer);
              }
              applyCountryBorder($('#countries').val())
             }
           
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(`${textStatus} ${errorThrown}`);
        }
    });
});


//Function for APIS

//apply the borders on the map and move the map to new location
function applyCountryBorder(iso2) {
   $.ajax({
        url: "libs/php/getCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
            code: iso2,
              },
        success: function(result){
         if(result.status.code == 200){
        borderLayer = L.geoJSON(result, {
        color: "blue",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.0,
        dashArray: 20,
      }).addTo(mymap);
      mymap.addLayer(borderLayer);
      mymap.flyToBounds(borderLayer);
        } }
})};



function getExchangeRateData() {
    $.ajax({
        url: "libs/php/getExchange.php",
        type: 'GET',
        dataType: 'json',
          success: function(result){
            if(result){
                $('#currency').html(`${currency}`);
                $('#exchangeTitle').html(`${currency}`);
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
                $('#temperature').html((`${Math.floor(parseFloat(result['data']['main']['temp']) - 273.15)} <sup>o</sup>C`));
                $('#humidity').html(`${result['data']['main']['humidity']} %`);
                $('#sysCountry').html(`${result['data']['sys']['country']}`);
                $('#nameWeather').html(`${result['data']['name']}`);
                $("#iconWeather").html("<img src='http://openweathermap.org/img/wn/" + result['data']['weather'][0]['icon'] + "@4x.png'>");
                $('#descriptionWeather').html(`${result['data']['weather'][0]['description']}`);
                updateMarker(result['data']['coord']['lat'], result['data']['coord']['lon']);
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

//update the marker for the country capital
function updateMarker(lng, lat){
      if(locationMarker != undefined){
        mymap.removeLayer(locationMarker);
      }
    locationMarker = L.marker([lng, lat]).addTo(mymap).bindPopup(`Capital City: ${capital}`).openPopup();

};

//Sets the flag for the Country
function setFlag(iso2) {
    $('#country-flag').html(`<img src="https://www.countryflags.io/${iso2}/flat/64.png">`);
}

//functions for formatting numbers
function formatPopulation(num){
    let pop = parseInt(num);
    if(pop/1000000 > 1){
        return `${(pop/1000000).toFixed(2)} m`;
    }else if(pop/1000 > 1){
        return `${(pop/1000).toFixed(2)} thousand`;
    }else {
        return `${pop.toFixed()}`;
}
}

function formatArea(num){
    let area = Number(num).toPrecision();
    if(area/1000000 > 1){
        return `${(area/1000000).toFixed(2)} m`;
    }else if(area/1000 > 1) {
        return `${(area/1000).toFixed(2)} thousand`
    }else {
        return `${area}`;
    }
}


//start the map
mapStart();