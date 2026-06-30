import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createJob, deleteJob } from '@/app/dashboard/job-actions'
import { Trash2 } from 'lucide-react'

export default async function AlumniJobs({ currentUserId }: { currentUserId: string }) {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('alumni_id', currentUserId)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
          <CardDescription>Share opportunities with students.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" required placeholder="Frontend Developer" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" required placeholder="Tech Corp Inc." className="bg-background" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link">Application Link (Optional)</Label>
                <Input id="link" name="link" type="url" placeholder="https://careers.company.com/job" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <select 
                  name="visibility" 
                  id="visibility" 
                  defaultValue="mentees_only"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="public">Public (All Students)</option>
                  <option value="mentees_only">Mentees Only</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required placeholder="Job description and requirements..." className="bg-background min-h-[100px]" />
            </div>
            <Button type="submit">Post Job</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Your Active Postings</h3>
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: any) => (
              <Card key={job.id} className="flex flex-col border-primary/20 shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </div>
                    {job.visibility === 'mentees_only' && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                        Mentees Only
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description}
                  </p>
                  {job.link && (
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      View Application Link &rarr;
                    </a>
                  )}
                </CardContent>
                <CardFooter>
                  <form action={deleteJob.bind(null, job.id)} className="w-full">
                    <Button type="submit" variant="destructive" className="w-full flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete Posting
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              You haven't posted any jobs yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
