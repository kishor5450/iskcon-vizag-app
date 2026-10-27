export interface ISevaOpportunity {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  requiredDevoteesCount: number;
  registeredDevoteesCount: number;
  official: boolean;
  createdAt: string;
}
