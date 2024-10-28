/* eslint-env node */
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import 'dotenv/config'

// Initialize Supabase client
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

const apiURL = 'https://fakerapi.it/api/v2/persons?_quantity=10'

// Predefined student numbers for the first three students
const predefinedStudentNumbers = ['221-00414', '221-00598', '221-01275']

// Function to generate a random student number
const generateRandomStudentNumber = () => {
  const year = 221
  const number = Math.floor(10000 + Math.random() * 90000)
  return `${year}-${number}`
}

async function populateStudents() {
  try {
    const response = await axios.get(apiURL)
    const data = response.data.data

    const studentsData = data.map((student, index) => ({
      id: uuidv4(), // Generate a unique UUID for each student
      first_name: student.firstname,
      last_name: student.lastname,
      student_number: index < 3 ? predefinedStudentNumbers[index] : generateRandomStudentNumber(),
      address: student.address.street,
      birthday: student.birthday
    }))

    const { data: insertedData, error } = await supabase.from('students').insert(studentsData)

    if (error) {
      console.error('Error inserting data:', error)
    } else {
      console.log('Successfully inserted data:', insertedData)
    }
  } catch (error) {
    console.error('Error fetching data from FakerAPI:', error)
  }
}

// Run the function
populateStudents()
