<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <ion-title>Map</ion-title>
      </IonToolbar>
    </IonHeader>
    <ion-content>
      <Map />
    </ion-content>
  </IonPage>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/vue';
import Map from '@/components/Map.vue';
</script>

