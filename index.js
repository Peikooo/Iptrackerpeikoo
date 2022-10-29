const xhReq = new XMLHttpRequest();
xhReq.open("GET", "https://geo.ipify.org/api/v2/country,city?apiKey=at_YlAN2PKgFlXKsgym888A30ZUtxEHK", false);
xhReq.send(null);
let data = JSON.parse(xhReq.responseText);

const personalPosition = [data.location.lat, data.location.lng]
const image = "images/icon-location.svg"
let map;
let marker;
function initMap(lat, lng) {
   map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: personalPosition[0], lng: personalPosition[1]},
      zoom: 16,
      disableDefaultUI: true,
      mapTypeControl: false,
      zoomControl: true,
      streetViewControl: false,
      rotateControl: true,
   });
   marker = new google.maps.Marker({
      position: { lat: personalPosition[0], lng: personalPosition[1] },
      icon: image,
      map,
      title: "",
   });
}

window.initMap = initMap;

const inputIp = document.querySelector(".ipinput")
const searchButton = document.querySelector(".submit")
const ip = document.querySelector(".ip")
const region = document.querySelector(".region")
const time = document.querySelector(".time")
const isp = document.querySelector(".isp")
let ipValue = false

function changeCenter(lat, lng) {
   map.setCenter({lat: lat, lng: lng});
   marker.setPosition({lat: lat, lng: lng}); 
}

function verifyPostalCode(postalCode) {
   if (postalCode == undefined) {
      return ""
   } else {
      return " " + postalCode
   }
}

function searchIp(ipSearched) {
   ip.innerHTML = ipSearched
   fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_YlAN2PKgFlXKsgym888A30ZUtxEHK&ipAddress=${ipSearched}`)
      .then((response) => response.json())
      .then((dataIp) => {
         region.innerHTML = dataIp.location.region + ", " + dataIp.location.country + verifyPostalCode(dataIp.location.postalCode)
         time.innerHTML = "UTC " + dataIp.location.timezone
         isp.innerHTML = dataIp.isp
         changeCenter(dataIp.location.lat, dataIp.location.lng)
      })

}

function ValidateIPaddress(ipaddress) {  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress) && ipaddress != "") {  
    return (true)  
  } else {
     return (false)
  }
}

ip.innerHTML = data.ip;
region.innerHTML = data.location.region + ", " + data.location.country + verifyPostalCode(data.location.postalCode);
time.innerHTML = "UTC " + data.location.timezone;
isp.innerHTML = data.isp

inputIp.addEventListener("change", (e) => {
   if (ValidateIPaddress(inputIp.value) == true) {
      ipValue = true
      inputIp.style.outline = "none"
   } else {
      ipValue = false
      inputIp.style.outline = "2px solid salmon"
   }
})

searchButton.addEventListener("click", () => {
   if (ipValue == true) {
      console.log(searchIp(inputIp.value))
   }
})