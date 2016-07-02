/**
 * weather.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var APP_ID = "ab2771b4d49ab0798786dd6f2bee71a0";
	var weather;
	var isRefreshed = false;

	function getWeather(lat, lon) {
		console.log(lat);
		console.log(lon);
		var xhr = new XMLHttpRequest();
		//xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=53.2167&lon=6.55&APPID=ab2771b4d49ab0798786dd6f2bee71a0', false);
		xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + APP_ID, false);
		xhr.onload = function() {
			console.log("getting weather data..");
			console.log(this.responseText);
			weather = JSON.parse(this.responseText);
			console.log("sunset: " + weather.sys.sunset);
			console.log(JSON.stringify(weather));
		};
		xhr.send();
	}

	function getLocation() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://ip-api.com/json', false);
		xhr.onload = function() {
			console.log("getting location..");
			console.log(this.responseText);
			var data = JSON.parse(this.responseText);
			getWeather(data.lat, data.lon);
			console.log(JSON.stringify(data));
		};
		xhr.send();
	}
	
	function convertEpochTime(seconds) {
		var date = new Date(seconds * 1000);
		return date.getUTCHours() * 60 + date.getUTCMinutes() - date.getTimezoneOffset();
	}

	return {

		refresh: function() {
			isRefreshed = true;
			getLocation();
		},

		getSunset: function() { 
			return convertEpochTime(weather.sys.sunset);
		},

		getSunrise: function() {
			return convertEpochTime(weather.sys.sunrise);
		},

		getImageSource: function() {
			// example: http://openweathermap.org/img/w/10d.png
			return "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"; 
		},

		getTemperature: function() {
			return (weather.main.temp - 273.15).toFixed(0);
		},
		
		setIsRefreshed: function(bool) {
			isRefreshed = bool;
		},
		
		getIsRefreshed: function() {
			return isRefreshed;
		}
	};

});