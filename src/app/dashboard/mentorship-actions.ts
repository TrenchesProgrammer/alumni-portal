'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function requestMentorship(alumniId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from('mentorship_requests')
    .insert({
      student_id: user.id,
      alumni_id: alumniId,
      status: 'pending'
    })

  if (error) {
    console.error("Error requesting mentorship:", error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function updateMentorshipRequest(requestId: string, status: 'accepted' | 'rejected') {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('mentorship_requests')
    .update({ status })
    .eq('id', requestId)

  if (error) {
    console.error("Error updating request:", error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
