'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createJob(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const title = formData.get('title') as string
  const company = formData.get('company') as string
  const description = formData.get('description') as string
  const link = formData.get('link') as string
  const visibility = formData.get('visibility') as string || 'mentees_only'

  const { error } = await supabase
    .from('jobs')
    .insert({
      alumni_id: user.id,
      title,
      company,
      description,
      link,
      visibility
    })

  if (error) {
    console.error("Error creating job:", error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function deleteJob(jobId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)

  if (error) {
    console.error("Error deleting job:", error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
