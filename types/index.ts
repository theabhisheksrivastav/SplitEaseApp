import { Key } from "react";

export interface Member {
  _id: string;
  androidId: string;
  deviceName: string;
}

export interface Expense {
  addedBy: any;
  _id: Key | null | undefined;
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  groupId: string;
  date: Date;
}

export interface Group {
  joinCode: any;
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  totalBalance: number;
  isActive: boolean;
}