import { updateProfile } from '@/app/dashboard/profile-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfileForm({ userProfile, allTechStacks, userTechIds }: any) {
  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Update your personal information and tech stacks.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateProfile} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea key={userProfile.bio || 'bio'} id="bio" name="bio" defaultValue={userProfile.bio || ''} placeholder="Tell us about yourself..." className="bg-background" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input key={userProfile.github_url || 'github'} id="github_url" name="github_url" type="url" defaultValue={userProfile.github_url || ''} placeholder="https://github.com/yourusername" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input key={userProfile.linkedin_url || 'linkedin'} id="linkedin_url" name="linkedin_url" type="url" defaultValue={userProfile.linkedin_url || ''} placeholder="https://linkedin.com/in/yourusername" className="bg-background" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label>Tech Stacks & Interests</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
                {allTechStacks.map((tech: any) => (
                  <div key={tech.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tech-${tech.id}`} 
                      name="tech_ids" 
                      value={tech.id} 
                      defaultChecked={userTechIds.includes(tech.id)} 
                    />
                    <label 
                      htmlFor={`tech-${tech.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {tech.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full sm:w-auto shadow-md">Save Profile</Button>
        </form>
      </CardContent>
    </Card>
  )
}
