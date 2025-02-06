<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Map</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <Map />
    </ion-content>
  </ion-page>
</template>

<script>
import Map from '@/components/Map.vue';

export default {
  components: { Map},
};
</script>

