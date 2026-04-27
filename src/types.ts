/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AnimalCategory {
  MAMMAL = 'Mammal',
  BIRD = 'Bird',
  FISH = 'Fish',
  REPTILE = 'Reptile',
  AMPHIBIAN = 'Amphibian',
  INSECT = 'Insect',
}

export type SOSStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'EXPIRED';
export type InjuryType = 'bleeding' | 'limping' | 'unconscious' | 'trapped' | 'other';

export interface SOSAlert {
  id: string;
  userId: string;
  photoUrl: string;
  gps: {
    lat: number;
    lng: number;
    address: string;
  };
  speciesGuess: {
    label: string;
    confidence: number;
  };
  injuryType: InjuryType;
  status: SOSStatus;
  timestamp: string;
  assignedTo: string | null;
  isOffline: boolean;
}

export interface Rescuer {
  id: string;
  name: string;
  online: boolean;
  lat: number;
  lng: number;
  type: 'RESCUER' | 'VET' | 'SHELTER';
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  category: AnimalCategory;
  photo?: string;
  birthDate?: string;
  reminders: Reminder[];
  logs: LogEntry[];
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  type: 'feeding' | 'cleaning' | 'medication' | 'vet' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly';
  lastDone?: string;
}

export interface LogEntry {
  id: string;
  type: string;
  timestamp: string;
  note?: string;
}

export interface Sighting {
  id: string;
  photo: string;
  speciesName: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp: string;
  isPublic: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  isPro: boolean;
  onboarded: boolean;
}
