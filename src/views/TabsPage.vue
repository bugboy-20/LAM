<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1" @click="colorSelected(1)">
          <ion-icon aria-hidden="true" :icon="recordIcon" />
          <ion-label>Registra</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2" @click="colorSelected(2)">
          <ion-icon aria-hidden="true" :icon="mapIcon" />
          <ion-label>Esplora</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3" @click="colorSelected(3)">
          <ion-icon aria-hidden="true" :icon="savedIcon" />
          <ion-label>Cronologia</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { micOutline, volumeMediumOutline, planetOutline, micSharp, planetSharp, volumeMediumSharp } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

onMounted(async () => {
  console.log('Initializing database');
  console.log('Database initialized');
});

const recordIcon = ref(micOutline);
const mapIcon = ref(planetOutline);
const savedIcon = ref(volumeMediumOutline);

const colorSelected = (n : 1|2|3) => {
  recordIcon.value = micOutline;
  mapIcon.value = planetOutline;
  savedIcon.value = volumeMediumOutline;
  if(n==1)
    recordIcon.value = micSharp
  if(n==2)
    mapIcon.value = planetSharp
  if(n==3)
    savedIcon.value = volumeMediumSharp
}


</script>
