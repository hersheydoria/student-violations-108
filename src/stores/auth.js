import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-supabase-url'
const supabaseKey = 'your-supabase-key'
const supabase = createClient(supabaseUrl, supabaseKey)

export const actions = {
  async insertGuards({ commit }) {
    const guards = [
      {
        email: 'guard1@example.com',
        password: 'yourPassword1',
        first_name: 'John',
        last_name: 'Doe',
        role: 'Guard'
      },
      {
        email: 'guard2@example.com',
        password: 'yourPassword2',
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'Guard'
      },
      {
        email: 'guard3@example.com',
        password: 'yourPassword3',
        first_name: 'Alice',
        last_name: 'Johnson',
        role: 'Guard'
      }
    ]

    for (const guard of guards) {
      const { data, error } = await supabase.from('auth.users').insert([
        {
          email: guard.email,
          password: guard.password,
          first_name: guard.first_name,
          last_name: guard.last_name,
          role: guard.role
        }
      ])

      if (error) {
        console.error('Error inserting guard:', error.message)
      } else {
        console.log('Guard inserted successfully:', data)
      }
    }
  }
}
