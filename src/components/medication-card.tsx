"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Medication, Dose } from "@/lib/types";
import { format, formatDistanceToNow, isPast, isFuture } from "date-fns";
import { Pill, Droplets, Beaker, CalendarClock, CheckCircle2 } from "lucide-react";

type MedicationCardProps = {
  medication: Medication;
  onToggleDose: (medicationId: string, doseId: string) => void;
};

const unitIcons = {
  capsule: <Pill className="h-4 w-4" />,
  drop: <Droplets className="h-4 w-4" />,
  mL: <Beaker className="h-4 w-4" />,
};

export function MedicationCard({ medication, onToggleDose }: MedicationCardProps) {
  const takenDoses = medication.doses.filter(d => d.takenAt).length;
  const progress = (takenDoses / medication.totalDoses) * 100;

  const nextDose = medication.doses.find(d => !d.takenAt && isFuture(d.scheduledAt));

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{medication.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    {unitIcons[medication.dosageUnit]}
                    {medication.dosage} {medication.dosageUnit} every {medication.intervalHours} hours
                </CardDescription>
            </div>
            {progress >= 100 && <Badge variant="outline" className="bg-accent text-accent-foreground border-accent-foreground/50"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {nextDose ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <CalendarClock className="h-5 w-5 text-primary" />
            <div>
                <span className="font-semibold text-foreground">Next dose:</span> {formatDistanceToNow(nextDose.scheduledAt, { addSuffix: true })}
                <p className="text-xs">({format(nextDose.scheduledAt, "MMM d, h:mm a")})</p>
            </div>
          </div>
        ) : (
            progress < 100 && <p className="text-sm text-muted-foreground">No upcoming doses.</p>
        )}
      </CardContent>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="schedule" className="border-b-0">
          <CardFooter className="flex-col items-start p-0">
            <div className="w-full px-6 pb-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <Label htmlFor={`progress-${medication.id}`}>Progress</Label>
                    <span className="text-muted-foreground">{takenDoses} / {medication.totalDoses} taken</span>
                </div>
                <Progress id={`progress-${medication.id}`} value={progress} className="w-full h-2" />
            </div>
            <AccordionTrigger className="w-full px-6 py-3 hover:bg-muted/50 text-sm [&[data-state=open]]:bg-muted/50">
              View Full Schedule
            </AccordionTrigger>
          </CardFooter>
          <AccordionContent>
            <div className="max-h-60 overflow-y-auto px-6 py-2 space-y-3">
              {medication.doses.map((dose) => (
                <DoseItem key={dose.id} dose={dose} medicationId={medication.id} onToggleDose={onToggleDose} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

function DoseItem({ dose, medicationId, onToggleDose }: { dose: Dose, medicationId: string, onToggleDose: (medId: string, doseId: string) => void }) {
    const isTaken = !!dose.takenAt;
    const canTake = isPast(dose.scheduledAt);
    const id = `dose-${dose.id}`;

    return (
        <div className={cn("flex items-center justify-between p-3 rounded-md transition-all duration-300",
            isTaken ? "bg-accent/50 text-accent-foreground" : "bg-muted/30",
            !isTaken && !canTake && "opacity-60"
        )}>
            <div className="flex items-center gap-3">
                <Checkbox
                    id={id}
                    checked={isTaken}
                    onCheckedChange={() => onToggleDose(medicationId, dose.id)}
                    disabled={!canTake && !isTaken}
                    aria-label={`Mark dose for ${format(dose.scheduledAt, "MMM d, h:mm a")} as taken`}
                    className={cn("transition-all", isTaken && "data-[state=checked]:bg-accent-foreground data-[state=checked]:border-accent-foreground")}
                />
                <Label htmlFor={id} className={cn("cursor-pointer transition-all", isTaken && "line-through text-muted-foreground")}>
                    {format(dose.scheduledAt, "eee, MMM d 'at' h:mm a")}
                </Label>
            </div>
            {isTaken && dose.takenAt && <span className="text-xs">{format(dose.takenAt, "h:mm a")}</span>}
        </div>
    );
}
