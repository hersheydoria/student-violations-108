<script setup>
import AppLayout from '@/components/layout/AppLayout.vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// Router setup to navigate to login page
const router = useRouter();

// Function to handle Log In button click
const goToLogin = () => {
  router.push('/login'); // Assuming '/login' is the route for your login page
};

// Student data (mock data for demonstration)
const studentsData = [
  { id: '221-00598', name: 'May Estroga', violation: 'Dress Code', dateRecorded: '2024-10-15' },
  { id: '221-00598', name: 'May Estroga', violation: 'None Wearing ID', dateRecorded: '2024-10-16' },
  { id: '221-00599', name: 'Hershey Doria', violation: 'Late submission', dateRecorded: '2024-01-20' },
  { id: '221-00600', name: 'Rovannah Delola', violation: 'Absent', dateRecorded: '2024-02-05' }
];

const studentID = ref(''); // The student's ID input
const studentRecords = ref([]); // To store records for the student
const historyModalVisible = ref(false); // Control visibility of the history modal
const selectedStudent = ref(null); // To store the selected student

// Function to handle ID input when Enter button is clicked
function handleEnterClick() {
  const student = studentsData.filter(s => s.id === studentID.value);
  studentRecords.value = student.length > 0 ? student : [];
}

// Function to open the history modal
function showHistory(record) {
  selectedStudent.value = record;
  historyModalVisible.value = true;
}

// Function to close the modal
const closeModal = () => {
  historyModalVisible.value = false; // Just hide the modal, do not clear studentRecords
};

// Watch for changes in studentID and clear studentRecords if empty
watch(studentID, (newVal) => {
  if (!newVal) {
    studentRecords.value = []; // Clear records when input is cleared
  }
});
</script>

<template>
  <v-app>
    <AppLayout>
      <v-app-bar class="px-3" color="#e6ffb1">
        <v-toolbar-title style="color: black;">Visitor Page</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text style="color: black; border: 2px solid green;" @click="goToLogin">Log In</v-btn>
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
            <v-btn @click="handleEnterClick" color="#286643" style="color: white; border: 2px solid #E6FFB1;">
              Enter
            </v-btn>
          </template>
        </v-text-field>

        <!-- Table for student records with light yellow background, green border, shadow, and elevation -->
        <v-table v-if="studentRecords.length > 0" class="mt-4" style="background-color: #E6FFB1; border: 1px solid #5ea34f; border-collapse: collapse; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); border-radius: 8px;">
          <thead>
            <tr>
              <th style="color: black; padding: 8px; border: 1px solid green; font-weight: bold; font-size: 16px; text-align: center;">Student ID</th>
              <th style="color: black; padding: 8px; border: 1px solid green; font-weight: bold; font-size: 16px; text-align: center;">Name</th>
              <th style="color: black; padding: 8px; border: 1px solid green; font-weight: bold; font-size: 16px; text-align: center;">Violations</th>
              <th style="color: black; padding: 8px; border: 1px solid green; font-weight: bold; font-size: 16px; text-align: center;">Date Recorded</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in studentRecords" :key="record.id + record.violation">
              <td style="color: black; padding: 8px; border: 1px solid green; font-size: 16px; text-align: center;">{{ record.id }}</td>
              <td style="color: black; padding: 8px; border: 1px solid green; font-size: 16px; text-align: center;">{{ record.name }}</td>
              <td style="color: black; padding: 8px; border: 1px solid green; font-size: 16px; text-align: center;">{{ record.violation }}</td>
              <td style="color: black; padding: 8px; border: 1px solid green; font-size: 16px; text-align: center;">{{ record.dateRecorded }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- View History Button -->
        <v-btn
          v-if="studentRecords.length > 0"
          @click="showHistory(studentRecords[0])"
          color="#286643"
          class="mt-16"
          style="color: white; border: 2px solid #E6FFB1;"
        >
          View History
        </v-btn>
      </v-container>

      <!-- History Modal -->
      <v-dialog v-model="historyModalVisible" max-width="600px">
        <v-card>
          <v-card-title style="color: green;">{{ selectedStudent?.name }}'s Record History</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th style="color: green; border: 1px solid green; font-weight: bold; font-size: 16px; text-align: center;">Violation</th>
                  <th style="color: green; border: 1px solid green; font-weight: bold; font-size: 16px; text-align: center;">Date Recorded</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="color: green; border: 1px solid green; font-weight: bold; font-size: 16px;">{{ selectedStudent?.violation }}</td>
                  <td style="color: green; border: 1px solid green; font-weight: bold; font-size: 16px;">{{ selectedStudent?.dateRecorded }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeModal" color="grey" style="color: white;">Close</v-btn> <!-- Use closeModal here -->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </AppLayout>
  </v-app>
</template>
