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
  audioBase64: 'data:audio/wav;base64,T2dnUwACAAAAAAAAAACRkiwWAAAAAFZdRLsBE09wdXNIZWFkAQI4AUSsAAAAAABPZ2dTAAAAAAAAAAAAAJGSLBYBAAAA3WRPNAE5T3B1c1RhZ3MPAAAAbGlib3B1cyB1bmtub3duAQAAABYAAABFTkNPREVSPU1vemlsbGExMzAuMC4xT2dnUwAAADwAAAAAAACRkiwWAgAAAGiOVDMeAwMD//8J/yz/LP8s/yv/LP8s/yv/Kv8w/0L/Qv9C/P/+/P/+/P/+/Hr5nS3Me3hpknZReJqNpI2N615+K4YTLo6npdx7r0OaHI9IEXLz2vsp0FSzjIa8gJ76FPJA+dSodYHXWeM1np5LXjqE4GOgUNfyelyDcEzlONDse8r17zPtKSdCS+XY58sYmrsVMqUMKrMEa1QH41E+S9BfwDd+h1rrYwiumUoO0FD6Sa7a76PoDDBa9YbkVLMPglJ1fBO85O5rznf8nDHXYiH/2C+ycsoe89RZVshVgMrj7ar91Nw9I3b+X+HUCThsnTAwa2eIqC7wW7KVC/kO8hkcsXxLW0SNNvCPTNpapgiCvoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAChgdcvc80apRswTbLIuUuol7eMWdX0BUIIzCyo0JyFFGOPhkCCcp8jAvJrXU2U7BKs3R9CgVDeg0RAFj6lcyuI0dKbwJe1g5dcOyzWvutlfQ8jVPm3OO/kbAQYS000vN1x+kUvDfQ7/HnRatSO9jjR8Z7lWqy8olhEcMSZScd2gaRXtuCFvjSzbhU4PihNlJtVyyEr52CsAJMLyta4qEvuxifeoSiP8de//FjVDK7ZmNah1F5oy9Mrqxrxk5INma6HQ6q+ouFwkuseMERcsI9Jz8TP245mfzxPcYyqNi9x0PqoxyKMtQtQ4pm7lUb22TImRmUBcuT3eloYY2u4UwJ/BXRHvnfprijjKlvHy117301DfcEaF54iBKqjI9J2B4Rs3GDrJDqamJ3ryMqDKWuPCov2PAMKctL7zMfZ2FkmMIe3lNm50uKjFLOrRzcL9P9Wq46YEuz+NdZ58cPhJwaBzmd/MI0G39Sl2PIgoN8WJ8LY42l459cTV7Ku/tOxsjNToR+U3CSzIs5otBEbVDlIhdarBYlNN71FxyZFt1wQ2qsoweGt25ULPfGNf2jlPUy2ga1zUkva7PC8scsFbn151kMJqoinS8L+aUsKTy66eRnkgQXth7R5Nwa0T/1J1haHzV2hWeettcmhPvRpVS1jl1gF2VA4yvGTrbhQhdTCNo2zuysM1rd2YgqXh0IsypCaWja3/RclQvYQxbysUMnYon9gesyxrBom/r8U7vtg/lavfKp2K1PARGzZh98UYXE7oHqWJ1O0eDpYkhFTX4FHT358DfCWyYljxXTfROguIfmUKtdaMfebzenjnbF4qlQ2oa0bX7y45CZOHYzEzOkZsKtkeBeoZx82KX0W1uoVFx8qnkzYec',
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
  try {
    for (const audio of audios.value) {
      await deleteAudio(audio.hash);
      console.log(`audio ${audio.hash} eliminato`);
    }
    await readDatabase();
  } catch (error) {
    console.error("Errore nell'eliminazione dell'audio:", error);
  }
};



</script>

<style scoped>
</style>
