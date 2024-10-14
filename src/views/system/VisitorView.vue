<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'; 
import AppLayout from '@/components/layout/AppLayout.vue'

// Theme setup
const theme = ref(localStorage.getItem('theme') ?? 'light');

// Theme toggle function
const onClick = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
};

// Router setup
const router = useRouter();

// Function to handle Log In button click
const goToLogin = () => {
  router.push('/login');
};

// Student data (mock)
const studentsData = [
  { id: '221-00598', name: 'May Estroga', violations: 'Dress Code', dateRecorded: '2024-10-15' },
  { id: '221-00599', name: 'Hershey Doria', violations: 'Late submission', dateRecorded: '2024-01-20' },
  { id: '221-00600', name: 'Rovannah Delola', violations: 'Absent', dateRecorded: '2024-02-05' },
];

const studentID = ref('');
const studentRecords = ref([]);
const historyModalVisible = ref(false);
const selectedStudent = ref(null);

// Function to handle ID input when Enter button is clicked
function handleEnterClick() {
  const student = studentsData.find(s => s.id === studentID.value);
  studentRecords.value = student ? [student] : [];
}

// Function to open the history modal
function showHistory(record) {
  selectedStudent.value = record;
  historyModalVisible.value = true;
}

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
    <!-- AppLayout likely already includes a footer, no need to add another one here -->
    <AppLayout>
      <v-app-bar class="px-3" :color="theme === 'light' ? 'green lighten-1' : 'green darken-3'">
        <v-toolbar-title>Visitor Page</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="goToLogin">Log In</v-btn>
        <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="onClick"></v-btn>
      </v-app-bar>

      <!-- Container for main content and background color consistency -->
      <v-container style="min-height: 80vh" :style="{ backgroundColor: theme === 'light' ? '#e8f5e9' : '#1b5e20' }">
        <div class="mt-16">
          <p class="text-start">Enter your student ID number</p>
        </div>
        <v-text-field v-model="studentID" label="ID Number" clearable class="mt-4">
          <template v-slot:append>
            <v-btn @click="handleEnterClick" color="primary">Enter</v-btn>
          </template>
        </v-text-field>

        <v-table v-if="studentRecords.length > 0" class="mt-4">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Violations</th>
              <th>Date Recorded</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in studentRecords" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.name }}</td>
              <td>{{ record.violations }}</td>
              <td>{{ record.dateRecorded }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-btn v-if="studentRecords.length > 0" @click="showHistory(studentRecords[0])" color="blue" class="mt-4">View History</v-btn>
      </v-container>

      <v-dialog v-model="historyModalVisible" max-width="600px">
        <v-card>
          <v-card-title>{{ selectedStudent?.name }}'s Record History</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Violation</th>
                  <th>Date Recorded</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ selectedStudent?.violations }}</td>
                  <td>{{ selectedStudent?.dateRecorded }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="historyModalVisible = false" color="grey">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- No footer here to avoid duplication -->
    </AppLayout>
  </v-app>
</template>
