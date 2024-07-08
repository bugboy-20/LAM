<template>
  <ionPage>
    <ionHeader>
      <ionToolbar>
        <ionTitle>Login</ionTitle>
      </ionToolbar>
    </ionHeader>
    <ionContent>
      <ionInput label="Username" placeholder="Username"></ionInput>
      <ionInput label="Password" placeholder="Password" type="password"></ionInput>

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
  IonNavLink
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const loginError = ref(false);

async function login() {
  if (loginError.value) {
    return; // prevent multiple clicks
  }
  await fetch(`/api/auth/token`, {
    mode: 'cors',
    method: 'POST',
    body: new URLSearchParams({
      username: 'angolo180',
      password: 'Angolo.180',
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
      return router.push(`/tabs/?token=${token}`);
    }).catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
</script>
