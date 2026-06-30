// test-data/userData.ts
import { UserDataInputs } from '../src/pages/user-management/CreateUserPage';

// Unique suffixes help prevent test collisions on repeated runs
const uniqueId = Date.now();

export const createUserData: UserDataInputs = {
  role: 'IIC',
  name: `Automated Creator ${uniqueId}`,
  email: `create_${uniqueId}@robowealth.com`,
  phone: '0812345678',
  iicCode: `IIC-${uniqueId.toString().slice(-4)}`,
  citizenId: '1100101234567',
  addressNumber: '123/45',
  addressSubdistrict: 'คลองเตย',
  addressDistrict: 'คลองเตย',
  addressProvince: 'กรุงเทพมหานคร',
  addressPostalCode: '10110',
  vatOption: 'No'
};

export const editAllFieldsData: UserDataInputs = {
  role: 'IIC',
  name: `Updated Full Name ${uniqueId}`,
  email: `edit_all_${uniqueId}@robowealth.com`,
  phone: '0898765432',
  iicCode: `IIC-${uniqueId.toString().slice(-4)}`,
  citizenId: '1100101234567',
  addressNumber: '999/99',
  addressMoo: '5',
  addressBuilding: 'Robowealth Tower',
  addressSoi: 'สุขุมวิท 23',
  addressRoad: 'สุขุมวิท',
  addressSubdistrict: 'คลองเตยเหนือ',
  addressDistrict: 'วัฒนา',
  addressProvince: 'กรุงเทพมหานคร',
  addressPostalCode: '10110',
  bankBranch: '0023',
  bankAccountNumber: '1234567890',
  vatOption: 'Yes',
  password: 'SecurePassword123!'
};

export const editRequiredFieldsOnlyData: Partial<UserDataInputs> = {
  name: `Min Edit ${uniqueId}`,
  email: `edit_min_${uniqueId}@robowealth.com`,
  phone: '0855555555',
  iicCode: `IIC-${uniqueId.toString().slice(-4)}`,
  citizenId: '1100101234567'
};