<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="map-container">
        <capacitor-google-maps ref="mapRef"></capacitor-google-maps>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { onMounted, ref, shallowRef } from 'vue';
import { GoogleMap, Marker } from 'capacitor7-google-maps'; // TODO: https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue
import {getCoordinates} from '@/utils/geolocation';
import {Coordinates} from '@/interfaces';
import { sendRequestWithToken, Handler } from '@/utils/requests';

const mapRef = ref<HTMLElement>()
const newMap = shallowRef<GoogleMap>()
const cameraCoordinates = ref<Coordinates>({latitude: 0, longitude: 0})

let markers: Marker[] = []

async function createMap() {
  if (!mapRef.value) return
  newMap.value = await GoogleMap.create({
    id: 'my-cool-map',
    element: mapRef.value,
    apiKey: import.meta.env.VITE_MAPS_API_KEY,
    config: {
      center: { //TODO use the position of the last recording
        lat: 44.787197,
        lng: 11.457273,
      },
      zoom: 8,
    },
  })

}

const coordsToMarker = (coords: Coordinates) : Marker => {
  return {
    coordinate: {
      lat: coords.latitude,
      lng: coords.longitude,
    },
    title: 'Marker Title',
    snippet: 'Marker Snippet',
    icon: 'https://cdn-icons-png.flaticon.com/512/1165/1165814.png',
  } as Marker
}


onMounted(() => {
  createMap();
  getCoordinates().then((coords) => {
    newMap.value?.setCamera({
      coordinate: {
        lat: coords.latitude,
        lng: coords.longitude,
      },
      zoom: 16,
    })
  });
  const handlers : Handler[] = [
    {
      status: 200,
      callback: async (_: Request, res: Response) => {
        let audio : Coordinates[] = await res.json()
        audio.forEach((coords) => {
          markers.push(coordsToMarker(coords))
        })
        newMap.value?.addMarkers(markers)

      }
    }
    ]

  sendRequestWithToken('GET', '/api/audio/all', {}, handlers)

})
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
}

capacitor-google-maps {
  display: inline-block;
  height: 100%;
  width: 100%;
}
</style>
