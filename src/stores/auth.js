import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xmsncfnqrihsbbeljjfp.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc25jZm5xcmloc2JiZWxqamZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODA5ODU0MSwiZXhwIjoyMDQzNjc0NTQxfQ.fM4fI7DZCZt9rVG9469M8aiKZja_5Pdzfx-y5rQkZ_4'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const guardsInfo = async () => {
  const guards = [
    {
      id_number: '123-456',
      email: 'hershey.doria+1@carsu.edu.ph',
      password: 'hershey',
      first_name: 'John',
      last_name: 'Doe',
      role: 'Guard'
    },
    {
      id_number: '234-567',
      email: 'may.estroga+2@carsu.edu.ph',
      password: 'estroga',
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'Guard'
    },
    {
      id_number: '345-678',
      email: 'rovannah.delola+3@carsu.edu.ph',
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

      console.log('User created:', authData.user.id)

      // Step 2: Sign in the user to establish a session
      const {
        user,
        session,
        error: signInError
      } = await supabase.auth.signIn({
        email: guard.email,
        password: guard.password
      })

      if (signInError) {
        console.error('Error signing in user:', signInError.message)
        continue // Skip to the next guard if there's an error
      }

      // Step 3: Update user metadata in auth.users
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
