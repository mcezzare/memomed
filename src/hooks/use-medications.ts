"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Medication, Dose, DosageUnit } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = 'MemoMed-medications';

type NewMedication = {
    name: string;
    dosage: number;
    dosageUnit: DosageUnit;
    intervalHours: number;
    durationDays: number;
    personId: string;
}

const scheduleNotification = (medicationName: string, dosage: number, dosageUnit: string, dose: Dose) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            payload: {
                medicationName: medicationName,
                dose: `${dosage} ${dosageUnit}`,
                scheduledAt: dose.scheduledAt,
                id: dose.id,
            }
        });
    }
}

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setMedications(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load medications from localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not load your medication data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveMedications = useCallback((meds: Medication[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meds));
      setMedications(meds);
    } catch (error) {
      console.error('Failed to save medications to localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not save your medication data.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const addMedication = useCallback((med: NewMedication) => {
    const startedAt = Date.now();
    const totalDoses = Math.floor((med.durationDays * 24) / med.intervalHours);
    const newDoses: Dose[] = [];
    for (let i = 0; i < totalDoses; i++) {
      newDoses.push({
        id: `${startedAt}-${i}`,
        scheduledAt: startedAt + i * med.intervalHours * 60 * 60 * 1000,
      });
    }

    const newMedication: Medication = {
      ...med,
      id: startedAt.toString(),
      startedAt,
      doses: newDoses,
      totalDoses,
    };
    
    saveMedications([...medications, newMedication]);
    
    if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                 new Notification('Medication Added!', {
                    body: `You've added ${med.name}. We'll remind you!`,
                    icon: '/icon-192x192.png'
                });
                // Schedule all future doses
                newMedication.doses.forEach(dose => {
                    if (dose.scheduledAt > Date.now()) {
                        scheduleNotification(newMedication.name, newMedication.dosage, newMedication.dosageUnit, dose);
                    }
                });
            }
        });
    }

    toast({
      title: 'Medication Added',
      description: `${med.name} has been added to your schedule.`,
    });
  }, [medications, saveMedications, toast]);

  const updateMedication = useCallback((updatedMed: Medication) => {
    const newMedications = medications.map(med => med.id === updatedMed.id ? updatedMed : med);
    saveMedications(newMedications);
  }, [medications, saveMedications]);

  const toggleDose = useCallback((medicationId: string, doseId: string) => {
    const medToUpdate = medications.find(m => m.id === medicationId);
    if (!medToUpdate) return;
    
    const doseToUpdate = medToUpdate.doses.find(d => d.id === doseId);
    if (!doseToUpdate) return;

    const newDoses = medToUpdate.doses.map(d => {
      if (d.id === doseId) {
        return { ...d, takenAt: d.takenAt ? undefined : Date.now() };
      }
      return d;
    });

    const updatedMed = { ...medToUpdate, doses: newDoses };
    updateMedication(updatedMed);
  }, [medications, updateMedication]);

  return { medications, isLoading, addMedication, toggleDose };
}
