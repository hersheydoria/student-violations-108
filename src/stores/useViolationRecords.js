/* eslint-env node */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import 'dotenv/config'

// Supabase API configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

export function useViolationRecords() {
  const router = useRouter()

  // Reactive variables
  const showForm = ref(false)
  const showLeftSidebar = ref(false)
  const showViewHistory = ref(false)
  const valid = ref(false)
  const selectedMethod = ref('idNumber')
  const showQrScanner = ref(false)
  const showStudentInfoModal = ref(false)
  const selectedStudent = ref({})
  const students = ref([])
  const violations = ref([])
  const history = ref([])

  const headers = [
    { text: 'Student ID', value: 'studentId' },
    { text: 'Violation Type', value: 'type' },
    { text: 'Date', value: 'date' },
    { text: 'Recorded By', value: 'recordedBy' },
    { text: 'Status', value: 'status' },
    { text: 'Action', value: 'action', sortable: false }
  ]

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

  const newViolation = ref({
    studentId: '',
    studentName: '',
    qrCode: '',
    type: ''
  })

  // Fetch students from Supabase
  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${SUPABASE_URL}/rest/v1/students`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      })
      students.value = data
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  // Fetch students on component mount
  onMounted(fetchStudents)

  const addViolation = async () => {
    const studentInfo =
      selectedMethod.value === 'idNumber'
        ? newViolation.value.studentId
        : selectedMethod.value === 'name'
          ? newViolation.value.studentName
          : newViolation.value.studentId

    if (!studentInfo || !newViolation.value.type) {
      alert('Please provide both Student Info and Violation Type.')
      return
    }

    const newViolationRecord = {
      student_id: studentInfo,
      violation_type: newViolation.value.type,
      violation_date: new Date().toISOString(),
      recorded_by: 'Guard', // Replace 'Guard' with actual user ID if available
      status: 'Blocked'
    }

    console.log('Violation Record Payload:', newViolationRecord) // Log payload

    try {
      const { data, error } = await axios.post(
        `${SUPABASE_URL}/rest/v1/student_violations`,
        newViolationRecord,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          }
        }
      )

      if (error) {
        console.error('Supabase Error Details:', error.response?.data) // Log error details
        alert('Failed to save the violation. Please try again.')
        return
      }

      violations.value.push(data[0])
      resetForm()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error details:', err.response?.data || err.message)
        alert('Failed to save the violation: ' + (err.response?.data.message || err.message))
      } else {
        console.error('Unexpected Error:', err)
        alert('An unexpected error occurred. Please try again.')
      }
    }
  }

  const resetForm = () => {
    newViolation.value.studentId = ''
    newViolation.value.studentName = ''
    newViolation.value.qrCode = ''
    newViolation.value.type = ''
    showForm.value = false
  }

  const fetchViolations = async () => {
    try {
      const { data } = await axios.get(`${SUPABASE_URL}/rest/v1/student_violations`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      })

      violations.value = data
    } catch (error) {
      console.error('Error fetching violations:', error)
      alert('Failed to fetch violations. Please try again.')
    }
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

  const normalizeId = (id) => id.replace(/-/g, '').trim()

  const findStudentByName = () => {
    const student = students.value.find(
      (student) => student.name === newViolation.value.studentName
    )
    if (student) {
      newViolation.value.studentId = normalizeId(student.id)
    } else {
      console.error('Student not found')
    }
  }

  const onNameInput = () => {
    findStudentByName()
  }

  const showStudentDetails = (studentId) => {
    const student = students.value.find((s) => normalizeId(s.id) === normalizeId(studentId))
    if (student) {
      selectedStudent.value = student
      showStudentInfoModal.value = true
    }
  }

  const onQrCodeScanned = (result) => {
    if (result) {
      console.log('QR Code Scanned Result:', result)
      newViolation.value.studentId = result
      showQrScanner.value = false
    }
  }

  const onError = (error) => {
    console.error('QR Code Scan Error:', error)
    alert('Failed to scan QR code. Please try again.')
  }

  return {
    showForm,
    showLeftSidebar,
    showViewHistory,
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
    onQrCodeScanned,
    onError,
    fetchViolations
  }
}
