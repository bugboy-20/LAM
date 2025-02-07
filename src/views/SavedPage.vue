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
      <IonButton @click="readDatabase">Read Database</IonButton>
      <IonButton @click="removeDatabase">Remove Database</IonButton>
      <IonButton @click="deleteUploadedAudio">Delete Uploaded Audio</IonButton>
      <div>
        <Audio v-for="audio in audios" :audio="audio" :key="audio.hash" />
      </div>
       <ion-accordion-group>
        <ion-accordion>
          <ion-item slot="header">
            <ion-label>First Accordion</ion-label>
          </ion-item>
          <div slot="content">First Content</div>
        </ion-accordion>
       </ion-accordion-group>
       {{ ids }}
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSelect, IonSelectOption } from '@ionic/vue';
import {deleteAudio, readAllAudioMetadata } from '@/utils/storage';
import {getAudioSummary, getAudioInfo as getAudio, sendRequestWithToken} from '@/utils/requests';
import {AudioInternal, AudioAPI } from '@/interfaces';
import {AudioSummary} from '@/interfaces';

import Audio from '@/components/Audio.vue';
import {onMounted} from 'vue';

const selected = ref<string>('1');
const fileText = ref<string>('');

const audios = ref<AudioInternal[]>([]);
const ids = ref<string>("");

onMounted(async () => {
  ids.value = await getAudioSummary().then((result) => JSON.stringify(result))
  readDatabase();
  //console.log(await getAudio(538))
});

const fromAPIToInternal = (audio: AudioAPI): AudioInternal => {
  return {
    hash: "",
    audioBase64: "",
    mimeType: "",
    id: audio.id,
    duration: 0,
    coordinates: Promise.resolve(audio.coordinates),
    createdAt: new Date(),
    metadata: audio.tags,
  }
};

const readDatabase = async () => {
  audios.value = [];
  Promise.all([readAllAudioMetadata(), getAudioSummary()]).then(async ([DBaudio, ServerAudio]) => {
    audios.value.concat(DBaudio.map((audio) => { // aggiungo audio dal database
      if (!audio.id)
        return audio;

      const apiInfo = ServerAudio.find((element) => element.id === audio.id);

      if (apiInfo && audio.metadata) { // se l'audio è presente nel summary aggiungo info visibilità
        audio.metadata.hidden = apiInfo.hidden;
      } else {
        console.error(`Audio ${audio.id} non trovato nel summary o non ha metadata`);
      }
      return audio;
    }));

    const spareAudio = ServerAudio.filter((audio) => !audios.value.find((element) => element.id === audio.id))
    const apiAudio = Promise.all(
      spareAudio.map(async (e) => await getAudio(e.id)
        .catch(_ => undefined))) as Promise<AudioAPI[]>;

    const cleanApiAudio = (await apiAudio).filter((e) => e !== undefined).map(fromAPIToInternal);
    audios.value.concat(cleanApiAudio);
    

  });
};

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

const deleteUploadedAudio = async () => {
  const audios = await getAudioSummary().then((result) => result.map(async (audio: AudioSummary) => {
    const id = audio.id;
    return sendRequestWithToken('DELETE', `/api/audio/my/${id}`, null, [
      {status: 200, callback: async (req, res) => {
        console.log(`audio ${id} eliminato`);
      }}
    ],async (req, res) => {
      console.error(`Errore nella cancellazione dell'audio ${id}`);
    });
  }))
  await Promise.all(audios);
};


</script>

<style scoped>
</style>
