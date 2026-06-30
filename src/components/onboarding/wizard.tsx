'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/dashboard/profile-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

export default function OnboardingWizard({ userProfile, allTechStacks, userTechIds }: any) {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep(s => Math.min(s + 1, 3))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  return (
    <form action={updateProfile} className="space-y-6">
      <input type="hidden" name="source" value="onboarding" />
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
          <span className="text-sm font-medium hidden sm:block">Basic Info</span>
        </div>
        <div className="h-px bg-border flex-1 mx-4"></div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
          <span className="text-sm font-medium hidden sm:block">Tech Stack</span>
        </div>
        <div className="h-px bg-border flex-1 mx-4"></div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
          <span className="text-sm font-medium hidden sm:block">Finish</span>
        </div>
      </div>

      {/* STEP 1: Basic Info */}
      <div className={step === 1 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea key={userProfile.bio || 'bio'} id="bio" name="bio" defaultValue={userProfile.bio || ''} placeholder="Tell us about your background and interests..." className="bg-background min-h-[120px]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL (Optional)</Label>
              <Input key={userProfile.github_url || 'github'} id="github_url" name="github_url" type="url" defaultValue={userProfile.github_url || ''} placeholder="https://github.com/yourusername" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL (Optional)</Label>
              <Input key={userProfile.linkedin_url || 'linkedin'} id="linkedin_url" name="linkedin_url" type="url" defaultValue={userProfile.linkedin_url || ''} placeholder="https://linkedin.com/in/yourusername" className="bg-background" />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: Tech Stacks */}
      <div className={step === 2 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
        <div className="space-y-3">
          <Label>Select your Tech Stacks & Interests</Label>
          <p className="text-sm text-muted-foreground mb-4">This helps our smart matching algorithm connect you with the right mentors or mentees.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20 max-h-[300px] overflow-y-auto">
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

      {/* STEP 3: Finish */}
      <div className={step === 3 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">You're all set!</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Your profile looks great. Submit now to join the Alumni Portal. Note that your account will be pending manual approval by an administrator before you gain full access.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
          disabled={step === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {step < 3 ? (
          <Button type="button" onClick={nextStep}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button type="submit" className="shadow-md">
            Complete Profile
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </form>
  )
}
