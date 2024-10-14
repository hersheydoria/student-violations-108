<template>
  <!-- Card Title -->
  <v-card-title class="headline text-center">
    <strong>Reset Password</strong>
  </v-card-title>

  <!-- Card Content -->
  <v-card-text>
    <v-form v-model="valid" lazy-validation>
      <!-- New Password -->
      <v-text-field
        v-model="newPassword"
        :rules="[passwordRules.required, passwordRules.passwordMin]"
        label="New Password"
        prepend-icon="mdi-lock"
        type="password"
        required
      ></v-text-field>

      <!-- Confirm Password -->
      <v-text-field
        v-model="confirmPassword"
        :rules="[passwordRules.required, passwordRules.passwordMatch]"
        label="Confirm Password"
        prepend-icon="mdi-lock"
        type="password"
        required
      ></v-text-field>
    </v-form>

    <!-- Success and Error Alerts -->
    <v-alert v-if="passwordResetSuccess" type="success" class="mt-4">
      Password has been successfully reset. Redirecting to login...
    </v-alert>
    <v-alert v-if="errorMessage" type="error" class="mt-4">
      {{ errorMessage }}
    </v-alert>
  </v-card-text>

  <!-- Card Actions -->
  <v-card-actions class="d-flex justify-center">
    <v-btn text @click="router.push('/login')">Cancel</v-btn>
    <v-btn color="customGreen" @click="onSetNewPassword">Set New Password</v-btn>
  </v-card-actions>
</template>
