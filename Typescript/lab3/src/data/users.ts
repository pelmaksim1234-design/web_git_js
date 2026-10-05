export type User = {
  id: number
  gender: 'female' | 'male'
  name: {
    title: string
    first: string
    last: string
  }
  location: {
    city: string
    state: string
    country: string
    postcode: number
  }
  email: string
  phone: string
  picture: string
  dob: {
    date: string
    age: number
  }
  hobbies: string[]
  details: string
}

export const users: User[] = [
  {
    id: 1,
    gender: 'female',
    name: { title: 'Mrs', first: 'Emma', last: 'Lampi' },
    location: { city: 'Hausjärvi', state: 'Uusimaa', country: 'Finland', postcode: 98555 },
    email: 'emma.lampi@example.com',
    phone: '02-689-410',
    picture: '/users/user-1.svg',
    dob: { date: '2001-03-08T01:39:19.084Z', age: 25 },
    hobbies: ['Travel', 'Photography', 'Hiking'],
    details: 'Emma enjoys exploring new countries and collecting stories from local cultures.'
  },
  {
    id: 2,
    gender: 'male',
    name: { title: 'Mr', first: 'Noah', last: 'Martin' },
    location: { city: 'Lyon', state: 'Auvergne-Rhone-Alpes', country: 'France', postcode: 69001 },
    email: 'noah.martin@example.com',
    phone: '05-478-992',
    picture: '/users/user-2.svg',
    dob: { date: '1985-02-14T08:10:00.000Z', age: 41 },
    hobbies: ['Cycling', 'Cooking', 'Reading'],
    details: 'Noah is a product designer who loves building useful interfaces and testing new recipes.'
  },
  {
    id: 3,
    gender: 'female',
    name: { title: 'Ms', first: 'Sofia', last: 'Petrovic' },
    location: { city: 'Belgrade', state: 'Central Serbia', country: 'Serbia', postcode: 11000 },
    email: 'sofia.petrovic@example.com',
    phone: '011-234-567',
    picture: '/users/user-3.svg',
    dob: { date: '2008-11-09T09:40:00.000Z', age: 17 },
    hobbies: ['Dancing', 'Art', 'Music'],
    details: 'Sofia spends most of her free time in dance classes and community art workshops.'
  },
  {
    id: 4,
    gender: 'male',
    name: { title: 'Mr', first: 'Daniel', last: 'Nguyen' },
    location: { city: 'Hanoi', state: 'Hanoi', country: 'Vietnam', postcode: 100000 },
    email: 'daniel.nguyen@example.com',
    phone: '024-111-111',
    picture: '/users/user-4.svg',
    dob: { date: '1989-04-23T14:22:00.000Z', age: 37 },
    hobbies: ['Running', 'Travel', 'Music'],
    details: 'Daniel likes long-distance running and always plans weekend trips with friends.'
  },
  {
    id: 5,
    gender: 'female',
    name: { title: 'Mrs', first: 'Mia', last: 'Andersson' },
    location: { city: 'Gothenburg', state: 'Västra Götaland', country: 'Sweden', postcode: 41756 },
    email: 'mia.andersson@example.com',
    phone: '031-508-39',
    picture: '/users/user-5.svg',
    dob: { date: '1974-09-17T03:41:00.000Z', age: 52 },
    hobbies: ['Gardening', 'Reading', 'Cooking'],
    details: 'Mia loves growing herbs at home and sharing home-made meals with her family.'
  },
  {
    id: 6,
    gender: 'male',
    name: { title: 'Mr', first: 'Leo', last: 'Moreau' },
    location: { city: 'Montreal', state: 'Quebec', country: 'Canada', postcode: 84000 },
    email: 'leo.moreau@example.com',
    phone: '514-987-772',
    picture: '/users/user-6.svg',
    dob: { date: '1996-06-30T06:10:00.000Z', age: 30 },
    hobbies: ['Hiking', 'Photography', 'Reading'],
    details: 'Leo is an outdoor enthusiast who often documents trails and nature landscapes.'
  },
  {
    id: 7,
    gender: 'female',
    name: { title: 'Ms', first: 'Zara', last: 'Ahmed' },
    location: { city: 'Dubai', state: 'Dubai', country: 'UAE', postcode: 00000 },
    email: 'zara.ahmed@example.com',
    phone: '04-748-113',
    picture: '/users/user-7.svg',
    dob: { date: '1992-01-18T08:25:00.000Z', age: 34 },
    hobbies: ['Yoga', 'Travel', 'Art'],
    details: 'Zara balances her creative work with wellness routines and art classes.'
  },
  {
    id: 8,
    gender: 'male',
    name: { title: 'Mr', first: 'Onur', last: 'Yilmaz' },
    location: { city: 'Istanbul', state: 'Istanbul', country: 'Turkey', postcode: 34000 },
    email: 'onur.yilmaz@example.com',
    phone: '0212-345-67',
    picture: '/users/user-8.svg',
    dob: { date: '2004-08-05T13:18:00.000Z', age: 22 },
    hobbies: ['Gaming', 'Football', 'Music'],
    details: 'Onur loves team sports and keeps a playlist for every match day.'
  },
  {
    id: 9,
    gender: 'female',
    name: { title: 'Ms', first: 'Chloe', last: 'Walker' },
    location: { city: 'Manchester', state: 'Greater Manchester', country: 'United Kingdom', postcode: 12000 },
    email: 'chloe.walker@example.com',
    phone: '0161-892-44',
    picture: '/users/user-9.svg',
    dob: { date: '1978-12-10T12:05:00.000Z', age: 47 },
    hobbies: ['Cooking', 'Reading', 'Travel'],
    details: 'Chloe is known among friends for her weekend brunch plans and travel recommendations.'
  },
  {
    id: 10,
    gender: 'male',
    name: { title: 'Mr', first: 'Ivan', last: 'Petrenko' },
    location: { city: 'Kyiv', state: 'Kyiv City', country: 'Ukraine', postcode: 01000 },
    email: 'ivan.petrenko@example.com',
    phone: '044-207-18',
    picture: '/users/user-10.svg',
    dob: { date: '1963-03-22T04:55:00.000Z', age: 63 },
    hobbies: ['Fishing', 'Reading', 'Gardening'],
    details: 'Ivan enjoys quiet mornings, gardening work, and discussing history over coffee.'
  }
]
