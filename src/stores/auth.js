import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xmsncfnqrihsbbeljjfp.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc25jZm5xcmloc2JiZWxqamZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwOTg1NDEsImV4cCI6MjA0MzY3NDU0MX0.x5gbs9Pl4NN371dJUwanApAal64YuWjV9gpUFkyqGtg'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const guardsInfo = async () => {
  const guards = [
    {
      id_number: '123-456',
      email: 'hershey.doria@carsu.edu.ph',
      password: 'hershey',
      first_name: 'John',
      last_name: 'Doe',
      role: 'Guard'
    },
    {
      id_number: '234-567',
      email: 'may.estroga@carsu.edu.ph',
      password: 'estroga',
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'Guard'
    },
    {
      id_number: '345-678',
      email: 'rovannah.delola@carsu.edu.ph',
      password: 'rovannah',
      first_name: 'Alice',
      last_name: 'Johnson',
      role: 'Guard'
    }
  ]

  for (const guard of guards) {
    try {
      // Step 1: Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: guard.email,
        password: guard.password
      })

      if (authError) {
        console.error('Error creating user:', authError.message)
        continue // Skip to the next guard if there's an error
      }

      // Step 2: Update user metadata in auth.users
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          id_number: guard.id_number,
          first_name: guard.first_name,
          last_name: guard.last_name,
          role: guard.role
        }
      })

      if (metadataError) {
        console.error('Error updating user metadata:', metadataError.message)
      } else {
        console.log('Guard profile created successfully:', authData.user.id)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }
}
