<template>
  <Suspense>
  <div>
    <div id="username">
      <IonIcon :icon="personSharp" id="usericon"/>
      <h1> {{audioInfos.creator_username}}</h1>
    </div>
    <MetadataInfo v-if="audioInfos.id==0" :metadata="audioInfos.tags" />
    <MetadataInfo v-else :metadata="audioInfos.tags" />
  </div>
  <template #fallback>
    Loading...
  </template>
  </Suspense>
</template>

<script setup lang="ts">
import {getAudioInfo as getAudioAPI} from '@/utils/requests';
import { personSharp } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import MetadataInfo from './MetadataInfo.vue';
import {onMounted, ref} from 'vue';
import { AudioAPI } from '@/interfaces';

const audioInfos = ref<AudioAPI>({
  id: 0,
  creator_username: '',
  coordinates: {longitude: 0, latitude: 0},
  tags: {
    hidden: true,
    bpm: 0,
    danceability: 0,
    loudness: 0,
    mood: {},
    instrument: {},
    genre: {},
  }
})


const getAudioInfo = async (id: number) => {
  audioInfos.value = await getAudioAPI(id);
}

defineExpose({
  getAudioInfo
});
</script>

<style scoped>
h1 {
  font-size: 1.2em;
  margin-top: 0.5em;
  margin-left: 0.5em;
}
#usericon {
  font-size: 1.2em;
  margin-top: 0.5em;
}
#username {
  display: flex;
  justify-content: left;
  align-content: baseline;
}
</style>
