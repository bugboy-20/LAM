<template>
  <ionPage>
    <ionHeader>
      <ionToolbar>
        <ionTitle>Login</ionTitle>
      </ionToolbar>
    </ionHeader>
    <ionContent>
    <ionInput label="Username" placeholder="Username" v-model="username"></ionInput>
    <ionInput label="Password" placeholder="Password" type="password" v-model="password">
      <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
    </ionInput>

      <ionCheckbox label-placement="end" >Remeber me</ionCheckbox><br>
      <ionButton @click="login">Login</ionButton>
      <p>
        Don't have an account? Singup 
       <ionNavLink router-link="/signup" >here</ionNavLink>
      </p>
      <ionToast
        :isOpen="loginError"
        message="Login failed. Please try again."
        position="top"
        duration="2000"></ionToast>
    </ionContent>
  </ionPage>
</template>
<script setup lang="ts">

import { 
  IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonToast,
  IonInput,
  IonCheckbox,
  IonNavLink,
  IonInputPasswordToggle
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const loginError = ref(false);

const username = ref('angolo180');
const password = ref('Angolo.180');

async function login() {
  if (loginError.value) {
    return; // prevent multiple clicks
  }
  await fetch(`/api/auth/token`, {
    mode: 'cors',
    method: 'POST',
    body: new URLSearchParams({
      username: username.value,
      password: password.value,
    })}).then((response) => {
      console.log('after fetch');
      if(response.status == 400) {
        loginError.value = true;
        setTimeout(() => {
          loginError.value = false;
        }, 2000);
        console.log('status 400');
        //loginError.value = false;
        throw new Error('Network response was not ok.');
      }
      console.log('status 200');
      if(response.status == 200) {
        loginError.value = false;
        console.log(response);
        return response.json();
      }
      console.log(response);
    }).then((json) => {
      console.log(json);
      const token = json.client_secret;
      if (!token) {
        throw new Error('No token found in response.');
      }
      return router.push(`/tabs/?token=${token}`); // TODO: secure this
    }).catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
</script>
