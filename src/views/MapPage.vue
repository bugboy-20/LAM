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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { onMounted, ref, shallowRef } from 'vue';
import { GoogleMap } from 'capacitor7-google-maps'; // TODO: https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue
import setting from '../variables.json';
const mapRef = ref<HTMLElement>()
const newMap = shallowRef<GoogleMap>()
async function createMap() {
  console.log('Creating map...')
  console.log(import.meta.env.VITE_MAPS_API_KEY)
  if (!mapRef.value) return
  newMap.value = await GoogleMap.create({
    id: 'my-cool-map',
    element: mapRef.value,
    apiKey: import.meta.env.VITE_MAPS_API_KEY,
    config: {
      center: {
        lat: 33.6,
        lng: -117.9,
      },
      zoom: 8,
    },
  })

  console.log('Map created!')
  console.log(await newMap.value.getRawGoogleMapInstance())
}

onMounted(() => {
    createMap();
  });
//Questa pagina non carica correttamente Google Maps. Il problema è che il componente capacitor-google-maps non è stato caricato correttamente. Per risolvere questo problema, è necessario aggiungere il seguente codice JavaScript alla pagina MapPage.vue.
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
