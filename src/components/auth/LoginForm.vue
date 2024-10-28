<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xmsncfnqrihsbbeljjfp.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc25jZm5xcmloc2JiZWxqamZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwOTg1NDEsImV4cCI6MjA0MzY3NDU0MX0.x5gbs9Pl4NN371dJUwanApAal64YuWjV9gpUFkyqGtg'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Form data
const email = ref('')
const password = ref('')
const valid = ref(true)

// Forgot Password modal
const forgotPasswordDialog = ref(false)
const emailForReset = ref('') // Email for password reset
const emailSent = ref(false)
const errorMessage = ref('')

// Validation rules
const rules = {
  required: (value) => !!value || 'Required.',
  passwordMin: (v) => v.length >= 5 || 'Password must be at least 5 characters long',
  email: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.'
}

// Router instance
const router = useRouter()

// Login logic
async function onLogin() {
  errorMessage.value = '' // Reset error message

  // Check if the form is valid
  if (valid.value) {
    // Log email and password to check values before making the login request
    console.log('Email:', email.value)
    console.log('Password:', password.value)

    try {
      // Attempt to log in with Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })

      // Handle login error
      if (signInError) {
        errorMessage.value = 'Invalid login credentials'
        return
      }

      // Redirect on successful login
      router.push('/home')
    } catch (error) {
      errorMessage.value = 'An unexpected error occurred'
    }
  } else {
    console.log('Invalid form')
  }
}

// Open Forgot Password modal
function onForgotPassword() {
  forgotPasswordDialog.value = true
}

// Reset password logic using Supabase
async function onResetPassword() {
  if (valid.value) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailForReset.value, {
        redirectTo: 'http://localhost:3000/reset-password' // URL for the reset page
      })

      if (error) {
        throw error
      }

      emailSent.value = true
      forgotPasswordDialog.value = false // Close modal after success
    } catch (error) {
      errorMessage.value = error.message
    }
  }
}
</script>

<template>
  <v-form v-model="valid" lazy-validation>
    <!-- Email field -->
    <v-text-field
      v-model="email"
      :rules="[rules.required, rules.email]"
      label="Email"
      prepend-icon="mdi-email"
      required
    ></v-text-field>

    <!-- Password field -->
    <v-text-field
      v-model="password"
      :rules="[rules.required, rules.passwordMin]"
      label="Password"
      prepend-icon="mdi-lock"
      type="password"
      required
    ></v-text-field>

    <!-- Add message below the form -->
    <v-alert type="info" color="customGreen" text class="mt-4 mb-4">
      <strong>Note:</strong> Only guards registered in the organization or school can sign in.
      Students should go to the
      <strong>
        <router-link
          to="/visitor"
          style="text-decoration: underline; color: inherit; cursor: pointer"
        >
          Visitor Page
        </router-link> </strong
      >.
    </v-alert>

    <!-- Use v-row to layout the Login button and Forgot Password link -->
    <v-row>
      <v-col class="text-left">
        <span
          text
          @click="onForgotPassword"
          style="text-transform: none; text-decoration: underline; cursor: pointer"
        >
          Forgot Password?
        </span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right">
        <v-btn
          color="customGreen"
          @click="onLogin"
          style="width: 90px; height: 40px; font-size: 18px"
        >
          Login
        </v-btn>
      </v-col>
    </v-row>

    <!-- Forgot Password Modal -->
    <v-dialog
      v-model="forgotPasswordDialog"
      max-width="500"
      elevation="10"
      style="backdrop-filter: blur(8px)"
    >
      <v-card class="px-6 py-6" elevation="12" rounded="xl" style="background-color: #e6ffb1">
        <v-card-title class="headline"><strong>Reset Password</strong></v-card-title>
        <v-card-text>
          <v-form v-model="valid" lazy-validation>
            <v-text-field
              v-model="emailForReset"
              :rules="[rules.required, rules.email]"
              label="Email"
              prepend-icon="mdi-email"
              required
            ></v-text-field>
          </v-form>

          <v-alert v-if="emailSent" type="success" class="mt-4">
            A password reset link has been sent to your email.
          </v-alert>

          <v-alert v-if="errorMessage" type="error" class="mt-4">
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="forgotPasswordDialog = false">Cancel</v-btn>
          <v-btn color="customGreen" @click="onResetPassword">Send Reset Link</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>
