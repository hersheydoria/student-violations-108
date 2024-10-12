<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userId = ref('')
const password = ref('')
const router = useRouter()

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
      <v-app-bar class="px-3">
        <v-spacer></v-spacer>

        <!-- Button for visiting Visitor page -->
        <v-btn text @click="goToVisitorPage">Visitor Page</v-btn>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
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
                    <v-btn class="mt-2" text @click="onForgotPassword" color="secondary">
                      Forgot Password?
                    </v-btn>
                  </v-form>
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
