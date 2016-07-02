/**
 * events.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['time'], function(time) {

	var SESSION_ENDPOINT = "https://zeeguu.unibe.ch/upload_smartwatch_events";
	var SEND_INTERVAL = 600; // 10 minutes

	var events = [];
	var numberOfEvents = 0;

	function clearEvents() {
		events = [];
		numberOfEvents = 0;
	}

	return {

		add: function(event, id) {
			time.create();
			events[numberOfEvents++] = {
				"bookmark_id": id,
				"time": time.getTimestamp(),
				"event": event
			};
		},
		
		//save
		save: function() {
			if (localStorage.getItem("events") !== null) {
				var storage = JSON.parse(localStorage.getItem("events"));
				console.log("currently in local storage: " + JSON.stringify(storage));
				console.log("saving...");
				localStorage.setItem("events", JSON.stringify(storage.concat(events)));
				var test = JSON.parse(localStorage.getItem("events"));
				console.log("events saved: " + JSON.stringify(test));
			} else {
				//already something in storage
				console.log("currently no events in storage");
				console.log("saving...");
				localStorage.setItem("events", JSON.stringify(events));
				console.log("events saved: " + JSON.stringify(events));
			}
			clearEvents();
		},

		load: function(events) {
			events = JSON.parse(events);
			numberOfEvents = events.length-1;
			console.log(numberOfEvents+1 + " events loaded: " + JSON.stringify(events));
		},

		send: function(sessionNumber) {
			console.log("In send function, sessionNumber == " + sessionNumber);
			var data = new FormData();
			data.append('events', JSON.stringify(events));

			var xhr = new XMLHttpRequest();
			xhr.open('POST', SESSION_ENDPOINT + "?session=" + sessionNumber, false);
			xhr.onload = function () {
				console.log(this.responseText);
				if (this.responseText === "OK") {
					console.log("events are succesfully send!");
				} else {
					console.log("events are not send.");
				}
			};
			xhr.send(data);
		},

		print: function() {
			console.log(JSON.stringify(events));
		},

		readyToSend: function() {
			console.log("timer: " + time.getTimer());
			if (time.getTimer() > SEND_INTERVAL) {
				time.resetTimer();
				return true;
			}
			return false;
		},

		getAll: function() {
			return events;
		},
	};

});