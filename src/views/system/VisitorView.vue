<script setup>
import { ref, watch } from 'vue'

// Theme setup
const theme = ref(localStorage.getItem('theme') ?? 'Light')

// Function to toggle theme
function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

// Student data (mock data for demonstration)
const studentsData = [
  { id: '221-00598', name: 'May Estroga', violations: 'None', dateRecorded: '2024-01-15' },
  { id: '221-00599', name: 'Hershey Doria', violations: 'Late submission', dateRecorded: '2024-01-20' },
  { id: '221-00600', name: 'Rovannah Delola', violations: 'Absent', dateRecorded: '2024-02-05' },
]

const studentID = ref('') // The student's ID input
const studentRecords = ref([]) // To store records for the student

// Function to handle ID input when Enter button is clicked
function handleEnterClick() {
  // Find the student by ID
  const student = studentsData.find(s => s.id === studentID.value)
  if (student) {
    // Store the student's records
    studentRecords.value = [
      { id: student.id, name: student.name, violations: student.violations, dateRecorded: student.dateRecorded }
    ]
  } else {
    studentRecords.value = [] // Reset records if no student found
  }
}

// Watch the studentID and clear records when input is cleared (X button clicked)
watch(studentID, (newValue) => {
  if (!newValue) {
    studentRecords.value = [] // Clear the records when search input is empty
  }
})
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar class="px-3"
      :color="theme === 'light' ? 'green-lighten-1' : 'green-darken-3'"
      border
    >
      <!-- Align Visitor Page text and Toggle Theme button in the same row -->
      <v-row align="center" class="flex-grow-1">
        <!-- Visitor Page text -->
        <v-col class="text-start">
          <h1>Visitor Page</h1>
        </v-col>

        <!-- Spacer to push Toggle Theme button to the right -->
        <v-spacer></v-spacer>

        <!-- Toggle Theme button -->
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-row>
    </v-app-bar>

    <v-container>
      <div class="text-center mt-4">
        <p>Please enter your student ID number below.</p>
      </div>

      <!-- Search bar for Student ID with Enter button inside -->
      <v-text-field
        v-model="studentID"
        label="Enter your Student ID"
        clearable
        class="mt-4"
      >
        <template v-slot:append>
          <v-btn @click="handleEnterClick" color="primary">
            Enter <!-- Display the word "Enter" -->
          </v-btn>
        </template>
      </v-text-field>

      <!-- Display student records in a table -->
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
    </v-container>

    <!-- Footer with centered text -->
    <v-footer app class="px-3" :color="theme === 'light' ? 'green-lighten-1' : 'green-darken-3'">
      <v-row>
        <v-col class="text-center">© 2024 - Student Violations</v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
