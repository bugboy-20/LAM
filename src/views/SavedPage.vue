<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>
            Saved
            <IonSelect v-model="selected" placeholder="Select One">
              <IonSelectOption value="1">Option 1</IonSelectOption>
              <IonSelectOption value="2">Option 2</IonSelectOption>
              <IonSelectOption value="3">Option 3</IonSelectOption>
            </IonSelect>
          </ion-title>

        </ion-toolbar>
      </ion-header>
      <IonButton @click="saveDatabase">Save Database</IonButton>
      <IonButton @click="readDatabase">Read Database</IonButton>
      <IonButton @click="removeDatabase">Remove Database</IonButton>
      <Audio :audio="demoAudio" />
      <p>{{ fileText }}</p>
      <div>
        <Audio v-for="audio in audios" :audio="audio" :key="audio.hash" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSelect, IonSelectOption } from '@ionic/vue';
import {deleteAudio, readAllAudioMetadata, saveAudio} from '@/utils/storage';
import {AudioInternal} from '@/interfaces';

import Audio from '@/components/Audio.vue';

const selected = ref<string>('1');
const fileText = ref<string>('');

const audios = ref<AudioInternal[]>([]);

const demoAudio : AudioInternal = {
  id: 345789,
  hash: 'asdf123',
  audioBase64: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
  mimeType: 'audio/wav',
  duration: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  coordinates: Promise.resolve({
    latitude: 44.787197,
    longitude: 11.457273,
  }),
  metadata: {
    bpm: 32,
    danceability: 0.3,
    loudness: 0.6,
    mood: {kek: true},
    genre: {rock: 0.7},
    instruments: {trumpet: 0.3}
  }
}

const saveDatabase = async () => {

  const dummyAudio1 : AudioInternal = {
    hash: '123',
    audioBase64: '123',
    mimeType: 'audio/wav',
    createdAt: new Date(),
    duration: 1000,
    coordinates: Promise.resolve({
      latitude: 44.787197,
      longitude: 11.457273,
    }),
  }

  const dummyAudio2 : AudioInternal = {
    hash: '456',
    audioBase64: '456',
    mimeType: 'audio/wav',
    createdAt: new Date(),
    updatedAt: new Date(),
    duration: 2000,
    coordinates: Promise.resolve({
      latitude: 44.787197,
      longitude: 11.457273,
    }),
    id: 1,
    metadata: {
      bpm: 120,
      danceability: 0.45,
      instruments: {'guitar':0.6, 'bass':0.5},
      genre: {'rock':0.8, 'pop':0.2},
      loudness: -10,
      mood: {'happy':0.7, 'sad':0.3}
    }}

  await saveAudio(dummyAudio1);
  await saveAudio(dummyAudio2);
  await readDatabase();
};
const readDatabase = async () => {
  readAllAudioMetadata().then((result) => {
    audios.value = result;
    fileText.value = JSON.stringify(audios.value);
    console.log(audios.value);
  });
}

const removeDatabase = async () => {
  audios.value.forEach(async (audio) => {
    await deleteAudio(audio.hash)
    console.log(`audio ${audio.hash} eliminato`)
  })
  await readDatabase();
}

</script>

<style scoped>
div {
}
</style>
