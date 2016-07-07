define("time",[],function(){function e(){var e;try{e=tizen.time.getCurrentDateTime()}catch(t){console.error("Error: ",t.message)}return e}function t(e){return 10>e&&(e="0"+e),e}var n,o,i,r,l,a,c;return{create:function(){n=e(),o=n.getFullYear(),i=t(n.getDate()),r=t(n.getMonth()+1),l=t(n.getHours()),a=t(n.getMinutes()),c=t(n.getSeconds())},getTimestamp:function(){return o+"-"+r+"-"+i+"T"+l+":"+a+":"+c},getDay:function(){return i},getHours:function(){return l},getMinutes:function(){return a}}}),define("events",["time"],function(e){var t="https://zeeguu.unibe.ch/upload_smartwatch_events",n=[],o=0;return{add:function(t,i){e.create(),n[o++]={bookmark_id:i,time:e.getTimestamp(),event:t}},save:function(){if(null!==localStorage.getItem("events")){var e=JSON.parse(localStorage.getItem("events"));console.log("currently in local storage: "+JSON.stringify(e)),console.log("saving..."),localStorage.setItem("events",JSON.stringify(e.concat(n)));var t=JSON.parse(localStorage.getItem("events"));console.log("events saved: "+JSON.stringify(t))}else console.log("currently no events in storage"),console.log("saving..."),localStorage.setItem("events",JSON.stringify(n)),console.log("events saved: "+JSON.stringify(n))},load:function(){null!==localStorage.getItem("events")&&(n=JSON.parse(localStorage.getItem("events")),console.log("loaded events: "+JSON.stringify(n)))},send:function(e){var n=new FormData,o=JSON.parse(localStorage.getItem("events"));console.log("trying to send these events:"+JSON.stringify(o)),n.append("events",JSON.stringify(o));var i=new XMLHttpRequest;i.open("POST",t+"?session="+e,!0),i.onload=function(){console.log("events uploaded to db: "+this.responseText),"OK"===this.responseText&&(console.log("removing events localStorage.."),localStorage.removeItem("events"),console.log("events in storage: "+localStorage.getItem("events")))},i.send(n)},print:function(){console.log(JSON.stringify(n))},clear:function(){n=[],o=0}}}),define("userData",["events"],function(e){function t(){for(var e="words: ",t=0;t<o.length;t++)e+=o[t].word+", ";console.log(e)}var n=5,o=[],i=0,r=!1,l=5;return{setWordPair:function(e,t,n,i){o[e]={word:t,translation:n,id:i,timesCorrect:0}},getWordPair:function(e){return o[e]},areThereWords:function(){return o.length>0?!0:!1},flashCardMethod:function(e){e?(console.log("word is correct"),o[0].timesCorrect++,o.splice(o[0].timesCorrect*l,0,o[0]),console.log("new position for word "+o[0].word+" = "+o[0].timesCorrect*l),o.splice(0,1),t()):(console.log("word is wrong"),o[0].timesCorrect=0,o.splice(l,0,o[0]),console.log("new position for word "+o[0].word+" = "+o[0].timesCorrect),o.splice(0,1),t())},getWord:function(){return r?o[0].translation:o[0].word},removeWord:function(){return o.length>10?(o.splice(0,1),!0):!1},getTranslation:function(){return r?o[0].word:o[0].translation},load:function(){console.log("loading userdata.."),0===localStorage.length?console.log("No user data available."):(i=localStorage.getItem("accountCode"),console.log("loaded accountCode: "+i),e.load(),null!==localStorage.getItem("wordPair")&&(o=JSON.parse(localStorage.getItem("wordPair")),console.log("loaded wordpairs: "+JSON.stringify(o))))},saveCode:function(e){i=e,localStorage.setItem("accountCode",i),console.log("accountCode saved: "+localStorage.getItem("accountCode"))},saveWordPair:function(){localStorage.setItem("wordPair",JSON.stringify(o)),console.log(localStorage.getItem("wordPair"))},saveEvents:function(){e.print(),e.save(),e.clear()},sendEvents:function(){try{e.send(i)}catch(t){console.log("Error during sending: "+t)}},addEvent:function(t){e.add(t,o[0].id)},getCode:function(){return i},setCode:function(e){i=e},printWords:function(){console.log(JSON.stringify(o))},nextWord:function(){n++,n===numberOfWords&&(n=0)},getReverseStatus:function(){return r},setReverseStatus:function(e){r=e},printEvents:function(){e.print()},clear:function(){localStorage.clear()}}}),define("login",["userData"],function(e){function t(){var e,t;e=document.getElementById("loginPage"),t=document.getElementById("mainPage"),e.style.display="none",t.style.display="block"}function n(e,t){f=document.getElementById("digitSpace"),m=f.getContext("2d"),m.clearRect(k+O*(e-1),0,O,b),m.font="80px Arial",m.fillStyle="black",m.textAlign="center",m.fillText(t,C+O*(e-1),P)}function o(e,t,o){return t?(o++,o>9&&(o=0)):(o--,0>o&&(o=9)),n(e,o),o}function i(e){f=document.getElementById("loginPopup"),f.style.visibility="visible",f=document.getElementById("loginPopupSpace"),m=f.getContext("2d"),m.clearRect(0,0,h,I),m.font="30px Arial",m.fillStyle="white",m.textAlign="center","NO_CONNECTION"===e?(m.fillText("NO CONNECTION",w,N),m.fillText("There isn't a connection",w,_),m.fillText("with the internet",w,L),m.fillText("please check",w,R),m.fillText("your internet connection",w,W)):"WRONG_SESSION_NUMBER"===e?(m.fillText("WRONG PASSWORD",w,N),m.fillText("this password is not",w,_),m.fillText("recognized in our database",w,L),m.fillText("please check your account",w,R),m.fillText("at Zeeguu",w,W)):(m.fillText("TOO FEW WORDS",w,N),m.fillText("more words needed",w,_),m.fillText("please make sure you have",w,L),m.fillText("at least 10 words",w,R)),m.font="15px Arial",m.fillStyle="white",m.textAlign="center",m.fillText("please press the screen to try again",w,A),c(1),document.getElementById("loginPopup").addEventListener("click",function(){var e=document.getElementById("loginPopup");e.style.visibility="hidden"})}function r(){f=document.getElementById("log_headerSpace"),m=f.getContext("2d"),m.clearRect(0,0,h,T),m.font="15px Arial",m.fillStyle="white",m.textAlign="center",m.fillText("Please fill in your 8 digit code",w,x)}function l(e){f=document.getElementById("pageIconSpace"),m=f.getContext("2d"),m.clearRect(0,0,h,B),1===e?(m.beginPath(),m.arc(170,7,7,0,2*Math.PI),m.fillStyle="#FFFFFF",m.fill(),m.beginPath(),m.arc(190,7,7,0,2*Math.PI),m.fillStyle="#C3C3C3",m.fill()):(m.beginPath(),m.arc(170,7,7,0,2*Math.PI),m.fillStyle="#C3C3C3",m.fill(),m.beginPath(),m.arc(190,7,7,0,2*Math.PI),m.fillStyle="#FFFFFF",m.fill())}function a(e){r(),l(e),n(1,0),n(2,0),n(3,0),n(4,0)}function c(e){v=0,y=0,E=0,p=0,1===e&&(S=0),a(e)}function s(e){v=o(1,e,v)}function d(e){y=o(2,e,y)}function u(e){E=o(3,e,E)}function g(e){p=o(4,e,p)}var f,m,v=0,y=0,E=0,p=0,S=0,h=360,I=360,w=180,T=70,x=62,B=15,O=76,b=105,k=40,C=65,P=80,N=120,_=155,L=185,R=215,W=245,A=280;return function(n){null!==localStorage.getItem("accountCode")?(e.load(),t(),n(e.getCode())):(f=document.getElementById("digitSpace"),m=f.getContext("2d"),a(1),document.getElementById("first_plus").addEventListener("click",function(){s(!0)}),document.getElementById("first_min").addEventListener("click",function(){s(!1)}),document.getElementById("second_plus").addEventListener("click",function(){d(!0)}),document.getElementById("second_min").addEventListener("click",function(){d(!1)}),document.getElementById("third_plus").addEventListener("click",function(){u(!0)}),document.getElementById("third_min").addEventListener("click",function(){u(!1)}),document.getElementById("fourth_plus").addEventListener("click",function(){g(!0)}),document.getElementById("fourth_min").addEventListener("click",function(){g(!1)}),document.getElementById("setNextButton").addEventListener("click",function(){if(0===S)S=v.toString()+y.toString()+E.toString()+p.toString(),c(2);else{S=S+v.toString()+y.toString()+E.toString()+p.toString();var o=n(S);"SUCCESS"===o?(e.saveCode(S),t()):i(o)}}))}}),define("session",["userData","login"],function(e,t){function n(t){var n;console.log("Trying to get words with session: "+t);try{var g=new XMLHttpRequest;g.open("GET",d+u+r+"?session="+t,!1),g.onload=function(){try{var t=JSON.parse(this.responseText),r=0;if(Object.keys(t).length<10)i="TOO_FEW_WORDS";else{for(n=0;n<Object.keys(t).length;n++)o.font=c,o.measureText(String(t[n].from)).width<=l&&o.measureText(String(t[n].to)).width<=l&&(o.font=s,o.measureText(String(t[n].from)).width<=a&&o.measureText(String(t[n].to)).width<=a&&(e.setWordPair(r,t[n].from,t[n].to,t[n].id),r++));console.log("number of words loaded: "+r),e.saveWordPair(),i="SUCCESS"}}catch(d){console.log("wrong session number: "+d),i="WRONG_SESSION_NUMBER"}},g.send()}catch(f){console.log("no internet connection: "+f),i="NO_CONNECTION"}}var o,i,r=50,l=340,a=280,c="45px Arial",s="35px Arial",d="https://zeeguu.unibe.ch/",u="bookmarks_to_study/";return{create:function(t,r){o=t,e.areThereWords()?(i="SUCCESS",console.log("Using words which were already saved.")):n(r)},printWords:function(){e.printWords()},getStatus:function(){return i}}}),define("battery",[],function(){function e(e,t,n,o){var i=(o-90)*Math.PI/180;return{x:e+n*Math.cos(i),y:t+n*Math.sin(i)}}function t(t,n,o,i,r){var l=e(t,n,o,r),a=e(t,n,o,i),c=180>=r-i?"0":"1",s=["M",l.x,l.y,"A",o,o,0,c,0,a.x,a.y].join(" ");return s}var n="green",o="red";return{draw:function(){var e=navigator.battery||navigator.webkitBattery||navigator.mozBattery;e.onchargingchange=function(){e.charging?console.log("battery is charging"):console.log("battery is not charging")},e.onlevelchange=function(){console.log(Math.floor(100*e.level)),document.getElementById("battery").setAttribute("d",t(180,180,180,270,270+180*e.level)),e.level>.15?document.getElementById("battery").setAttribute("stroke",n):document.getElementById("battery").setAttribute("stroke",o)}}}}),define("weather",[],function(){function e(e,t){console.log(e),console.log(t);try{var n=new XMLHttpRequest;n.open("GET","http://api.openweathermap.org/data/2.5/weather?lat="+e+"&lon="+t+"&APPID="+i,!1),n.onload=function(){console.log("getting weather data.."),console.log(this.responseText),o=JSON.parse(this.responseText),console.log("sunset: "+o.sys.sunset),console.log(JSON.stringify(o))},n.send()}catch(l){r=!1,console.log("Error getWeather: "+l)}}function t(){var t=new XMLHttpRequest;try{t.open("GET","http://ip-api.com/json",!1),t.onload=function(){console.log("getting location.."),console.log(this.responseText);var t=JSON.parse(this.responseText);e(t.lat,t.lon),console.log(JSON.stringify(t))},t.send()}catch(n){r=!1,console.log("Error getLocation: "+n)}}function n(e){var t=new Date(1e3*e);return 60*t.getUTCHours()+t.getUTCMinutes()-t.getTimezoneOffset()}var o,i="ab2771b4d49ab0798786dd6f2bee71a0",r=!1;return{refresh:function(){r=!0,t(),null===o&&(o=localStorage.getItem("weather"))},save:function(){localStorage.setItem("weather",o)},getSunset:function(){return n(o.sys.sunset)},getSunrise:function(){return n(o.sys.sunrise)},getImageSource:function(){return"http://openweathermap.org/img/w/"+o.weather[0].icon+".png"},getTemperature:function(){return(o.main.temp-273.15).toFixed(0)},setIsRefreshed:function(e){r=e},getIsRefreshed:function(){return r}}}),define("gui",["battery","userData","time","weather"],function(e,t,n,o){function i(e){x=o.getSunrise(),B=o.getSunset(),e>=x&&B>=e?(O=(180/(B-x)).toFixed(2),O=90+(e-x)*O,b="rotate("+O+"deg)",document.getElementById("timeBackground").style.transform=b):(O=(180/(x+(Q-B))).toFixed(2),O=e>B?270+(e-B)*O:270+(e+(Q-B))*O,b="rotate("+O+"deg)",document.getElementById("timeBackground").style.transform=b)}function r(){w.clearRect(0,0,H,X),w.font="30px Arial",w.fillStyle=L,w.textAlign=_,w.fillText(n.getDay(),G,j)}function l(e,t,n,o){I.font=o+k,I.fillStyle=L,I.textAlign=_,I.fillText(e,t,n)}function a(){T.clearRect(0,0,W,F),T.font=C+k,T.fillStyle=L,T.textAlign=_,T.fillText(n.getHours()+":"+n.getMinutes(),W/2,J)}function c(e,t){var n=.1;e.style.display="block";var o=setInterval(function(){n>=.8&&clearInterval(o),e.style.opacity=n,e.style.filter="alpha(opacity="+100*n+")",n+=.1*n},t)}function s(e,t){var n=.8,o=setInterval(function(){.1>=n&&(clearInterval(o),e.style.visibility="hidden"),e.style.opacity=n,e.style.filter="alpha(opacity="+100*n+")",n-=.1*n},t)}function d(e){var t=document.getElementById("imageFade");t.style.visibility="visible",t.style.opacity=1;var n=t.getContext("2d"),o=new Image;o.onload=function(){n.drawImage(o,0,0,W,M)},o.src=e,setTimeout(function(){s(t,Y)},Z)}function u(){document.getElementById("wordSpace").style.backgroundImage="url('assets/background.png')",I.clearRect(0,0,W,D),l(t.getWord(),W/2,U,P);var e=document.getElementById("revealedPage");e.style.visibility="hidden"}function g(){I.clearRect(0,0,W,D),l(t.getWord(),W/2,U,P),l(t.getTranslation(),W/2,z,N),document.getElementById("wordSpace").style.backgroundImage="url('assets/revealed_clicked_background.png')";var e=document.getElementById("revealedPage");e.style.visibility="visible"}function f(){var e=document.getElementById("settingsPage");e.style.visibility="visible",c(e,5)}function m(){var e=document.getElementById("menuPage");e.style.visibility="visible",c(e,5)}function v(e){null===$?$=setTimeout(function(){$=null,e()},300):(clearTimeout($),$=null,f())}function y(){o.setIsRefreshed(!1);var e=document.getElementById("weatherSpace"),t=e.getContext("2d"),n=new Image;n.onload=function(){t.drawImage(n,0,0)},n.src=o.getImageSource()}function E(){var e=document.getElementById("temperatureSpace"),t=e.getContext("2d");t.clearRect(0,0,q,q),t.font=R,t.fillStyle=L,t.textAlign=_,t.fillText(o.getTemperature()+"°C",K,K)}function p(){t.addEvent("right"),t.saveEvents(),t.sendEvents();var e="assets/right_icon.png";t.flashCardMethod(!0),d(e),u()}function S(){t.addEvent("wrong"),t.saveEvents(),t.sendEvents();var e="assets/wrong_icon.png";t.flashCardMethod(!1),d(e),u()}function h(e){if(t.removeWord())d(e),t.saveCurrentState(),t.saveEvents(),t.saveWordPair(),t.sendEvents(),u();else{console.log("show popup");var n=document.getElementById("imageFade");n.style.visibility="visible",n.style.opacity=.8;var o=n.getContext("2d");o.clearRect(0,0,W,A/2),o.font="20px Arial",o.fillStyle="white",o.textAlign="center",o.fillText("TOO FEW WORDS",W/2,POPUP_TEXT_LINE1),o.fillText("there are too",W/2,POPUP_TEXT_LINE2),o.fillText("few words left to",W/2,POPUP_TEXT_LINE3),o.fillText("use this option",W/2,POPUP_TEXT_LINE4),setTimeout(function(){s(n,Y)},WAITING_TIME_FOR_POPUP_TO_DISAPPEAR)}}var I,w,T,x,B,O,b,k="px Arial",C=120,P=45,N=35,_="center",L="white",R="17px Arial",W=360,A=360,M=120,F=180,J=160,D=120,U=45,z=95,H=100,X=90,G=72,j=63,q=50,K=25,Y=20,Z=100,Q=1440,V="360px 180px",$=null,ee=0,te=["url('assets/countryside_background.png')","url('assets/city_background.png')","url('assets/simple_background.png')"];return{draw:function(){n.create();var t=60*n.getHours()+1*n.getMinutes();a(),r(),i(t),e.draw(),o.getIsRefreshed()&&y(),E()},create:function(e){I=e;var n=document.getElementById("digitalTime");T=n.getContext("2d");var i=document.getElementById("iconSpace");w=i.getContext("2d"),o.refresh(!0),o.save(),u(),document.getElementById("wordSpace").addEventListener("click",function(){t.addEvent("reveal"),v(g),t.saveEvents()}),document.getElementById("revealButton").addEventListener("click",function(){t.addEvent("reveal"),g(),t.saveEvents()}),document.getElementById("wrongSpace").addEventListener("click",function(){S()}),document.getElementById("wrongButton").addEventListener("click",function(){S()}),document.getElementById("menuSpace").addEventListener("click",function(){v(m)}),document.getElementById("menuButton").addEventListener("click",function(){m()}),document.getElementById("rightSpace").addEventListener("click",function(){p()}),document.getElementById("rightButton").addEventListener("click",function(){p()}),document.getElementById("menuLargeSpace").addEventListener("click",function(){var e=document.getElementById("menuPage");s(e,5)}),document.getElementById("wrongTranslationButton").addEventListener("click",function(){t.addEvent("wrongTranslation"),h("assets/trash_icon.png")}),document.getElementById("learnedButton").addEventListener("click",function(){t.addEvent("learnedIt"),h("assets/right_icon.png")}),document.getElementById("backButtonInMenu").addEventListener("click",function(){var e=document.getElementById("menuPage");s(e,5)}),document.getElementById("settingsSpace").addEventListener("click",function(){var e=document.getElementById("settingsPage");s(e,5)}),document.getElementById("reverseButton").addEventListener("click",function(){t.addEvent("reverse"),t.setReverseStatus(!t.getReverseStatus()),u()}),document.getElementById("time").addEventListener("click",function(){var e=document.getElementById("landscapeBackground");e.style.background=te[ee],e.style.backgroundSize=V,ee===te.length-1?ee=0:ee++}),document.getElementById("logOutButton").addEventListener("click",function(){t.clear(),document.location.reload(!0)}),document.getElementById("backButtonInSettings").addEventListener("click",function(){var e=document.getElementById("settingsPage");s(e,5)})}}}),define("device",["userData","weather"],function(e,t){function n(){try{tizen.power.setScreenStateChangeListener(function(n,o){"SCREEN_NORMAL"===o&&"SCREEN_OFF"===n?(console.log("We just woke up"),e.addEvent("screenOn"),t.refresh(!0)):(console.log("The display has been switched off"),e.addEvent("screenOff")),e.saveEvents()})}catch(n){}}function o(){document.addEventListener("tizenhwkey",function(e){if("back"===e.keyName)try{tizen.application.getCurrentApplication().exit()}catch(t){}})}return{create:function(){o()},listen:function(){n()}}}),require(["login","session","gui","device"],function(e,t,n,o){function i(){n.draw(),o.listen(),setTimeout(i,1e3)}function r(e){t.create(a,e),t.printWords();var r=t.getStatus();return"SUCCESS"!==r?r:(n.create(a),o.create(),i(),r)}var l=document.getElementById("wordSpace"),a=l.getContext("2d");new e(r)}),define("main",function(){});