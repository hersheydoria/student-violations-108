<script setup>
import { ref, onMounted, watch } from 'vue'; // Ensure 'watch' is imported
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

// Logout method
const logout = () => {
  // Implement your logout logic here (clear user session, tokens, etc.)
  router.push('/login'); // Redirect to login page
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
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar
        class="px-3"
        :color="theme === 'light' ? 'green lighten-1' : 'green darken-3'"
        border
      >
        <v-toolbar-title>Violation Management</v-toolbar-title>
        <v-spacer></v-spacer>

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
          <!-- Add Violation button -->
          <v-btn @click="showForm = true" color="pink">Add Violation</v-btn>

          <!-- Violations Table -->
          <v-data-table
            :headers="headers"
            :items="violations"
            class="violations-table"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.studentId }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.recordedBy }}</td>
              </tr>
            </template>
          </v-data-table>

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

      <!-- Footer with centered text -->
      <v-footer app class="px-3" :color="theme === 'light' ? 'green lighten-1' : 'green darken-3'">
        <v-row>
          <v-col class="text-center"> © 2024 - Student Violations </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.violations-table {
  margin-top: 20px;
}

/* Add styles for dark/light themes */
[data-theme='dark'] {
  background-color: #121212;
  color: white;
}

[data-theme='light'] {
  background-color: white;
  color: black;
}
</style>
