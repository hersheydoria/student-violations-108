<script setup>
import { ref } from 'vue'

const userId = ref('')
const password = ref('')

function onLogin() {
  if (userId.value && password.value) {
    console.log('User ID:', userId.value)
    console.log('Password:', password.value)
    // Handle successful login
  } else {
    console.log('Please enter both user ID and password.')
  }
}

function onForgotPassword() {
  console.log('Forgot Password clicked')
}
</script>
<template>
  <v-form>
    <v-text-field
      v-model="userId"
      label="User ID"
      prepend-icon="mdi-account"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      prepend-icon="mdi-lock"
      type="password"
      required
    ></v-text-field>

    <v-btn class="mt-4" color="primary" @click="onLogin">Login</v-btn>
    <v-btn class="mt-2" text @click="onForgotPassword" color="secondary"> Forgot Password? </v-btn>
  </v-form>
</template>
