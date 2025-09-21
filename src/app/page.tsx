"use client";

import { useState } from "react";
import { List, PlusCircle, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MedicationForm } from "@/components/medication-form";
import { MedicationList } from "@/components/medication-list";
import { useMedications } from "@/hooks/use-medications";
import { usePeople } from "@/hooks/use-people";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AddPersonForm } from "@/components/add-person-form";

type MedicationFormValues = Parameters<ReturnType<typeof useMedications>['addMedication']>[0];

export default function Home() {
  const [isAddMedDialogOpen, setIsAddMedDialogOpen] = useState(false);
  const [isAddPersonDialogOpen, setIsAddPersonDialogOpen] = useState(false);
  
  const { addMedication } = useMedications();
  const { people, addPerson, selectedPersonId, setSelectedPersonId } = usePeople();
  
  const selectedPerson = people.find(p => p.id === selectedPersonId);

  const handleMedicationFormSubmit = (values: MedicationFormValues) => {
    addMedication(values);
    setIsAddMedDialogOpen(false);
  };

  const handlePersonFormSubmit = (values: { name: string }) => {
    addPerson(values.name);
    setIsAddPersonDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                <h1 className="text-xl font-bold font-headline text-foreground">DoseWise</h1>
              </div>
            </SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="w-full">
                    <SidebarMenuButton>
                      <Users />
                      Profiles
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {people.map(person => (
                         <SidebarMenuSubButton 
                            key={person.id}
                            onClick={() => setSelectedPersonId(person.id)}
                            isActive={person.id === selectedPersonId}
                         >
                            {person.name}
                         </SidebarMenuSubButton>
                      ))}
                      <SidebarMenuSubButton onClick={() => setIsAddPersonDialogOpen(true)} className="mt-1 text-primary hover:text-primary">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Profile
                      </SidebarMenuSubButton>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-bold font-headline text-foreground hidden md:block">
                {selectedPerson ? `${selectedPerson.name}'s Treatments` : "All Treatments"}
              </h1>
            </div>
            <Button onClick={() => setIsAddMedDialogOpen(true)} disabled={people.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          {people.length === 0 ? (
            <div className="text-center text-muted-foreground pt-10">
                <Users className="mx-auto h-12 w-12 opacity-50 mb-4" />
                <h2 className="text-xl font-semibold">Welcome to DoseWise!</h2>
                <p>Start by adding a profile for yourself or a family member.</p>
                <Button className="mt-4" onClick={() => setIsAddPersonDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Profile
                </Button>
            </div>
          ) : (
            <MedicationList selectedPersonId={selectedPersonId} />
          )}
        </main>
      </SidebarInset>

      <Dialog open={isAddMedDialogOpen} onOpenChange={setIsAddMedDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline">New Medication Schedule</DialogTitle>
            <DialogDescription>
              Enter the details of the medication to create a new schedule.
            </DialogDescription>
          </DialogHeader>
          <MedicationForm 
            people={people} 
            selectedPersonId={selectedPersonId}
            onSubmit={handleMedicationFormSubmit} 
            onClose={() => setIsAddMedDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddPersonDialogOpen} onOpenChange={setIsAddPersonDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Profile</DialogTitle>
            <DialogDescription>
              Who is this medication schedule for?
            </DialogDescription>
          </DialogHeader>
          <AddPersonForm 
            onSubmit={handlePersonFormSubmit} 
            onClose={() => setIsAddPersonDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
