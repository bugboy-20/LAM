<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import {getCoordinates} from '@/utils/geolocation';
import {sendRequestWithToken} from '@/utils/requests';
//https://www.npmjs.com/package/leaflet.markercluster
const map = ref<any | null>(null);
const markers = ref<any[]>([]);

const icon = L.icon({
  iconUrl: '@/public/pin.jpg',
  iconSize: [64,64],
  iconAnchor: [32,64],
  popupAnchor: [0,-64]
});

onMounted(async () => {
  // Initialize the map
  getCoordinates().then((coords) => {
    if(map && map.value) {
      map.value.setView([coords.latitude, coords.longitude], 17);
    }
  });
  map.value = L.map('map').setView([44.5, 11.3], 10); // Default to Bologna

  // Add OpenStreetMap tiles
  L.tileLayer("/leaflet/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value);

  await getAllAudiosPin();
   /*
  // Add a marker
  const marker = L.marker([37.7749, -122.4194]).addTo(map.value);
  marker.bindPopup('<b>Hello!</b><br>This is a pin.').openPopup();
  // Handle marker click
  marker.on('click', () => {
    alert('Marker clicked!');
  });
  getAllAudios();
*/
});

const makeMarker = (audio : {id: number, coords: {lat: number, lon: number}}) => {
  const marker = L.marker([audio.coords.lat, audio.coords.lon],{
    icon: icon
  }).addTo(map.value);
  marker.bindPopup(`<b>Audio ${audio.id}</b><br>Click to listen!`).openPopup();
  console.log('Marker created');
  console.log(marker);
  // Handle marker click
  marker.on('click', () => {
    alert('Marker clicked!');
  });
  
  return marker;
}

const getAllAudiosPin = async () => sendRequestWithToken('GET', '/api/audio/all', null, [{
  status: 200,
  callback: async (_,res) => res.json().then((data) => {
    data.forEach((e : any) => {
      const audio = {
        id: e.id,
        coords: {
          lat: e.latitude,
          lon: e.longitude
        }
      }
      let mark = makeMarker(audio)
      markers.value.push(mark);
    });
  })
}]);
  

  </script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>

