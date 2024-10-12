<script setup>
import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') ?? 'Light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-container>
        <h1>Visitor Page</h1>
        <p>Welcome to the visitor page where you can search for student records.</p>
      </v-container>
    </v-app>
  </v-responsive>
</template>
