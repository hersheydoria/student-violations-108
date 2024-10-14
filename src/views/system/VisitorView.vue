<script setup>
import AppLayout from '@/components/layout/AppLayout.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Router setup to navigate to login page
const router = useRouter();

// Function to handle Log In button click
const goToLogin = () => {
  router.push('/login'); // Assuming '/login' is the route for your login page
};

// Student data (mock data for demonstration)
const studentsData = [
  { id: '221-00598', name: 'May Estroga', violations: 'Dress Code', dateRecorded: '2024-10-15' },
  { id: '221-00599', name: 'Hershey Doria', violations: 'Late submission', dateRecorded: '2024-01-20' },
  { id: '221-00600', name: 'Rovannah Delola', violations: 'Absent', dateRecorded: '2024-02-05' }
];

const studentID = ref(''); // The student's ID input
const studentRecords = ref([]); // To store records for the student
const historyModalVisible = ref(false); // Control visibility of the history modal
const selectedStudent = ref(null); // To store the selected student

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
</script>

<template>
  <v-app>
    <AppLayout>
      <v-app-bar class="px-3" color="green lighten-1">
        <v-toolbar-title style="color: white;">Visitor Page</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text style="color: white;" @click="goToLogin">Log In</v-btn>
      </v-app-bar>

      <v-container>
        <div class="mt-16">
          <p style="color: white;">Enter your student ID number</p>
        </div>

        <v-text-field
          v-model="studentID"
          label="ID Number"
          clearable
          class="mt-4"
          style="color: white;"
        >
          <template v-slot:append>
            <v-btn @click="handleEnterClick" color="green" style="color: white;">
              Enter
            </v-btn>
          </template>
        </v-text-field>

        <!-- Transparent table for student records with white border -->
        <v-table
          v-if="studentRecords.length > 0"
          class="mt-4"
          style="background-color: rgba(0, 0, 0, 0); color: white; border: 1px solid white; border-collapse: collapse;"
        >
          <thead>
            <tr>
              <th style="color: white; padding: 8px; border: 1px solid white; font-weight: bold; font-size: 16px; text-align: center;">Student ID</th>
              <th style="color: white; padding: 8px; border: 1px solid white; font-weight: bold; font-size: 16px; text-align: center;">Name</th>
              <th style="color: white; padding: 8px; border: 1px solid white; font-weight: bold; font-size: 16px; text-align: center;">Violations</th>
              <th style="color: white; padding: 8px; border: 1px solid white; font-weight: bold; font-size: 16px; text-align: center;">Date Recorded</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in studentRecords" :key="record.id">
              <td style="color: white; padding: 8px; border: 1px solid white; font-size: 16px; text-align: center;">{{ record.id }}</td>
              <td style="color: white; padding: 8px; border: 1px solid white; font-size: 16px; text-align: center;">{{ record.name }}</td>
              <td style="color: white; padding: 8px; border: 1px solid white; font-size: 16px; text-align: center;">{{ record.violations }}</td>
              <td style="color: white; padding: 8px; border: 1px solid white; font-size: 16px; text-align: center;">{{ record.dateRecorded }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- View History Button -->
        <v-btn
          v-if="studentRecords.length > 0"
          @click="showHistory(studentRecords[0])"
          color="green"
          class="mt-4"
          style="color: white;"
        >
          View History
        </v-btn>
      </v-container>

      <!-- History Modal -->
      <v-dialog v-model="historyModalVisible" max-width="600px">
        <v-card>
          <v-card-title style="color: white;">{{ selectedStudent?.name }}'s Record History</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th style="color: white; border: 1px solid white; font-weight: bold; font-size: 16px; text-align: center;">Violation</th>
                  <th style="color: white; border: 1px solid white; font-weight: bold; font-size: 16px; text-align: center;">Date Recorded</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="color: white; border: 1px solid white; font-weight: bold; font-size: 16px;">{{ selectedStudent?.violations }}</td>
                  <td style="color: white; border: 1px solid white; font-weight: bold; font-size: 16px;">{{ selectedStudent?.dateRecorded }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="historyModalVisible = false" color="grey" style="color: white;">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </AppLayout>
  </v-app>
</template>
