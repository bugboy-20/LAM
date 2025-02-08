<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>
            Saved
          </ion-title>

          <IonRefresher slot="fixed" @ionRefresh="refreshDB($event)" >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        </ion-toolbar>
      </ion-header>
      <div>
        <Audio v-for="audio in audios" :audio="audio" :key="audio.hash" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
        import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';
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
    const audioFromDB = DBaudio.map((audio) => { // aggiungo audio dal database
      if (!audio.id)
        return audio;

      const apiInfo = ServerAudio.find((element) => element.id === audio.id);

      if (apiInfo && audio.metadata) { // se l'audio è presente nel summary aggiungo info visibilità
        audio.metadata.hidden = apiInfo.hidden;
      } else {
        console.error(`Audio ${audio.id} non trovato nel summary o non ha metadata`);
      }
      return audio;
    });
    
    console.log('audioFromDB');
    console.log(audioFromDB);

    audios.value = audios.value.concat(audioFromDB);

    const spareAudio = ServerAudio.filter((audio) => !audios.value.find((element) => element.id === audio.id))
    const apiAudio = Promise.all(
      spareAudio.map(async (e) => getAudio(e.id).catch(_ => undefined)))

    const cleanApiAudio = (await apiAudio).filter((e) => e !== undefined).map(async (e) => {
      console.log(e);
      return fromAPIToInternal(e)}) as Promise<AudioInternal>[];
    //audios.value.concat(cleanApiAudio);

    audios.value = audios.value.concat(await Promise.all(cleanApiAudio));

    console.log(JSON.stringify(spareAudio));
    console.log('audios');
    console.log(audios.value);
  });
};

const refreshDB = async (event: CustomEvent) => {
  audios.value = [];
  await readDatabase();
  event.detail.complete();
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
