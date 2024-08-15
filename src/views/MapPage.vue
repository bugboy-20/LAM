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
import { GoogleMap } from 'capacitor7-google-maps'; // TODO: https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue
import {getCoordinates} from '@/utils/geolocation';
import {Coordinates} from '@/interfaces';

const mapRef = ref<HTMLElement>()
const newMap = shallowRef<GoogleMap>()
const cameraCoordinates = ref<Coordinates>({latitude: 0, longitude: 0})

async function createMap() {
  console.log('Creating map...')
  console.log(import.meta.env.VITE_MAPS_API_KEY)
  if (!mapRef.value) return
  const coods = getCoordinates()
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

  console.log('Map created!')
  console.log(await newMap.value.getRawGoogleMapInstance())
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
