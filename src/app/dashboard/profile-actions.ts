'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const bio = formData.get('bio') as string
  const github_url = formData.get('github_url') as string
  const linkedin_url = formData.get('linkedin_url') as string
  const tech_ids = formData.getAll('tech_ids') as string[]

  // Update profile
  await supabase
    .from('profiles')
    .update({ bio, github_url, linkedin_url })
    .eq('id', user.id)

  // Update tech stacks
  await supabase
    .from('user_tech_stacks')
    .delete()
    .eq('user_id', user.id)

  if (tech_ids.length > 0) {
    const techStackInserts = tech_ids.map(tech_id => ({ user_id: user.id, tech_id }))
    await supabase
      .from('user_tech_stacks')
      .insert(techStackInserts)
  }

  const source = formData.get('source') as string
  if (source === 'onboarding') {
    redirect('/dashboard')
  } else {
    revalidatePath('/dashboard')
  }
}
