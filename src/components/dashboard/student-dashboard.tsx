import { createClient } from '@/utils/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileForm from './profile-form'
import AlumniDirectory from './alumni-directory'
import MentorshipRequests from './mentorship-requests'
import JobBoard from './job-board'

export default async function StudentDashboard({ user }: { user: any }) {
  const supabase = await createClient()

  const { data: allTechStacks } = await supabase.from('tech_stacks').select('*').order('name')
  const { data: userTechStacks } = await supabase.from('user_tech_stacks').select('tech_id').eq('user_id', user.id)
  const userTechIds = userTechStacks?.map(t => t.tech_id) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
      </div>
      
      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList className="bg-muted/50 border">
          <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="jobs">Job Board</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="space-y-4">
          <AlumniDirectory currentUserId={user.id} userTechIds={userTechIds} />
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <MentorshipRequests currentUserId={user.id} role="student" />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <JobBoard />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm userProfile={user} allTechStacks={allTechStacks || []} userTechIds={userTechIds} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
