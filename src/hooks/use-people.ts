"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Person } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const PEOPLE_STORAGE_KEY = 'dosewise-people';
const SELECTED_PERSON_STORAGE_KEY = 'dosewise-selected-person';

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPeople = window.localStorage.getItem(PEOPLE_STORAGE_KEY);
      const storedSelectedId = window.localStorage.getItem(SELECTED_PERSON_STORAGE_KEY);
      
      const loadedPeople = storedPeople ? JSON.parse(storedPeople) : [];
      setPeople(loadedPeople);

      if (storedSelectedId) {
        setSelectedPersonId(JSON.parse(storedSelectedId));
      } else if (loadedPeople.length > 0) {
        setSelectedPersonId(loadedPeople[0].id);
      }

    } catch (error) {
      console.error('Failed to load people from localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not load your profile data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const savePeople = useCallback((p: Person[]) => {
    try {
      window.localStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify(p));
      setPeople(p);
    } catch (error) {
      console.error('Failed to save people to localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not save your profile data.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const saveSelectedPersonId = useCallback((id: string | undefined) => {
    try {
        if (id) {
            window.localStorage.setItem(SELECTED_PERSON_STORAGE_KEY, JSON.stringify(id));
        } else {
            window.localStorage.removeItem(SELECTED_PERSON_STORAGE_KEY);
        }
        setSelectedPersonId(id);
    } catch (error) {
      console.error('Failed to save selected person', error);
      toast({
        title: 'Error',
        description: 'Could not save your selection.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const addPerson = useCallback((name: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name,
    };
    const updatedPeople = [...people, newPerson];
    savePeople(updatedPeople);
    
    // If it's the first person, select them automatically
    if (people.length === 0) {
        saveSelectedPersonId(newPerson.id);
    }
    
    toast({
      title: 'Profile Added',
      description: `The profile for ${name} has been created.`,
    });
  }, [people, savePeople, saveSelectedPersonId, toast]);

  return { 
    people, 
    isLoading, 
    addPerson, 
    selectedPersonId,
    setSelectedPersonId: saveSelectedPersonId 
  };
}
