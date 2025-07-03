export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Trips: undefined;
  Inspection: undefined;
  Copilot: undefined;
};

export interface User {
  uid: string;
  email?: string;
  cpf?: string;
  driverCode?: string;
  displayName?: string;
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  batteryLevel: number;
  temperature: number;
  autonomy: number;
  status: 'connected' | 'disconnected' | 'maintenance';
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  route: string;
  currentSpeed: number;
  remainingDistance: number;
  estimatedTime: string;
  status: 'active' | 'completed' | 'paused';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ada';
  timestamp: Date;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  notes?: string;
}

