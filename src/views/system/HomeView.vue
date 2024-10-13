<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

// Reactive variables
const router = useRouter();
const theme = ref(localStorage.getItem('theme') ?? 'light');
const showForm = ref(false);
const newViolation = ref({
  studentId: '',
  type: '',
});
const violations = ref([]); // Your existing violation data
const headers = [
  { text: 'Student ID', value: 'studentId' },
  { text: 'Violation Type', value: 'type' },
  { text: 'Date', value: 'date' },
  { text: 'Recorded By', value: 'recordedBy' },
];
const violationTypes = [
  'Dress Code Violation',
  'Disruption Obstruction',
  'Gambling',
  'Bribery Receiving Bribe',
  'Having Abusive Affiliation',
  'Unauthorized Use CSU Management',
  'Blocking Publication',
  'Disregard Code Conduct',
  'Abuse Code Ceremony',
  'Violating Policies',
  'Ignoring Flag Ceremony',
  'None Wearing ID',
];

// Methods
const addViolation = () => {
  violations.value.push({
    id: violations.value.length + 1, // Example ID generation
    studentId: newViolation.value.studentId,
    type: newViolation.value.type,
    date: new Date().toLocaleDateString(), // Add current date
    recordedBy: 'Guard', // Example recordedBy, adjust as needed
  });
  newViolation.value.studentId = '';
  newViolation.value.type = '';
  showForm.value = false;
};

// Navigation methods
const goToHome = () => {
  router.push('/home'); // Assuming you have a home route
};

const goToHistory = () => {
  router.push('/history'); // Assuming you have a history route
};

// Logout method
const logout = () => {
  localStorage.removeItem('authToken'); // Clear any token or session data
  router.push('/login'); // Redirect to login page after logout
};

// Theme toggle function
const onClick = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
};

// Set theme on mounted
onMounted(() => {
  document.body.setAttribute('data-theme', theme.value);
});

// Watch for theme changes
watch(theme, (newTheme) => {
  document.body.setAttribute('data-theme', newTheme);
});
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar
      class="px-3"
      :color="theme === 'light' ? 'green lighten-1' : 'green darken-3'"
    >
      <v-toolbar-title>Student Violation Management</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Home button -->
      <v-btn text @click="goToHome">Home</v-btn>

      <!-- History button -->
      <v-btn text @click="goToHistory">History</v-btn>

      <!-- Logout button -->
      <v-btn text @click="logout">Logout</v-btn>

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
        <v-row>
          <!-- Profile section -->
          <v-col cols="3">
            <v-card outlined>
              <v-card-text>
                <div><strong>Profile Pic</strong></div>
                <p><strong>ID Number:</strong></p>
                <p><strong>Name:</strong></p>
                <p><strong>Email:</strong></p>
                <p><strong>Role:</strong></p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Main section with Add button and Table -->
          <v-col cols="9">
            <!-- Add Violation button -->
            <v-btn @click="showForm = true" color="blue">Add Violation</v-btn>

            <!-- Violations Table without pagination or items per page controls -->
            <v-data-table
              :headers="headers"
              :items="violations"
              item-value="id"
              class="mt-5"
              :footer-props="{ 'items-per-page-options': [] }"
            ></v-data-table>
          </v-col>
        </v-row>

        <!-- Add Violation Modal -->
        <v-dialog v-model="showForm" max-width="600px">
          <v-card>
            <v-card-title>Add Violation</v-card-title>
            <v-card-text>
              <v-text-field
                label="ID Number"
                v-model="newViolation.studentId"
                required
              ></v-text-field>
              <v-select
                label="Violation Type"
                v-model="newViolation.type"
                :items="violationTypes"
                required
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="showForm = false" color="grey">Cancel</v-btn>
              <v-btn @click="addViolation" color="pink">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <!-- Footer left untouched as requested -->
    <v-footer app class="px-3" :color="theme === 'light' ? 'green lighten-1' : 'green darken-3'">
      <v-row>
        <v-col class="text-center"> © 2024 - Student Violations </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
