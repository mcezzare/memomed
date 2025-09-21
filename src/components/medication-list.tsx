"use client";

import { useMedications } from "@/hooks/use-medications";
import { MedicationCard } from "./medication-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import type { Person } from "@/lib/types";

type MedicationListProps = {
    selectedPersonId?: string;
}


export function MedicationList({ selectedPersonId }: MedicationListProps) {
  const { medications, isLoading, toggleDose } = useMedications();
  const emptyStateImage = PlaceHolderImages.find(img => img.id === 'meds-empty-state');

  const filteredMedications = selectedPersonId ? medications.filter(m => m.personId === selectedPersonId) : medications;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (filteredMedications.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
        {emptyStateImage && 
            <Image 
                src={emptyStateImage.imageUrl} 
                alt={emptyStateImage.description} 
                width={80} 
                height={80} 
                className="mx-auto rounded-full mb-4 opacity-70" 
                data-ai-hint={emptyStateImage.imageHint} 
            />
        }
        <h3 className="text-lg font-headline font-semibold">No Medications</h3>
        <p className="text-muted-foreground text-sm mt-1">Click "Add Medication" to start.</p>
      </div>
    );
  }

  const sortedMedications = [...filteredMedications].sort((a, b) => {
    const aComplete = a.doses.filter(d => d.takenAt).length === a.totalDoses;
    const bComplete = b.doses.filter(d => d.takenAt).length === b.totalDoses;
    if (aComplete && !bComplete) return 1;
    if (!aComplete && bComplete) return -1;
    return b.startedAt - a.startedAt;
  });

  return (
    <div className="grid gap-4">
      {sortedMedications.map((med) => (
        <MedicationCard key={med.id} medication={med} onToggleDose={toggleDose} />
      ))}
    </div>
  );
}
