"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Person } from "@/lib/types";
import { useEffect } from "react";

const formSchema = z.object({
  personId: z.string().min(1, { message: "Please select a person." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dosage: z.coerce.number().positive({ message: "Dosage must be positive." }),
  dosageUnit: z.enum(['mL', 'drop', 'capsule']),
  intervalHours: z.coerce.number().min(1, { message: "Interval must be at least 1 hour." }),
  durationDays: z.coerce.number().min(1, { message: "Duration must be at least 1 day." }),
});

type MedicationFormProps = {
  people: Person[];
  selectedPersonId?: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onClose: () => void;
};

const defaultValues = {
  name: "",
  dosage: 1,
  dosageUnit: 'capsule' as const,
  intervalHours: 8,
  durationDays: 7,
};

export function MedicationForm({ people, selectedPersonId, onSubmit, onClose }: MedicationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      personId: selectedPersonId || (people.length > 0 ? people[0].id : ""),
    },
  });

  useEffect(() => {
    if (selectedPersonId) {
      form.setValue('personId', selectedPersonId);
    }
  }, [selectedPersonId, form]);

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    form.reset({
        ...defaultValues,
        personId: values.personId
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="personId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>For Whom?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a person" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id}>{person.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Paracetamol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dosageUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValuechange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="capsule">Capsule(s)</SelectItem>
                    <SelectItem value="mL">mL</SelectItem>
                    <SelectItem value="drop">Drop(s)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="intervalHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval (hours)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (days)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Medication</Button>
        </div>
      </form>
    </Form>
  );
}
