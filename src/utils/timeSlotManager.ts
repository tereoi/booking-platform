// src/utils/timeSlotManager.ts
import { Timestamp } from 'firebase/firestore';
import type { Appointment } from '@/types';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface WorkingHours {
  start: string;
  end: string;
  isOpen: boolean;
}

const DAYS_MAP: { [key: number]: string } = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};

export class TimeSlotManager {
  private static BUFFER_TIME = 15; // minutes between appointments

  static getDayName(date: Date): string {
    return DAYS_MAP[date.getDay()];
  }

  static parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  static formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  static generateTimeSlots(
    date: Date,
    workingHours: { [key: string]: WorkingHours },
    existingAppointments: Appointment[],
    serviceDuration: number
  ): TimeSlot[] {
    const dayName = this.getDayName(date);
    const daySchedule = workingHours[dayName];

    // Check if we're open
    if (!daySchedule || !daySchedule.isOpen) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const startMinutes = this.parseTime(daySchedule.start);
    const endMinutes = this.parseTime(daySchedule.end);

    // Generate all possible time slots
    for (
      let currentTime = startMinutes;
      currentTime + serviceDuration <= endMinutes;
      currentTime += this.BUFFER_TIME
    ) {
      const startTime = this.formatTime(currentTime);
      const endTime = this.formatTime(currentTime + serviceDuration);

      const slot: TimeSlot = {
        startTime,
        endTime,
        available: true
      };

      // Check if slot conflicts with existing appointments
      for (const appointment of existingAppointments) {
        if (
          appointment.date === date.toISOString().split('T')[0] &&
          this.hasOverlap(
            startTime,
            endTime,
            appointment.time,
            this.formatTime(this.parseTime(appointment.time) + appointment.duration)
          )
        ) {
          slot.available = false;
          break;
        }
      }

      slots.push(slot);
    }

    return slots;
  }

  private static hasOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const start1Minutes = this.parseTime(start1);
    const end1Minutes = this.parseTime(end1);
    const start2Minutes = this.parseTime(start2);
    const end2Minutes = this.parseTime(end2);

    return (
      (start1Minutes >= start2Minutes && start1Minutes < end2Minutes) ||
      (end1Minutes > start2Minutes && end1Minutes <= end2Minutes) ||
      (start1Minutes <= start2Minutes && end1Minutes >= end2Minutes)
    );
  }
}