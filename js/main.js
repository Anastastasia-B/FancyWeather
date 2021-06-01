const time = document.getElementById('time');
const date = document.getElementById('date');
const body = document.querySelector('body');
const temperature = document.getElementById('temperature');
const feelslike = document.getElementById('feelslike');
const windspeed = document.getElementById('windspeed');
const humidity = document.getElementById('humidity');
const firstDay = document.getElementById('firstDay');
const secondDay = document.getElementById('secondDay');
const thirdDay = document.getElementById('thirdDay');
const firstDayTmp = document.getElementById('firstDayTmp');
const secondDayTmp = document.getElementById('secondDayTmp');
const thirdDayTmp = document.getElementById('thirdDayTmp');
const btn = document.getElementById('repeatBtn');
const locationdiv = document.getElementById('locationdiv');
const fahrenheitbtn = document.getElementById('fahrenheit');
const celsiusbtn = document.getElementById('celsius');
const latitude = document.getElementById('latitude');
const longtitude = document.getElementById('longtitude');
const forecastEl = document.getElementsByClassName("forecast"); 
const weatherIcon = document.getElementById('weathericon');
const firstDayIcon = document.getElementById('firstDayIcon');
const secondDayIcon = document.getElementById('secondDayIcon');
const thirdDayIcon = document.getElementById('thirdDayIcon');
const ru = document.getElementById('ru');
const en = document.getElementById('en');
const weathertype=document.getElementById('weathertype');
const search=document.getElementById('search');
const cityInput=document.getElementById('city');
var weekdayShort=new Array(7);
var weekdayFullName=new Array(7);
var months=new Array(12);
let today=new Date();
let count=0;
let langIndex = 0;
let mydata = null;

async function loadLocalization(){
  mydata = JSON.parse(localizationData);
}

function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function disableBtn(){
  if (localStorage.getItem('lang') === 'en') {
    en.disabled=true;
  }else{
    ru.disabled=true;
  }
}
function getTimeOfTheYear(){
  let today = new Date();
  let month=today.getMonth();
  if(month==12||month==1||month==2){
    return "winter";
  }
  if(month>=3&&month<=5){
    return "spring";
  }
  if(month>=6&&month<=8){
    return "summer";
  }
  if(month>=9&&month<=11){
    return "autumn";
  }
  setTimeout(getTimeOfTheYear, 1000);
}
function getOffset(sec){
  var x = new Date();
  var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
  currentTimeZoneOffsetInHours=-currentTimeZoneOffsetInHours;
    //console.log(currentTimeZoneOffsetInHours);
    //console.log(sec/3600)

    console.log(-(currentTimeZoneOffsetInHours-sec/3600));
    return (-(currentTimeZoneOffsetInHours-sec/3600));
  }
  function getTimeOfDay(){
    let today = new Date();
    hour = today.getHours();
    if(hour>=6&&hour<12){
      return "morning";
    }else
    if(hour>=12&&hour<18){
      return "day";
    }else
    if(hour>=18&&hour<=23){
      return "evening";
    }else
    return "night";
  }
  let offset=0;
  let flag10=false;

  function showTime() {
    let today = new Date();
//  console.log(today);
hour = today.getHours();
today.setHours(hour+offset);
  // console.log(today);
  hour = today.getHours();
  min = today.getMinutes();
  time.innerHTML = `${hour}<span>:</span>${addZero(min)} `;
  let localeStr = 'en'; 
  if(getLangFromLS() == 'ru'){
    localeStr = 'ru';
  }

  date.innerHTML = `${today.toLocaleDateString(localeStr, { weekday: 'short', month: 'long', day: 'numeric' })}`;

  today.setDate(today.getDate() + 1);
  firstDay.textContent = `${today.toLocaleDateString(localeStr, { weekday: 'long' })}`;
  today.setDate(today.getDate() + 1);
  secondDay.textContent = `${today.toLocaleDateString(localeStr, { weekday: 'long' })}`;
  today.setDate(today.getDate() + 1);
  thirdDay.textContent = `${today.toLocaleDateString(localeStr, { weekday: 'long' })}`;
  if(flag10==true){
    flag10=false;
    return;
  }
  setTimeout(showTime, 1000);
}

