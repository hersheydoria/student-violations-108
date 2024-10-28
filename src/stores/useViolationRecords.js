import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

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
  const user = ref(null)

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

  const loading = ref(false)

  const fetchStudents = async () => {
    loading.value = true
    try {
      const { data } = await axios.get(`${SUPABASE_URL}/rest/v1/students`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      })

      // Assuming `data` is an array of students from Supabase
      students.value = data.map((student) => ({
        fullname: `${student.first_name} ${student.last_name}`,
        idNumber: student.student_number,
        date: student.created_at,
        address: student.adress,
        birthday: student.birthday
      }))

      console.log('Fetched students:', students.value) // Log the fetched data
    } catch (error) {
      console.error('Error fetching students:', error)
      alert('Failed to fetch students. Please try again.')
    } finally {
      loading.value = false
    }
  }

  // Getting User Information Functionality
  const getUser = async () => {
    const {
      data: {
        user: { user_metadata: metadata }
      }
    } = await supabase.auth.getUser()

    if (metadata) {
      user.value = {
        email: metadata.email,
        fullname: `${metadata.first_name} ${metadata.last_name}`,
        idNumber: metadata.id_number,
        role: metadata.role
      }
    }
  }

  // Fetch students and user data on component mount
  onMounted(() => {
    fetchStudents()
    getUser() // Call getUser on mount to fetch the authenticated user info
  })

  const addViolation = async () => {
    const studentInfo =
      selectedMethod.value === 'idNumber'
        ? newViolation.value.studentId
        : newViolation.value.studentName

    if (!studentInfo || !newViolation.value.type) {
      alert('Please provide both Student Info and Violation Type.')
      return
    }

    const guardId = user.value?.email || 'Unknown'
    if (!guardId) {
      alert('No user is currently signed in.')
      return
    }

    const newViolationRecord = {
      id: uuidv4(),
      student_id: studentInfo,
      violation_type: newViolation.value.type,
      violation_date: new Date().toISOString(),
      recorded_by: guardId,
      status: 'Blocked'
    }

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
        console.error('Supabase Error Details:', error.response?.data)
        alert('Failed to save the violation. Please try again.')
        return
      }

      violations.value.push(data[0])
      resetForm()
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message)
      alert('Failed to save the violation: ' + (err.response?.data.message || err.message))
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

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('authUser')
      user.value = null
      router.push('/login')
      alert('You have successfully logged out.')
    } catch (error) {
      console.error('Error during logout:', error)
      alert('Failed to log out. Please try again.')
    }
  }

  const toggleViewHistory = () => {
    showViewHistory.value = !showViewHistory.value
  }

  const toggleLeftSidebar = () => {
    showLeftSidebar.value = !showLeftSidebar.value
  }

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

  const normalizeId = (id) => {
    if (typeof id !== 'string') {
      console.warn('normalizeId received a non-string value:', id)
      return '' // Return an empty string or handle this case as needed
    }
    return id.replace(/-/g, '').trim()
  }

  const showStudentDetails = (studentId) => {
    console.log('Student ID passed to showStudentDetails:', studentId) // Log the received studentId
    if (!studentId) {
      console.warn('showStudentDetails called with an undefined or empty studentId')
      return
    }
    const normalizedId = normalizeId(studentId)
    const student = students.value.find((s) => normalizeId(s.id) === normalizedId)

    if (student) {
      selectedStudent.value = student
      showStudentInfoModal.value = true
    } else {
      console.warn('Student not found for ID:', normalizedId)
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
    user,
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
