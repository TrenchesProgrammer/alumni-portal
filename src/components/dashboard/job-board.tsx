import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function JobBoard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Fetch all jobs
  const { data: rawJobs } = await supabase
    .from('jobs')
    .select(`
      *,
      alumni:alumni_id(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  // Fetch accepted mentorships for current user (if any)
  const { data: mentorships } = await supabase
    .from('mentorship_requests')
    .select('alumni_id')
    .eq('student_id', currentUserId)
    .eq('status', 'accepted')

  const menteeAlumniIds = mentorships?.map(m => m.alumni_id) || []

  // Filter jobs securely
  const jobs = rawJobs?.filter((job: any) => {
    if (job.visibility === 'public') return true
    if (job.alumni_id === currentUserId) return true
    if (menteeAlumniIds.includes(job.alumni_id)) return true
    return false
  })

  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          No jobs posted yet. Check back later!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job: any) => (
        <Card key={job.id} className="flex flex-col border-primary/20 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback>{job.alumni?.full_name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div className="text-xs text-muted-foreground">
                  Posted by <span className="font-medium text-foreground">{job.alumni?.full_name}</span>
                </div>
              </div>
              {job.visibility === 'mentees_only' && (
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                  Exclusive
                </span>
              )}
            </div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription className="text-sm font-semibold">{job.company}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </p>
          </CardContent>
          {job.link && (
            <CardFooter>
              <a href={job.link} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline" }), "w-full flex items-center justify-center gap-2")}>
                Apply <ExternalLink className="w-4 h-4" />
              </a>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