function viewBgImage(src) {  
  const img = new Image();
  img.src = src;
  img.onload = () => {      
    body.style.backgroundImage = `url(${src})`;
  }; 
}
function LoadWeatherIcon(body,src) {  
  const img = new Image();
  img.src = src;
  img.className = 'weather_icon';
  img.onload = () => {   
    if(body.childElementCount > 0){
      body.replaceChild(img, body.firstChild); 
    }
    else{
      body.appendChild(img); 
    }
    
  }; 
}
var tmpType="metric";
async function getBackgroundImage() {
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${getTimeOfDay()} nature in ${getTimeOfTheYear()}&client_id=B4AQqeSpn7A6UfttM877HDIaMQ2cSlkunF8wZGeD3zk`;
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();
  viewBgImage(data.urls.regular);
  btn.disabled = true;
  setTimeout(function() { btn.disabled = false }, 1000);
}
let flag=false;

function fetchForecast (typeTmp,lat,lon) {
 var url =
 `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely,alerts&units=${typeTmp}&appid=08f2a575dda978b9c539199e54df03b0`;
 fetch(url)
 .then(function (response) {
  if (200 !== response.status) {
    console.log(
      "Looks like there was a problem. Status Code: " + response.status
      );
    return;
  }
  forecastEl[0].classList.add('loaded');
  response.json().then(function (data) {
    data.daily.forEach((value, index) => {
      if (index > 0 && index <=3) {   
        var icon = value.weather[0].icon;
        var temp = value.temp.day.toFixed(0);
        if(index==1){
          if(flag==false){
            LoadWeatherIcon(firstDayIcon,`https://openweathermap.org/img/wn/${icon}.png`);
          }
          firstDayTmp.textContent=temp + "°";
        }
        else if(index==2){
          if(flag==false){
            LoadWeatherIcon(secondDayIcon,`https://openweathermap.org/img/wn/${icon}.png`);
          }
          secondDayTmp.textContent=temp+ "°";
        }
        else if(index==3){
          if(flag==false){
            LoadWeatherIcon(thirdDayIcon,`https://openweathermap.org/img/wn/${icon}.png`);
            flag=true;
          }
          thirdDayTmp.textContent=temp+ "°";
        }
      }
    }

    )
    latitude.textContent=mydata.lat[langIndex] + ": "+Math.floor(lat) + "°"+Math.floor(("0."+FindingDecimalPart(lat))*60)+"'";
    longtitude.textContent=mydata.long[langIndex] + ": "+Math.floor(lon) + "°"+Math.floor(("0."+FindingDecimalPart(lon))*60)+"'";
  });
})
 .catch(function (err) {
  console.log("Fetch Error :-S", err);
});
};


function chooseTmpType(){
  if (localStorage.getItem('tmp') == '°C') {
    celsiusbtn.disabled=true;
    fahrenheitbtn.disabled=false;
  }else{
    fahrenheitbtn.disabled=true;
    celsiusbtn.disabled=false;
  }
}
function getLangFromLS() {
  if (localStorage.getItem('lang') === null) {
    return ("en");
  } else {
    return(localStorage.getItem('lang'));
  }
}
function getTypeTmpFromLS() {
  if (localStorage.getItem('tmp') === null) {
    localStorage.setItem('tmp','°C');
    return ('°C');
  } else {
    return(localStorage.getItem('tmp'));
  }
}

