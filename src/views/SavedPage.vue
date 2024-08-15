<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>Saved</ion-title>
        </ion-toolbar>
      </ion-header>
      {{ coordinates }}
      <IonButton @click="getPosition">Get Position</IonButton>
      <ExploreContainer name="Tab 3 page" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import {Coordinates} from '@/interfaces';

const coordinates = ref<Coordinates>({latitude: 0, longitude: 0});

const getPosition = async () => {
  const coords : Function = async () => Geolocation.getCurrentPosition()
    .then((position) => {
      console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      return {latitude, longitude};
    })
    .catch(async (err) => {
      console.error(err);
      return await coords();
    });
  console.log('Current', coordinates);
  coordinates.value = await coords();
};

onMounted(getPosition);
</script>
