import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db, ENTERPRISE_ID } from './firebase';
import { Vehicle, Trip, User, Inspection } from '../types/navigation';

// Coleções principais do Sentinel AI
const COLLECTIONS = {
  MONITORING_REGISTRATION: 'MonitoringRegistration',
  TRIPS: 'Trips',
  VEHICLES: 'Vehicles',
  USERS: 'Users',
  INSPECTIONS: 'Inspections',
  ALERTS: 'Alerts',
  MAINTENANCE: 'Maintenance'
};

// Serviço para Veículos
export const vehicleService = {
  // Buscar todos os veículos da empresa
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const vehiclesRef = collection(db, COLLECTIONS.VEHICLES);
      const q = query(
        vehiclesRef,
        where('enterpriseId', '==', ENTERPRISE_ID),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      return [];
    }
  },

  // Buscar veículo específico
  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    try {
      const vehicleRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
      const snapshot = await getDoc(vehicleRef);
      
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Vehicle;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      return null;
    }
  },

  // Monitorar veículos em tempo real
  subscribeToVehicles(callback: (vehicles: Vehicle[]) => void) {
    const vehiclesRef = collection(db, COLLECTIONS.VEHICLES);
    const q = query(
      vehiclesRef,
      where('enterpriseId', '==', ENTERPRISE_ID)
    );

    return onSnapshot(q, (snapshot) => {
      const vehicles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      callback(vehicles);
    });
  }
};

// Serviço para Viagens
export const tripService = {
  // Buscar viagens ativas
  async getActiveTrips(): Promise<Trip[]> {
    try {
      const tripsRef = collection(db, COLLECTIONS.TRIPS);
      const q = query(
        tripsRef,
        where('enterpriseId', '==', ENTERPRISE_ID),
        where('status', '==', 'active'),
        orderBy('startTime', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
    } catch (error) {
      console.error('Erro ao buscar viagens ativas:', error);
      return [];
    }
  },

  // Buscar histórico de viagens
  async getTripHistory(limitCount: number = 10): Promise<Trip[]> {
    try {
      const tripsRef = collection(db, COLLECTIONS.TRIPS);
      const q = query(
        tripsRef,
        where('enterpriseId', '==', ENTERPRISE_ID),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
    } catch (error) {
      console.error('Erro ao buscar histórico de viagens:', error);
      return [];
    }
  },

  // Monitorar viagens em tempo real
  subscribeToActiveTrips(callback: (trips: Trip[]) => void) {
    const tripsRef = collection(db, COLLECTIONS.TRIPS);
    const q = query(
      tripsRef,
      where('enterpriseId', '==', ENTERPRISE_ID),
      where('status', '==', 'active')
    );

    return onSnapshot(q, (snapshot) => {
      const trips = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
      callback(trips);
    });
  }
};

// Serviço para Usuários
export const userService = {
  // Buscar usuário por ID
  async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        return { uid: snapshot.id, ...snapshot.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  },

  // Buscar usuários da empresa
  async getEnterpriseUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(
        usersRef,
        where('enterpriseId', '==', ENTERPRISE_ID)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }
};

// Serviço para Registros de Monitoramento
export const monitoringService = {
  // Buscar registros de monitoramento
  async getMonitoringData(vehicleId?: string): Promise<any[]> {
    try {
      const monitoringRef = collection(db, COLLECTIONS.MONITORING_REGISTRATION);
      let q = query(
        monitoringRef,
        where('enterpriseId', '==', ENTERPRISE_ID),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      if (vehicleId) {
        q = query(
          monitoringRef,
          where('enterpriseId', '==', ENTERPRISE_ID),
          where('vehicleId', '==', vehicleId),
          orderBy('timestamp', 'desc'),
          limit(100)
        );
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar dados de monitoramento:', error);
      return [];
    }
  },

  // Monitorar dados em tempo real
  subscribeToMonitoring(vehicleId: string, callback: (data: any[]) => void) {
    const monitoringRef = collection(db, COLLECTIONS.MONITORING_REGISTRATION);
    const q = query(
      monitoringRef,
      where('enterpriseId', '==', ENTERPRISE_ID),
      where('vehicleId', '==', vehicleId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    });
  }
};

// Serviço para Inspeções
export const inspectionService = {
  // Buscar inspeções
  async getInspections(vehicleId?: string): Promise<Inspection[]> {
    try {
      const inspectionsRef = collection(db, COLLECTIONS.INSPECTIONS);
      let q = query(
        inspectionsRef,
        where('enterpriseId', '==', ENTERPRISE_ID),
        orderBy('date', 'desc')
      );

      if (vehicleId) {
        q = query(
          inspectionsRef,
          where('enterpriseId', '==', ENTERPRISE_ID),
          where('vehicleId', '==', vehicleId),
          orderBy('date', 'desc')
        );
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inspection[];
    } catch (error) {
      console.error('Erro ao buscar inspeções:', error);
      return [];
    }
  },

  // Criar nova inspeção
  async createInspection(inspection: Omit<Inspection, 'id'>): Promise<string | null> {
    try {
      const inspectionsRef = collection(db, COLLECTIONS.INSPECTIONS);
      const docRef = await addDoc(inspectionsRef, {
        ...inspection,
        enterpriseId: ENTERPRISE_ID,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar inspeção:', error);
      return null;
    }
  }
};

// Serviço genérico para outras coleções
export const genericService = {
  // Buscar documentos de qualquer coleção
  async getDocuments(collectionName: string, filters?: any[]): Promise<any[]> {
    try {
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef);

      // Adicionar filtro de empresa se não especificado
      if (!filters?.some(filter => filter.field === 'enterpriseId')) {
        q = query(q, where('enterpriseId', '==', ENTERPRISE_ID));
      }

      // Aplicar filtros adicionais
      if (filters) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Erro ao buscar documentos da coleção ${collectionName}:`, error);
      return [];
    }
  }
};

export default {
  vehicleService,
  tripService,
  userService,
  monitoringService,
  inspectionService,
  genericService
};