function getCityFromLS() {
  return(localStorage.getItem('city'));
}
function setLang(){
  if(localStorage.getItem('lang')==='en'){
    langIndex = 0;
  }
  else {
    langIndex = 1;
  }
  refreshLang();

}
function getTmpType(){
  if(getTypeTmpFromLS()=='°C'){
    return "metric";
  }else{
    return "imperial";
  }
}
let flag4=false;
let flag5=false;
let flag6=false;
async function getWeather(typeTmp,language,city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${language}&appid=08f2a575dda978b9c539199e54df03b0&units=${typeTmp}`;
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();  
    // console.log(city);
    if(flag5==true){
      localStorage.setItem('lng',data.coord.lon);
      localStorage.setItem('lat',data.coord.lat);
      console.log(data.coord.lat+','+data.coord.lon);
      getString(data.coord.lat+','+data.coord.lon);
      offset=getOffset(data.timezone);
      showTime();
      flag10=true;
      flag6=true;
    }
    localStorage.setItem('city',data.name);
    flag5=false;
    LoadWeatherIcon(weatherIcon,`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    // console.log(Math.round(data.main.temp));
    let maintmpRound=Math.round(data.main.temp);
    weathertype.textContent=data.weather[0].description;
    temperature.textContent = `${maintmpRound}°`;
    let feelsliketmpRound=Math.round(data.main.feels_like);
    feelslike.textContent=mydata.feelslike[langIndex] + ": " + feelsliketmpRound + "°";
      if(flag4==false){
        humidity.textContent=mydata.humidity[langIndex] + ": "+data.main.humidity + "%";
        flag4=true;
      }
  }
  async function getCoord() {
    try {
      let city = cityInput.value;
      let typeTmp=getTmpType();
      flag4=false;
      flag5=true;
      flagfirst=true;
      someflag=false;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=${typeTmp}`;
      console.log(url);

      const res = await fetch(url);
      const data = await res.json();
      localStorage.setItem('city',city);
      fetchForecast(typeTmp,String(data.coord.lat),String(data.coord.lon)) ;
      getWeather(typeTmp,getLangFromLS(),city);
    }catch(error){
    alert("City not found");
  }
  
}
function getCord(event) {
  if (event.code === 'Enter') {
    getCoord();
  }
}
async function getWindSpeed() {

  try{
    let city=getCityFromLS();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    windspeed.textContent = mydata.wind[langIndex] + ": " + data.wind.speed+' m/s';
  }catch(error){
    getGeolocation();
    getWindSpeed();
  }
}
function getMap(lat,lng){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmFuZ3VzIiwiYSI6ImNrcDN6cWUycTFmY2gycG13YXV4aGY0eHEifQ.a3Eu2Aj9YHQUeSlYJn2Xiw';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: [lng, lat], 
    zoom: 10.2
});
}

function refreshLang(){
  en.textContent= mydata.en[langIndex];
  ru.textContent= mydata.ru[langIndex];
  getWindSpeed();
  search.innerHTML = mydata.search[langIndex];
  console.log(langIndex);
  let langStr = langIndex == 0 ? "en" : "ru";
  if(flagfirst==false){
      getGeolocation();
    }
    else{
     getGeocoding(localStorage.getItem('lat'),localStorage.getItem('lng'), langStr);
   }

  latitude.textContent=mydata.lat[langIndex] + latitude.innerHTML.substring(latitude.innerHTML.indexOf(':'));
  longtitude.textContent=mydata.long[langIndex] + longtitude.innerHTML.substring(longtitude.innerHTML.indexOf(':'));

}


let someflag=false;
function changeLangToRus(){
  langIndex = 1;
  flag4=false;
  localStorage.setItem('lang', 'ru');
  refreshLang();
    en.disabled=false;
    ru.disabled=true;
    someflag=true;
  }
  function changeLangToEn(){
    flag4=false;
    langIndex = 0;
    localStorage.setItem('lang', 'en');
    refreshLang();
    ru.disabled=false;
    en.disabled=true;
    someflag=true;
  }

  function FindingDecimalPart(number){
   let ind=0;
   for(let i=number.length;i>0;i--){
    if(number[i]=='.'){
      break;
    }
    ind++;
  }
  return number.substr(number.length-ind+1,ind-1);
}
let flagfirst=false;
async function getGeolocation(){
  const url = `https://ipinfo.io/json?token=7d009b2919571b`;
  const res = await fetch(url);
  const data = await res.json();
  flagfirst=true;
  getString(data.loc);
}
function getString(coordinates){
  let ind=0;
  for(let i=coordinates.length;i>0;i--){
    if(coordinates[i]==','){
      break;
    }
    ind++;
  }
  let lat=coordinates.substr(0,coordinates.length-ind);
  let lng=coordinates.substr(coordinates.length-ind+1,ind-1);
  localStorage.setItem('lat',lat);
  localStorage.setItem('lng',lng);
  getGeocoding(lat,lng,getLangFromLS());
  if(flag5==false){
    fetchForecast(getTmpType(),lat,lng);
  }
  flag5=false;
}

function changeTmptoFarenheit(){
  flag4=true;
  getWeather("imperial",getLangFromLS(),getCityFromLS());
  fahrenheitbtn.disabled=true;
  celsiusbtn.disabled=false;
  tmpType="imperial";
  localStorage.setItem('tmp','°F');
  fetchForecast(tmpType,localStorage.getItem('lat'),localStorage.getItem('lng'));

} 

function changeTmptoCelsius(){
  flag4=true;
  getWeather("metric",getLangFromLS(),getCityFromLS());
  celsiusbtn.disabled=true;
  fahrenheitbtn.disabled=false;
  tmpType="metric";
  localStorage.setItem('tmp','°C');
  fetchForecast(tmpType,localStorage.getItem('lat'),localStorage.getItem('lng'));
} 

  async function getGeocoding(LAT,LNG,lang){
    let url;
    if(lang=='en'&&flagfirst==true){
      url = `https://api.opencagedata.com/geocode/v1/json?q=${LAT}+${LNG}&language=en&key=227664912047431695d3084442071b8a&pretty=1&no_annotations=1`;
    }else{
      url = `https://api.opencagedata.com/geocode/v1/json?q=${LAT}+${LNG}&key=227664912047431695d3084442071b8a&pretty=1&no_annotations=1`;
    }
   //const url = `https://api.opencagedata.com/geocode/v1/json?q=Minsk&key=227664912047431695d3084442071b8a&pretty=1&no_annotations=1`;
   const res = await fetch(url);
   const data = await res.json();
    // getMap(data.results.geometry.lat,data.results.geometry.lng);
    // console.log(data.results.bounds);
    if(data.results[0].components.city!=undefined){
        locationdiv.textContent=data.results[0].components.city + ", " + data.results[0].components.country;
        localStorage.setItem('city',data.results[0].components.city);
      }else if (data.results[0].components.village!=undefined){
        locationdiv.textContent=data.results[0].components.village + ", " + data.results[0].components.country;
        localStorage.setItem('city',data.results[0].components.village);
      }else if (data.results[0].components.town!=undefined){
        locationdiv.textContent=data.results[0].components.town + ", " + data.results[0].components.country;
        localStorage.setItem('city',data.results[0].components.town);
      }else if (data.results[0].components.hamlet!=undefined){
        locationdiv.textContent=data.results[0].components.hamlet + ", " + data.results[0].components.country;
        localStorage.setItem('city',data.results[0].components.hamlet);
      }
    if(getTmpType()=="metric"){
      getWeather("metric",getLangFromLS(),getCityFromLS());
    }else{
      getWeather("imperial",getLangFromLS(),getCityFromLS());
    }
    if(someflag==false){
      getMap(LAT,LNG);
    }
  }

  loadLocalization();
  setLang();
  getBackgroundImage();
  showTime();
  getWindSpeed();
  disableBtn();
  getTypeTmpFromLS();
  
  chooseTmpType();

  document.addEventListener('DOMContentLoaded', getGeolocation);
  btn.addEventListener('click', getBackgroundImage);
  fahrenheitbtn.addEventListener('click', changeTmptoFarenheit);
  celsiusbtn.addEventListener('click', changeTmptoCelsius);

  ru.addEventListener('click', changeLangToRus);
  en.addEventListener('click', changeLangToEn);
  search.addEventListener('click', getCoord);
  document.addEventListener('keypress', getCord);