import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL environment variable is required');
}

interface PetProfile {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  photoUrl?: string;
  weight?: number;
  gender?: 'male' | 'female';
  microchipId?: string;
  createdAt: string;
  updatedAt: string;
}

interface HealthRecord {
  id: string;
  petId: string;
  type: 'vet_visit' | 'medication' | 'vaccination' | 'allergy' | 'condition';
  title: string;
  description?: string;
  date: string;
  veterinarianName?: string;
  clinicName?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Reminder {
  id: string;
  petId: string;
  type: 'medication' | 'appointment' | 'grooming' | 'vaccination' | 'custom';
  title: string;
  description?: string;
  scheduledDate: string;
  repeatInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isCompleted: boolean;
  notificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CareTip {
  id: string;
  species: string;
  category: 'nutrition' | 'exercise' | 'grooming' | 'health' | 'behavior' | 'general';
  title: string;
  content: string;
  imageUrl?: string;
  source?: string;
  createdAt: string;
}

interface Appointment {
  id: string;
  petId: string;
  title: string;
  type: 'checkup' | 'vaccination' | 'surgery' | 'grooming' | 'emergency' | 'other';
  scheduledDate: string;
  duration?: number;
  veterinarianName?: string;
  clinicName?: string;
  clinicAddress?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface ErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await SecureStore.getItemAsync('auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Token retrieval failed:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          try {
            await SecureStore.deleteItemAsync('auth_token');
            await SecureStore.deleteItemAsync('refresh_token');
          } catch (e) {
            console.warn('Failed to clear auth tokens:', e);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
      if (axiosError.message) {
        throw new Error(axiosError.message);
      }
      throw new Error('An unexpected network error occurred');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }

  async getAll<T>(endpoint: string): Promise<T[]> {
    try {
      const response = await this.client.get<ApiResponse<T[]>>(endpoint);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getById<T>(endpoint: string, id: string): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(`${endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async create<T>(endpoint: string, data: Partial<T>): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(endpoint, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update<T>(endpoint: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(`${endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(endpoint: string, id: string): Promise<void> {
    try {
      await this.client.delete(`${endpoint}/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', {
        email: email.trim().slice(0, 255),
        password: password.slice(0, 255),
      });
      const authData = response.data.data;
      await SecureStore.setItemAsync('auth_token', authData.token);
      if (authData.refreshToken) {
        await SecureStore.setItemAsync('refresh_token', authData.refreshToken);
      }
      return authData;
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', {
        email: email.trim().slice(0, 255),
        password: password.slice(0, 255),
        name: name.trim().slice(0, 255),
      });
      const authData = response.data.data;
      await SecureStore.setItemAsync('auth_token', authData.token);
      if (authData.refreshToken) {
        await SecureStore.setItemAsync('refresh_token', authData.refreshToken);
      }
      return authData;
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      try {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
      } catch (error) {
        console.warn('Failed to clear tokens:', error);
      }
    }
  }

  async getPetProfiles(): Promise<PetProfile[]> {
    return this.getAll<PetProfile>('/pets');
  }

  async getPetProfile(id: string): Promise<PetProfile> {
    return this.getById<PetProfile>('/pets', id);
  }

  async createPetProfile(data: Partial<PetProfile>): Promise<PetProfile> {
    return this.create<PetProfile>('/pets', data);
  }

  async updatePetProfile(id: string, data: Partial<PetProfile>): Promise<PetProfile> {
    return this.update<PetProfile>('/pets', id, data);
  }

  async deletePetProfile(id: string): Promise<void> {
    return this.delete('/pets', id);
  }

  async getHealthRecords(petId: string): Promise<HealthRecord[]> {
    try {
      const response = await this.client.get<ApiResponse<HealthRecord[]>>(`/pets/${petId}/health-records`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createHealthRecord(petId: string, data: Partial<HealthRecord>): Promise<HealthRecord> {
    try {
      const response = await this.client.post<ApiResponse<HealthRecord>>(`/pets/${petId}/health-records`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateHealthRecord(petId: string, recordId: string, data: Partial<HealthRecord>): Promise<HealthRecord> {
    try {
      const response = await this.client.put<ApiResponse<HealthRecord>>(`/pets/${petId}/health-records/${recordId}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteHealthRecord(petId: string, recordId: string): Promise<void> {
    try {
      await this.client.delete(`/pets/${petId}/health-records/${recordId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMedications(petId: string): Promise<Medication[]> {
    try {
      const response = await this.client.get<ApiResponse<Medication[]>>(`/pets/${petId}/medications`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createMedication(petId: string, data: Partial<Medication>): Promise<Medication> {
    try {
      const response = await this.client.post<ApiResponse<Medication>>(`/pets/${petId}/medications`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateMedication(petId: string, medicationId: string, data: Partial<Medication>): Promise<Medication> {
    try {
      const response = await this.client.put<ApiResponse<Medication>>(`/pets/${petId}/medications/${medicationId}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteMedication(petId: string, medicationId: string): Promise<void> {
    try {
      await this.client.delete(`/pets/${petId}/medications/${medicationId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getReminders(petId?: string): Promise<Reminder[]> {
    try {
      const endpoint = petId ? `/pets/${petId}/reminders` : '/reminders';
      const response = await this.client.get<ApiResponse<Reminder[]>>(endpoint);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createReminder(data: Partial<Reminder>): Promise<Reminder> {
    try {
      const response = await this.client.post<ApiResponse<Reminder>>('/reminders', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateReminder(reminderId: string, data: Partial<Reminder>): Promise<Reminder> {
    try {
      const response = await this.client.put<ApiResponse<Reminder>>(`/reminders/${reminderId}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteReminder(reminderId: string): Promise<void> {
    try {
      await this.client.delete(`/reminders/${reminderId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async markReminderComplete(reminderId: string): Promise<Reminder> {
    try {
      const response = await this.client.patch<ApiResponse<Reminder>>(`/reminders/${reminderId}/complete`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCareTips(species?: string, category?: string): Promise<CareTip[]> {
    try {
      const params = new URLSearchParams();
      if (species) params.append('species', species.trim().slice(0, 100));
      if (category) params.append('category', category.trim().slice(0, 100));
      const queryString = params.toString();
      const endpoint = queryString ? `/care-tips?${queryString}` : '/care-tips';
      const response = await this.client.get<ApiResponse<CareTip[]>>(endpoint);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAppointments(petId?: string): Promise<Appointment[]> {
    try {
      const endpoint = petId ? `/pets/${petId}/appointments` : '/appointments';
      const response = await this.client.get<ApiResponse<Appointment[]>>(endpoint);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await this.client.post<ApiResponse<Appointment>>('/appointments', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateAppointment(appointmentId: string, data: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await this.client.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    try {
      await this.client.delete(`/appointments/${appointmentId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async uploadPetPhoto(petId: string, photoUri: string): Promise<{ photoUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'pet-photo.jpg',
      } as any);

      const response = await this.client.post<ApiResponse<{ photoUrl: string }>>(`/pets/${petId}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

const apiService = new ApiService();
export default apiService;
