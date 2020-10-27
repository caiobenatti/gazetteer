//starting variables for fetching data;
let locationMarker;
let lat;
let lng;
let country_name;
let rest_countries; 
let latLngBounds;
let borderLayer;
let layerGroup;
let currency;



navigator.geolocation.getCurrentPosition((position) => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  let currentLocation = mymap.setView([lat, lng], 7);
  
  updateMarker([lat,lng])
  let popup = L.popup().setLatLng([lat,lng]).setContent("You are here").openOn(mymap)

  console.log(position)

});


var mymap = L.map('mapid').setView([51.505, -0.09], 5)


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


L.easyButton('fas fa-info-circle', function () {
$("#infoModal").modal("show");}, 'Country Introduction').addTo(mymap);

L.easyButton( 'fa-search', function(){
  alert('you just clicked a font awesome icon');
}).addTo(mymap);

// pointing to html dropdown list countries
const countriesList = document.getElementById("countries");

//get countries info from Restcountries
fetch("https://restcountries.eu/rest/v2/all")
  .then(res => res.json())
  .then(data => initialize(data))
  .catch(err => console.log("Rest Countries fetch Error:", err));

//create a list of all countries
function initialize(countriesData) {
  rest_countries = countriesData;
  let options = "";

  for (i = 0; i < rest_countries.length; i++) {
    if (i == 0) {
      options += '<option value="" disabled selected>Select a country</option>';
    }
    options += `<option value="${rest_countries[i].alpha2Code}">${rest_countries[i].name}</option>`;
  }

  countriesList.innerHTML = options;

}
// Set all the country info
function setCountryInfo(result) {
    capital = result['data'][0]['capital'];
    currency = result['data'][0]['currencyCode'];
    country_name = result['data'][0]['countryName'];
    lng = (result['data'][0]['north'] + result['data'][0]['south']) / 2;
    lat = (result['data'][0]['east'] + result['data'][0]['west']) / 2;
    $('#capital').html(capital);
    $('#languages').html(result['data'][0]['languages']);
    $('#population').html(result['data'][0]['population']);
    $('#area').html(`${result['data'][0]['areaInSqKm']} km<sup>2</sup>`);
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
              setCountryInfo(result);
              getWeatherData();
              applyCountryBorder(mymap, country_name);
              getExchangeRateData();
              getWikipedia();
              updateMarker(lng, lat)
            }
           
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(`${textStatus} ${errorThrown}`);
        }
    });
});


//Function for APIS

function applyCountryBorder(map, countryname) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url:
        "https://nominatim.openstreetmap.org/search?country=" +
        countryname.trim() +
        "&polygon_geojson=1&format=json"
    })
    .then(function (data) {
      latLngBounds = data[0].boundingbox;
      borderLayer = L.geoJSON(data[0].geojson, {
        color: "blue",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.0
      }).addTo(mymap);
      layerGroup.addLayer(borderLayer);
      mymap.flyToBounds(borderLayer);
    });


}

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
                $('#temperature').html((`${Math.floor(parseFloat(result['data']['main']['temp']) - 273.15)} <sup>o</sup>C`));
                $('#humidity').html(`${result['data']['main']['humidity']} %`);
                lng = result['data']['coord']['lon'];
                lat = result['data']['coord']['lat'];
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
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
}


function updateMarker(lng, lat){
     if(borderLayer){
        layerGroup.removeLayer(borderLayer);
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

mapStart();