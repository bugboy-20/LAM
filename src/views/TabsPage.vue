<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" :href="'/tabs/tab1?token='+token">
          <ion-icon aria-hidden="true" :icon="micOutline" />
          <ion-label>Registra</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" :href="'/tabs/tab2?token='+token">
          <ion-icon aria-hidden="true" :icon="planetOutline" />
          <ion-label>Esplora</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" :href="'/tabs/tab3?token='+token">
          <ion-icon aria-hidden="true" :icon="volumeMediumOutline" />
          <ion-label>Cronologia</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { micOutline, volumeMediumOutline, planetOutline } from 'ionicons/icons';
import { initializeDatabase } from '@/utils/storage';
import { onMounted } from 'vue';

const token = localStorage.getItem('token');
//TODO icona selezionata diventa sharp?
onMounted(async () => {
  console.log('Initializing database');
  console.log('Database initialized');
});
</script>
