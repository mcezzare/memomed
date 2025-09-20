"use client";

import { useMedications } from "@/hooks/use-medications";
import { MedicationCard } from "./medication-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export function MedicationList() {
  const { medications, isLoading, toggleDose } = useMedications();
  const emptyStateImage = PlaceHolderImages.find(img => img.id === 'meds-empty-state');


  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg mt-8">
        {emptyStateImage && 
            <Image 
                src={emptyStateImage.imageUrl} 
                alt={emptyStateImage.description} 
                width={150} 
                height={150} 
                className="mx-auto rounded-full mb-6 opacity-70" 
                data-ai-hint={emptyStateImage.imageHint} 
            />
        }
        <h2 className="text-2xl font-headline font-semibold">No Medications Yet</h2>
        <p className="text-muted-foreground mt-2">Click "Add Medication" to get started.</p>
      </div>
    );
  }

  const sortedMedications = [...medications].sort((a, b) => {
    const aComplete = a.doses.filter(d => d.takenAt).length === a.totalDoses;
    const bComplete = b.doses.filter(d => d.takenAt).length === b.totalDoses;
    if (aComplete && !bComplete) return 1;
    if (!aComplete && bComplete) return -1;
    return b.startedAt - a.startedAt;
  });

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {sortedMedications.map((med) => (
        <MedicationCard key={med.id} medication={med} onToggleDose={toggleDose} />
      ))}
    </div>
  );
}
