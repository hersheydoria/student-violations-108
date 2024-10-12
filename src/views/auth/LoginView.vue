<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()

const theme = ref(localStorage.getItem('theme') ?? 'light')

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
        :color="theme === 'light' ? 'green-lighten-1' : 'green-darken-3'"
        border
      >
        <v-spacer></v-spacer>

        <!-- Visitor page button -->
        <v-btn text @click="goToVisitorPage">Visitor Page</v-btn>

        <!-- Theme toggle button -->
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row class="d-flex justify-center align-center">
            <v-col cols="12" md="6">
              <v-card
                class="px-4 py-4"
                :color="theme === 'light' ? 'green-lighten-5' : 'green-darken-3'"
                elevation="10"
                rounded="lg"
              >
                <!-- Card title with better typography -->
                <v-card-title class="text-center">
                  <h2 class="font-weight-bold">Login</h2>
                </v-card-title>

                <!-- Card content -->
                <v-card-text>
                  <LoginForm></LoginForm>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Footer with centered text -->
      <v-footer app class="px-3" :color="theme === 'light' ? 'green-lighten-1' : 'green-darken-3'">
        <v-row>
          <v-col class="text-center"> © 2024 - Student Violations </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
