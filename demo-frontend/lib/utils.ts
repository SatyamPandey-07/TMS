import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(time: number) {
  const hours = Math.floor(time)
  const minutes = (time % 1) * 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function generateTimeSlots(openHour: number, closeHour: number, slotDuration: number = 1) {
  const slots = []
  for (let hour = openHour; hour < closeHour; hour += slotDuration) {
    slots.push({
      value: hour,
      label: formatTime(hour),
    })
  }
  return slots
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getRandomTurfImages() {
  const images = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
  ]
  return images[Math.floor(Math.random() * images.length)]
}
