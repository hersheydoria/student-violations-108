import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useViolationRecords() {
  const router = useRouter()

  // Reactive variables
  const showForm = ref(false)
  const showLeftSidebar = ref(false)
  const showViewHistory = ref(false)

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
      inputMethod.value === 'ID Number'
        ? newViolation.value.studentId
        : inputMethod.value === 'Name'
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

  return {
    showForm,
    showLeftSidebar,
    showViewHistory,
    inputMethod,
    newViolation,
    violations,
    history,
    headers,
    violationTypes,
    addViolation,
    unblockViolation,
    logout,
    toggleViewHistory,
    toggleLeftSidebar
  }
}
