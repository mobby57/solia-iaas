export interface KYC {
  firstName: string;
  lastName: string;
  nationality?: string;
  documentType?: 'ID_CARD' | 'PASSPORT' | 'OTHER';
  documentNumber?: string;
  documentFile?: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  type: 'EMERGENCY' | 'TELEOPERATOR';
  name: string;
  phone: string;
}

export interface CustomIds {
  crmId?: string;
  badgeId?: string;
  payrollCode?: string;
}
