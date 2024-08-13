<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ExploreContainer name="Tab 3 page" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { Filesystem, Directory } from '@capacitor/filesystem';
import ExploreContainer from '@/components/ExploreContainer.vue';
</script>
