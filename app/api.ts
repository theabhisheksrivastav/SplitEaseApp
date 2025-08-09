// api.ts
import { API_URL } from '@/config';
import axios from 'axios';

// --- Interfaces ---
export interface Group {
  _id: string;
  name: string;
  members: string[];
  joinCode: string;
  joinRequests: string[];
}

export interface Expense {
  _id: string;
  groupId: string;
  description: string;
  amount: number;
  addedBy: string;
  approvals: string[];
  approved: boolean;
}

export interface LoginResponse {
  userId: string;
}

export interface GroupResponse {
  _id: any;
  group: Group;
  user: { _id: string; androidId: string; deviceName: string; groupId?: string };
}

// --- API functions ---

// Login / auto-create
export const loginUser = async (androidId: string, deviceName: string) => {
  console.log(androidId, deviceName)
  const res = await axios.post<LoginResponse>(`${API_URL}/users/login`, {
    androidId,
    deviceName
  });
  console.log('Login response:', res.data);
  return res.data;
};

// Create group
export const createGroup = async (name: string, userId: string) => {
  console.log('Creating group:', { name, userId });
  const res = await axios.post<GroupResponse>(`${API_URL}/groups`, { name, userId });
  console.log(res.data)
  return res.data;
};

// Join group by join code
export const joinGroup = async (joinCode: string, userId: string) => {
  const res = await axios.post(`${API_URL}/groups/join`, { joinCode, userId });
  return res.data;
};

// Approve join request
export const approveJoin = async (groupId: string, userId: string) => {
  const res = await axios.post(`${API_URL}/groups/approve-join`, { groupId, userId });
  return res.data;
};

// Get group details (with members, join requests, expenses)
export const getGroupDetails = async (groupId: string) => {
  const res = await axios.get(`${API_URL}/groups/${groupId}`);
  return res.data;
};

// Add expense
export const addExpense = async (
  groupId: string,
  addedBy: string,
  description: string,
  amount: number
) => {
  const res = await axios.post(`${API_URL}/expenses`, {
    groupId,
    addedBy,
    description,
    amount
  });
  return res.data;
};

// Approve expense
export const approveExpense = async (expenseId: string, userId: string) => {
  const res = await axios.post(`${API_URL}/expenses/approve`, { expenseId, userId });
  return res.data;
};

export async function getGroups(userId: string) {
  try {
    const res = await fetch(`${API_URL}/groups?userId=${userId}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching active groups:', err);
    throw err;
  }
}

export async function getGroupById(groupId: string) {
  const res = await fetch(`${API_URL}/groups/${groupId}`);
  if (!res.ok) throw new Error(`Error fetching group: ${res.status}`);
  return await res.json();
}

// export async function addExpense(expense: {
//   groupId: string;
//   description: string;
//   amount: number;
//   paidBy: string;
// }) {
//   const res = await fetch(`${API_URL}/expenses`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(expense),
//   });
//   if (!res.ok) throw new Error(`Error adding expense: ${res.status}`);
//   return await res.json();
// }