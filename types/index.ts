export interface User {
  _id: string;
  email: string;
  name: string;
  image?: string;
  firebaseUid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo?: { email: string, name: string, _id: string };
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'review' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}