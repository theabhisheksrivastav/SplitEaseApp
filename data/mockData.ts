import { Group, Member, Expense } from '@/types';

export const mockMembers: Member[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'Diana' },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Dinner',
    amount: 40.00,
    paidBy: 'Alice',
    groupId: '1',
    date: new Date('2024-01-15'),
  },
  {
    id: '2',
    description: 'Gas',
    amount: 60.00,
    paidBy: 'Bob',
    groupId: '1',
    date: new Date('2024-01-14'),
  },
  {
    id: '3',
    description: 'Hotel',
    amount: 200.00,
    paidBy: 'Charlie',
    groupId: '1',
    date: new Date('2024-01-13'),
  },
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Goa Trip',
    members: mockMembers,
    expenses: mockExpenses,
    totalBalance: 300.00,
    isActive: true,
  },
  {
    id: '2',
    name: 'Office Party',
    members: mockMembers.slice(0, 3),
    expenses: [],
    totalBalance: 0,
    isActive: true,
  },
  {
    id: '3',
    name: 'Weekend Getaway',
    members: mockMembers.slice(0, 2),
    expenses: [],
    totalBalance: 150.00,
    isActive: false,
  },
];