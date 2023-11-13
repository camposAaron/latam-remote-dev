export interface IGrantedAccess {
  token: string;
  user: {
    email: string;
    role: string;
    developer?: {
      id: number;
      firstName: string;
      lastName: string;
      title: string;
      about: string;
      country: string;
      city: string;
      address: string;
      cvUrl?: string;
      github: string;
      linkedin: string;
      website: string;
      email: string;
      telephone: string;
    };
    company?: {
      id: number;
      name?: string;
      email?: string;
      about?: string;
      address?: string;
      telephone?: string;
      website?: string;
      linkedin?: string;
      totalEmployes?: number;
      logo?: string;
    };
  };
}
