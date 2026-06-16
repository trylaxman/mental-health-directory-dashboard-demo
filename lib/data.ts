export type Listing = {
  id: number;
  name: string;
  title: string;
  location: string;
  topic: string;
  price: number;
  format: 'Online' | 'In-person' | 'Hybrid';
  accredited: boolean;
  status: 'Approved' | 'Pending' | 'Rejected';
  tier: 'Starter' | 'Professional';
  bio: string;
  rating: number;
};

export const seedListings: Listing[] = [
  { id: 1, name: 'Dr. Maya Shah', title: 'Anxiety & Burnout Specialist', location: 'London', topic: 'Anxiety', price: 85, format: 'Online', accredited: true, status: 'Approved', tier: 'Professional', bio: 'Evidence-based support for anxiety, burnout and workplace stress.', rating: 4.9 },
  { id: 2, name: 'Oliver Reed', title: 'Trauma-informed Coach', location: 'Manchester', topic: 'Trauma', price: 70, format: 'Hybrid', accredited: true, status: 'Approved', tier: 'Starter', bio: 'Practical trauma-informed guidance with flexible weekly sessions.', rating: 4.7 },
  { id: 3, name: 'Sara Collins', title: 'Couples Communication Guide', location: 'Bristol', topic: 'Relationships', price: 95, format: 'In-person', accredited: false, status: 'Approved', tier: 'Professional', bio: 'Helping couples build communication habits and repair trust.', rating: 4.8 },
  { id: 4, name: 'James Patel', title: 'Mindfulness & Stress Trainer', location: 'Remote', topic: 'Stress', price: 55, format: 'Online', accredited: true, status: 'Pending', tier: 'Starter', bio: 'Simple mindfulness routines for busy professionals and teams.', rating: 4.6 }
];

export const topics = ['Anxiety', 'Trauma', 'Relationships', 'Stress', 'Depression', 'Workplace Wellbeing'];
export const locations = ['London', 'Manchester', 'Bristol', 'Remote'];
