<script setup>
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<template>
  <v-app>
    <!-- Main content -->
    <v-main>
      <v-container
        fluid
        class="fill-height d-flex align-center justify-center"
        style="background-color: #006400"
      >
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="6">
            <v-card
              class="px-6 py-6"
              elevation="12"
              rounded="xl"
              style="
                background-color: rgba(255, 255, 255, 0.3); /* More transparent white */
                backdrop-filter: blur(8px); /* Apply blur effect */
              "
            >
              <!-- Add image above the heading -->
              <v-img
                src="/logo6.png"
                alt="System Logo"
                contain
                max-width="120"
                class="mx-auto mb-4"
              ></v-img>

              <!-- Card title for "Login" -->
              <v-card-title class="text-center">
                <h3 class="font-weight-bold" style="color: #006400">Login</h3>
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
    <v-footer app class="px-3" style="background-color: #2e7d32; color: white">
      <v-row>
        <v-col class="text-center"> © 2024 - Student Violations </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
