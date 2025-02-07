<template>
  <Suspense>
  <div>
    <h1>{{audioInfos.creator_username}}</h1>
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

