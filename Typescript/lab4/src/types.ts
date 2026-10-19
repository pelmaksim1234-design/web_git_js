export interface Participant {
  id: string
  name: string
  dateOfBirth: string
  email: string
  phone: string
}

export type ParticipantFormData = Omit<Participant, 'id'>
export type SortField = 'name' | 'dateOfBirth'
export type SortDirection = 'asc' | 'desc'
