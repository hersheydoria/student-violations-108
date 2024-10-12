<script setup>
import { ref } from 'vue';

// Reactive variables
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
</script>

<template>
    <v-app>
      <v-container>
        <!-- Navigation -->
        <v-toolbar color="indigo" dark>
          <v-toolbar-title>Violation Management</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="showForm = true" color="pink">Add</v-btn>
        </v-toolbar>
  
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
    </v-app>
  </template>

  
  <style scoped>
  .violations-table {
    margin-top: 20px;
  }
  </style>
  