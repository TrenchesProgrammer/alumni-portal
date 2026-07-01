'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendContactExchangeEmails } from '@/utils/mailer'

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
  
  // Fetch the request details to know who is involved
  const { data: request, error: fetchError } = await supabase
    .from('mentorship_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (fetchError || !request) {
    console.error("Error fetching request:", fetchError)
    throw new Error(fetchError?.message || "Request not found")
  }

  const { error } = await supabase
    .from('mentorship_requests')
    .update({ status })
    .eq('id', requestId)

  if (error) {
    console.error("Error updating request:", error)
    throw new Error(error.message)
  }

  if (status === 'accepted') {
    try {
      // Fetch both profiles securely
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', [request.student_id, request.alumni_id])

      const studentProfile = profiles?.find(p => p.id === request.student_id)
      const alumniProfile = profiles?.find(p => p.id === request.alumni_id)

      if (studentProfile && alumniProfile) {
        // Fetch emails via the Admin Client since they aren't in public.profiles
        const adminClient = createAdminClient()
        const [studentAuth, alumniAuth] = await Promise.all([
          adminClient.auth.admin.getUserById(request.student_id),
          adminClient.auth.admin.getUserById(request.alumni_id)
        ])

        if (studentAuth.data.user?.email && alumniAuth.data.user?.email) {
          const studentData = { ...studentProfile, email: studentAuth.data.user.email }
          const alumniData = { ...alumniProfile, email: alumniAuth.data.user.email }
          
          await sendContactExchangeEmails(studentData, alumniData)
        }
      }
    } catch (emailError) {
      console.error("Failed to process mentorship emails:", emailError)
      // We log but don't throw here to avoid failing the status update operation
    }
  }

  revalidatePath('/dashboard')
}
