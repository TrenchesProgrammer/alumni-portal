import { createClient } from '@/utils/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileForm from './profile-form'
import MentorshipRequests from './mentorship-requests'
import AlumniJobs from './alumni-jobs'

export default async function AlumniDashboard({ user }: { user: any }) {
  const supabase = await createClient()

  const { data: allTechStacks } = await supabase.from('tech_stacks').select('*').order('name')
  const { data: userTechStacks } = await supabase.from('user_tech_stacks').select('tech_id').eq('user_id', user.id)
  const userTechIds = userTechStacks?.map(t => t.tech_id) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold tracking-tight">Alumni Dashboard</h2>
      </div>
      
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="bg-muted/50 border">
          <TabsTrigger value="requests">Mentorship Requests</TabsTrigger>
          <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-4">
          <MentorshipRequests currentUserId={user.id} role="alumni" />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <AlumniJobs currentUserId={user.id} />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm userProfile={user} allTechStacks={allTechStacks || []} userTechIds={userTechIds} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
