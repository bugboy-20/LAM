<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Sign Up</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonInput placeholder="Username" v-model="username"></IonInput>
      <IonInput placeholder="Password" v-model="password">
        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
      </IonInput>
      <IonButton @click="singup()">Sign Up</IonButton>
      <p>
        Already have an account? 
        <IonNavLink routerLink="/login">Login</IonNavLink>
      </p>
      <IonToast
        :isOpen="singupError"
        :message="message"
        position="top"
        duration="2000"></IonToast>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import variables from '@/variables.json';
import {sendRequest} from '@/utils/requests';
import { IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonNavLink, IonInputPasswordToggle, IonToast } from '@ionic/vue';
import { ref } from 'vue';

const username = ref('angolo180');
const password = ref('Angolo.180');

const singupError = ref(false);
const message = ref('');

async function singup() {
  if (singupError.value) {
    return; // prevent multiple clicks
  }
  await sendRequest('POST',`${variables.apiURL}/auth`, {
      'Content-Type': 'application/json',
    },
    JSON.stringify({
      username: username.value,
      password: password.value,
    }),
    [{
      status: 200,
      callback: async (_, response) => {
        console.log(response);
      }},
      {
      status: 400,
      callback: async (_,res) => {
        const errorMessage = 'Username already exists. Please try another one.'
        console.log(errorMessage);
        message.value = errorMessage;
        singupError.value = true;
        setTimeout(() => {
          singupError.value = false;
        }, 2000);
      }
    }], async (_,res) => { console.log(res); });
 }


</script>
