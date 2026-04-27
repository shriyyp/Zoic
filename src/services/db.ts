/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Animal, Sighting, UserProfile, SOSAlert, Rescuer } from '../types';

const STORAGE_KEYS = {
  ANIMALS: 'zoic_animals',
  SIGHTINGS: 'zoic_sightings',
  PROFILE: 'zoic_profile',
  SOS_ALERTS: 'zoic_sos_alerts',
};

class DBService {
  // Existing methods...
  getAnimals(): Animal[] {
    const data = localStorage.getItem(STORAGE_KEYS.ANIMALS);
    return data ? JSON.parse(data) : [];
  }

  saveAnimals(animals: Animal[]) {
    localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(animals));
  }

  getSightings(): Sighting[] {
    const data = localStorage.getItem(STORAGE_KEYS.SIGHTINGS);
    return data ? JSON.parse(data) : [];
  }

  saveSightings(sightings: Sighting[]) {
    localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(sightings));
  }

  getProfile(): UserProfile {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : {
      name: 'Guest User',
      email: '',
      isPro: false,
      onboarded: false,
    };
  }

  saveProfile(profile: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // SOS Methods
  getSOSAlerts(): SOSAlert[] {
    const data = localStorage.getItem(STORAGE_KEYS.SOS_ALERTS);
    return data ? JSON.parse(data) : [];
  }

  saveSOSAlert(alert: SOSAlert) {
    const alerts = this.getSOSAlerts();
    const updated = [alert, ...alerts.filter(a => a.id !== alert.id)];
    localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, JSON.stringify(updated));
  }

  getMockRescuers(): Rescuer[] {
    return [
      { id: 'r1', name: 'Wildlife Rescue North', online: true, lat: 45.523062, lng: -122.676482, type: 'RESCUER' },
      { id: 'v1', name: 'Emergency Pet Vet', online: true, lat: 45.520062, lng: -122.670482, type: 'VET' },
      { id: 's1', name: 'City Animal Shelter', online: true, lat: 45.530062, lng: -122.680482, type: 'SHELTER' },
    ];
  }
}

export const db = new DBService();
