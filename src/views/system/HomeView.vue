<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useViolationRecords } from '@/stores/useViolationRecords'
import { ref } from 'vue'
import { QrcodeStream } from 'vue3-qrcode-reader'

const {
  showForm,
  showLeftSidebar,
  newViolation,
  violations,
  history,
  headers,
  violationTypes,
  addViolation,
  unblockViolation,
  logout,
  showViewHistory,
  toggleViewHistory,
  toggleLeftSidebar
} = useViolationRecords()

// Form validation state
const valid = ref(false)

// State for selecting the input method
const selectedMethod = ref('idNumber')

// State for controlling the visibility of the QR code scanner modal
const showQrScanner = ref(false)

// Placeholder user information (you may want to fetch this dynamically based on logged-in user data)
const user = {
  idNumber: '12345678',
  name: 'John Doe',
  email: 'johndoe@example.com',
  role: 'Security Guard'
}

// Function to handle QR code scanning result
const onQrCodeScanned = (result) => {
  if (result) {
    newViolation.value.studentId = result // Assuming the QR code contains the student ID
    showQrScanner.value = false // Close the QR code scanner modal after scanning
  }
}
</script>

<template>
  <v-app>
    <AppLayout>
      <v-app-bar class="px-3" style="background-color: #e6ffb1">
        <v-btn icon @click="toggleLeftSidebar">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-avatar size="50" class="mx-auto">
          <v-img src="logo6.png" alt="Logo" />
        </v-avatar>
        <v-toolbar-title>Home Page</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <!-- Left Sidebar -->
      <v-navigation-drawer
        v-model="showLeftSidebar"
        app
        width="256"
        mini-width="56"
        style="background-color: rgba(230, 255, 177, 0.7); backdrop-filter: blur(10px)"
      >
        <v-list>
          <v-list-item class="text-center">
            <v-avatar size="150" class="mx-auto">
              <v-img src="account.jpg" alt="Profile Picture" />
            </v-avatar>
          </v-list-item>
          <v-list-item>
            <p><strong>ID Number:</strong> {{ user.idNumber }}</p>
          </v-list-item>
          <v-list-item>
            <p><strong>Name:</strong> {{ user.name }}</p>
          </v-list-item>
          <v-list-item>
            <p><strong>Email:</strong> {{ user.email }}</p>
          </v-list-item>
          <v-list-item>
            <p><strong>Role:</strong> {{ user.role }}</p>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">Logout</v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container fluid>
          <v-row class="d-flex justify-end align-center">
            <v-col cols="auto">
              <v-btn
                @click="showForm = true"
                color="#286643"
                style="color: white; border: 2px solid #e6ffb1"
              >
                Add Violation
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                @click="toggleViewHistory"
                color="#286643"
                style="color: white; border: 2px solid #e6ffb1"
              >
                View History
              </v-btn>
            </v-col>
          </v-row>

          <!-- Violation Records Table -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="violations"
                item-value="id"
                class="mt-5"
                :footer-props="{ 'items-per-page-options': [] }"
                style="background-color: #e6ffb1"
              >
                <template #top>
                  <v-toolbar flat style="background-color: #e6ffb1">
                    <v-toolbar-title><strong>RECORDS</strong></v-toolbar-title>
                  </v-toolbar>
                </template>

                <template v-slot:item.action="{ item }">
                  <v-btn @click="unblockViolation(item.id)" color="green">UNBLOCK</v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <!-- Add Violation Modal -->
          <v-dialog
            v-model="showForm"
            max-width="600px"
            elevation="10"
            style="backdrop-filter: blur(8px)"
          >
            <v-card class="px-6 py-6" elevation="12" rounded="xl" style="background-color: #e6ffb1">
              <v-card-title class="headline"><strong>ADD VIOLATION</strong></v-card-title>
              <v-card-text>
                <v-form v-model="valid" lazy-validation>
                  <!-- Input method selection -->
                  <v-radio-group v-model="selectedMethod" label="Add Violation By">
                    <v-radio label="ID Number" value="idNumber" />
                    <v-radio label="Name" value="name" />
                    <v-radio label="QR Code" value="qrCode" />
                  </v-radio-group>

                  <!-- Conditionally show input fields based on selected method -->
                  <v-text-field
                    v-if="selectedMethod === 'idNumber'"
                    label="ID Number"
                    v-model="newViolation.studentId"
                    required
                    type="number"
                  ></v-text-field>

                  <v-text-field
                    v-if="selectedMethod === 'name'"
                    label="Name"
                    v-model="newViolation.name"
                    required
                  ></v-text-field>

                  <!-- QR Code Scanner button -->
                  <v-btn
                    v-if="selectedMethod === 'qrCode'"
                    @click="showQrScanner = true"
                    color="#286643"
                    style="color: white; border: 2px solid #e6ffb1; margin-bottom: 10px"
                  >
                    Open QR Code Scanner
                  </v-btn>

                  <!-- Violation Type Select -->
                  <v-select
                    label="Violation Type"
                    v-model="newViolation.type"
                    :items="violationTypes"
                    required
                  ></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="showForm = false" color="grey">Cancel</v-btn>
                <v-btn @click="addViolation" :disabled="!valid" color="customGreen">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- QR Code Scanner Modal -->
          <v-dialog v-model="showQrScanner" max-width="600px">
            <v-card>
              <v-card-title>Scan QR Code</v-card-title>
              <v-card-text>
                <QrcodeStream @decode="onQrCodeScanned" @init="onInit" @error="onError" />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="showQrScanner = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- View History Modal -->
          <v-dialog
            v-model="showViewHistory"
            max-width="600px"
            elevation="10"
            style="backdrop-filter: blur(8px)"
          >
            <v-card class="px-6 py-6" elevation="12" rounded="xl" style="background-color: #e6ffb1">
              <v-card-title class="headline"><strong>HISTORY</strong></v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="history"
                  item-value="id"
                  class="mt-5"
                  :footer-props="{ 'items-per-page-options': [] }"
                  style="background-color: transparent"
                >
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="showViewHistory = false" color="customGreen">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </AppLayout>
  </v-app>
</template>
