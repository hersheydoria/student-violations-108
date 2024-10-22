import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { QrcodeStream } from 'vue3-qrcode-reader'

export function useViolationRecords() {
  const router = useRouter()

  // Reactive variables
  const showForm = ref(false)
  const showLeftSidebar = ref(false)
  const showViewHistory = ref(false)
  const valid = ref(false)
  const selectedMethod = ref('idNumber')
  const showQrScanner = ref(false)

  // State for controlling the student info modal
  const showStudentInfoModal = ref(false)
  const selectedStudent = ref({})

  // Predefined student details (replace with API call if needed)
  const students = [
    {
      id: '123',
      name: 'John Doe',
      picture: 'hershey.jpeg',
      address: '1234 Elm Street',
      birthday: '2000-01-01',
      programYear: 'BS Computer Science, 3rd Year'
    }
    // Add more student objects as needed
  ]

  // State for selecting input method (ID, Name, or QR code)
  const inputMethod = ref('ID Number')

  // Violation form data
  const newViolation = ref({
    studentId: '',
    studentName: '',
    qrCode: '',
    type: ''
  })

  const violations = ref([]) // Current violation data
  const history = ref([]) // History of violations
  const headers = [
    { text: 'Student ID', value: 'studentId' },
    { text: 'Violation Type', value: 'type' },
    { text: 'Date', value: 'date' },
    { text: 'Recorded By', value: 'recordedBy' },
    { text: 'Status', value: 'status' },
    { text: 'Action', value: 'action', sortable: false }
  ]

  // Alphabetically sorted violation types
  const violationTypes = [
    'Abuse Code Ceremony',
    'Blocking Publication',
    'Bribery Receiving Bribe',
    'Disregard Code Conduct',
    'Disruption Obstruction',
    'Dress Code',
    'Gambling',
    'Having Abusive Affiliation',
    'Ignoring Flag Ceremony',
    'Not Wearing ID',
    'Violating Policies'
  ]

  // Methods
  const addViolation = () => {
    const studentInfo =
      selectedMethod.value === 'idNumber'
        ? newViolation.value.studentId
        : selectedMethod.value === 'name'
          ? newViolation.value.studentName
          : newViolation.value.qrCode

    violations.value.push({
      id: violations.value.length + 1,
      studentId: studentInfo,
      type: newViolation.value.type,
      date: new Date().toLocaleDateString(),
      recordedBy: 'Guard',
      status: 'Blocked'
    })
    resetForm()
  }

  const resetForm = () => {
    newViolation.value.studentId = ''
    newViolation.value.studentName = ''
    newViolation.value.qrCode = ''
    newViolation.value.type = ''
    showForm.value = false
  }

  const unblockViolation = (violationId) => {
    const index = violations.value.findIndex((v) => v.id === violationId)
    if (index !== -1) {
      const unblockedViolation = violations.value[index]
      unblockedViolation.status = 'Unblocked'
      history.value.push(unblockedViolation)
      violations.value.splice(index, 1)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    router.push('/login')
  }

  const toggleViewHistory = () => {
    showViewHistory.value = !showViewHistory.value
  }

  const toggleLeftSidebar = () => {
    showLeftSidebar.value = !showLeftSidebar.value
  }

  // Find student by name and update the violation record with the corresponding ID
  const findStudentByName = () => {
    const student = students.find((student) => student.name === newViolation.value.studentName)
    if (student) {
      newViolation.value.studentId = student.id // Set the student ID based on the name
    } else {
      console.error('Student not found')
    }
  }

  const onNameInput = () => {
    findStudentByName() // Update the student ID based on the entered name
  }

  // Function to show student details when an ID is clicked
  const showStudentDetails = (studentId) => {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      selectedStudent.value = student
      showStudentInfoModal.value = true
    }
  }

  // QR Code Scanning Logic
  const onQrCodeScanned = (result) => {
    if (result) {
      newViolation.value.studentId = result // Assuming the QR code contains the student ID
      showQrScanner.value = false // Close the QR code scanner modal after scanning
    }
  }

  return {
    showForm,
    showLeftSidebar,
    showViewHistory,
    inputMethod,
    valid,
    selectedMethod,
    showQrScanner,
    showStudentInfoModal,
    selectedStudent,
    newViolation,
    violations,
    history,
    headers,
    violationTypes,
    addViolation,
    resetForm,
    unblockViolation,
    logout,
    toggleViewHistory,
    toggleLeftSidebar,
    findStudentByName,
    onNameInput,
    showStudentDetails,
    onQrCodeScanned
  }
}
