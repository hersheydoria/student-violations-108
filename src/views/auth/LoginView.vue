<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()

const theme = ref(localStorage.getItem('theme') ?? 'Light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

function goToVisitorPage() {
  router.push('/visitor')
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar
        class="px-3"
        :color="theme === 'light' ? 'grey-lighten-1' : 'grey-darken-3'"
        border
      >
        <v-spacer></v-spacer>

        <!-- Button for visiting Visitor page -->
        <v-btn text @click="goToVisitorPage">Visitor Page</v-btn>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row class="d-flex justify-center">
            <v-col cols="12" md="6">
              <v-card class="px-4 py-4">
                <v-card-title class="text-center">
                  <h2>Login</h2>
                </v-card-title>

                <v-card-text>
                  <LoginForm></LoginForm>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-footer border app>2024 - Student Violations</v-footer>
    </v-app>
  </v-responsive>
</template>
