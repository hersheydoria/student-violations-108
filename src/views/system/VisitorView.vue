<script setup>
import { ref } from 'vue'

// Theme setup
const theme = ref(localStorage.getItem('theme') ?? 'Light')

// Function to toggle theme
function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

// Student data (mock data for demonstration)
const studentsData = [
  { id: '221-00598', name: 'May Estroga', violations: 'Dress Code', dateRecorded: '2024-10-15' },
  { id: '221-00599', name: 'Hershey Doria', violations: 'Late submission', dateRecorded: '2024-01-20' },
  { id: '221-00600', name: 'Rovannah Delola', violations: 'Absent', dateRecorded: '2024-02-05' },
]

const studentID = ref('') // The student's ID input
const studentInfo = ref(null) // To store student details based on input
const studentRecords = ref([]) // To store records for the student

// Function to handle ID input
function handleIDInput() {
  // Find the student by ID
  const student = studentsData.find(s => s.id === studentID.value)
  if (student) {
    studentInfo.value = student.name
    // Here, you would fetch actual records related to the student
    studentRecords.value = [
      { id: student.id, name: student.name, violations: student.violations, dateRecorded: student.dateRecorded }
    ]
  } else {
    studentInfo.value = null // Reset if no student found
    studentRecords.value = [] // Reset records
  }
}
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar class="px-3">
      <v-spacer></v-spacer>
      <v-btn
        :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        text="Toggle Theme"
        slim
        @click="onClick"
      ></v-btn>
    </v-app-bar>

    <v-container>
      <div class="text-center mt-16">
        <h1>Visitor Page</h1>
        <p>Please enter your student ID number below.</p>
      </div>

      <!-- Search bar for Student ID -->
      <v-text-field
        v-model="studentID"
        label="Enter your Student ID"
        @input="handleIDInput"
        clearable
        class="mt-4"
      ></v-text-field>

      <!-- Display student name if found -->
      <div v-if="studentInfo" class="mt-4">
        <p>Welcome, student: {{ studentInfo }}</p>
      </div>

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
  </v-app>
</template>
