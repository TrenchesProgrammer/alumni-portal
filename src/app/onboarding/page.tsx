import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingWizard from '@/components/onboarding/wizard'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // If the user already has a bio and some tech stacks, maybe they are already onboarded, 
  // but we won't strictly block them from this page just in case they want to complete it.
  
  // Fetch all tech stacks
  const { data: techStacks } = await supabase
    .from('tech_stacks')
    .select('*')
    .order('name')

  // Fetch current user tech stacks (likely empty if new)
  const { data: userTechStacks } = await supabase
    .from('user_tech_stacks')
    .select('tech_id')
    .eq('user_id', user.id)
    
  const userTechIds = userTechStacks?.map(t => t.tech_id) || []

  return (
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-background rounded-xl border shadow-lg overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <h1 className="text-2xl font-bold text-primary text-center">Complete Your Profile</h1>
          <p className="text-muted-foreground text-center mt-2">
            Let's get you set up so we can match you with the right people.
          </p>
        </div>
        <div className="p-6">
          <OnboardingWizard 
            userProfile={profile} 
            allTechStacks={techStacks || []} 
            userTechIds={userTechIds} 
          />
        </div>
      </div>
    </div>
  )
}
