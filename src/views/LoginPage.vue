<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button @click="() => router.push('/tabs/')">Login</ion-button>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { IonButton, IonPage, IonHeader, IonToolbar, IonContent, IonTitle} from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
