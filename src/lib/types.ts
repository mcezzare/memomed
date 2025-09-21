export type DosageUnit = 'mL' | 'drop' | 'capsule';

export type Dose = {
  id: string;
  scheduledAt: number; // Use timestamp for easy storage
  takenAt?: number;
};

export type Person = {
  id: string;
  name: string;
};

export type Medication = {
  id: string;
  personId: string;
  name: string;
  dosage: number;
  dosageUnit: DosageUnit;
  intervalHours: number;
  durationDays: number;
  startedAt: number;
  doses: Dose[];
  totalDoses: number;
};
