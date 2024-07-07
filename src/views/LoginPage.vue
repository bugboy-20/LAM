<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button @click="login">Login</ion-button>
      <ion-toast
        :isOpen="loginError.value"
        message="Your settings have been saved."
        position="top"
        duration="2000"></ion-toast>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">

import { IonButton, IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonToast} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import variables from '../variables';

const router = useRouter();
const apiUrl = variables.apiURL;
const loginError = ref(false);

async function singup() {
  await fetch(`${apiUrl}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'angolo180',
      password: 'Angolo.180',
    }),
  }).then((response) => {
    if (response.ok) {
      console.log( response.json());
    }
    throw new Error('Network response was not ok.');
  }).catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
  });
  //TODO login after signup
}

async function login() {
  await fetch(`${apiUrl}/auth/token`, {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'x-www-form-urlencoded',
      //'Allow-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Methods': 'POST',
      //'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: new URLSearchParams({
      username: 'angylo180',
      password: 'Angolo.180',
    })}).then((response) => {
      if(response.status === 400) {
        loginError.value = true;
        throw new Error('Network response was not ok.');
      }
      if(response.status === 200) {
        loginError.value = false;
        console.log(response);
        return router.push('/tabs/');
      }
    }).catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
</script>
