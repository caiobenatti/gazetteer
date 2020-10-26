navigator.geolocation.getCurrentPosition((position) => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let currentLocation = mymap.setView([lat, lon], 7);
  
  let marker = L.marker([lat,lon]).addTo(mymap)
  let popup = L.popup().setLatLng([lat,lon]).setContent("You are here").openOn(mymap)

  console.log(position)

});

//set the map to London
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

//initialize map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2JlbmF0dGkiLCJhIjoiY2tnbjBtYnlzMTg4OTJ1bmFqZzBqNnRtNCJ9.UDgPFngvQmeW3XbRk16-wQ', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
        zoomOffset: -1
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
    showInfoBtn();
    $('#continent').html(result['data'][0]['continent']);
    capital = result['data'][0]['capital'];
    currency = result['data'][0]['currencyCode'];
    country = result['data'][0]['isoAlpha3'];
  	setCountry(result['data'][0]['countryName'])
    $('#capital').html(capital);
    $('#languages').html(result['data'][0]['languages']);
    $('#population').html(formatPopulation(result['data'][0]['population']));
    lng = (result['data'][0]['north'] + result['data'][0]['south']) / 2;
    lat = (result['data'][0]['east'] + result['data'][0]['west']) / 2;
    $('#area').html(`${formatArea(result['data'][0]['areaInSqKm'])} km<sup>2</sup>`);
  }


// Changes on country selection
$('#countries').change(function(){
    showInfoBtn();
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
               setCountryInfo(result);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(`${textStatus} ${errorThrown}`);
        }
    });
});

function showInfoBtn() {
    $('#btnInfo').css("display", "block");
}

function setCountry(countryName) {
    $('#countryName').html(countryName);
}
