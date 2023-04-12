import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase

// TODO: add your queries/inserts/updates/deletes here
export const todos = {
  async all() {
    const { data } = await supabase
      .from('todos')
      .select('*')

    return data
  }
}
