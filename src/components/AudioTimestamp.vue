<template>
  <div>
      {{ millisToMinutesAndSeconds( currentTime )}} / {{  millisToMinutesAndSeconds(props.duration) }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps<{duration: number}>()
const currentTime = ref(0)
let interval : number | undefined | any // perchè non c'è il tipo Timeout

const millisToMinutesAndSeconds = (millis: number) => {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
}

const play = () => {
  startTimer()
  console.log('play')
}

const pause = (time: number | undefined) => { // time can be used to stamp the perfect time
  if (time)
    currentTime.value = time
  clearInterval(interval)
  console.log('pause')
}

const startTimer = () => {
  interval = setInterval(() => {
    currentTime.value += 1000
    if (currentTime.value >= props.duration) {
      clearInterval(interval)
    }
  }, 1000) //TODO 1 second is too much, he doens't look very rective
}

defineExpose({
  play,
  pause,
  stop: pause
})

watch(() => props.duration, () => {
  currentTime.value = 0 // reset the timer if the duration changes, technically audio can change but not the duration, but hightly unlikely
})

</script>
