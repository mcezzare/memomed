"use client";

import { useState } from "react";
import { List, PlusCircle } from "lucide-react";
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
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

// A little hack to get the Zod schema type without a direct import
type MedicationFormValues = Parameters<ReturnType<typeof useMedications>['addMedication']>[0];


export default function Home() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { addMedication } = useMedications();

  const handleFormSubmit = (values: MedicationFormValues) => {
    addMedication(values);
    setIsAddDialogOpen(false);
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
                              <SidebarMenuButton href="#" isActive>
                                  <List />
                                  Current Treatments
                                  <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                              </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                              <div className="p-2 pl-4">
                                <MedicationList />
                              </div>
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
                <h1 className="text-xl font-bold font-headline text-foreground hidden md:block">Current Treatments</h1>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Medication
            </Button>
            </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
            <p className="text-center text-muted-foreground">Select a medication from the sidebar to see details or add a new one.</p>
        </main>
      </SidebarInset>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline">New Medication Schedule</DialogTitle>
            <DialogDescription>
              Enter the details of your medication to create a new schedule.
            </DialogDescription>
          </DialogHeader>
          <MedicationForm onSubmit={handleFormSubmit} onClose={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
