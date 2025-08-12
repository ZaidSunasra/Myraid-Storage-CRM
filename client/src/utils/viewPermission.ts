import { DEPARTMENTS, type department } from "zs-crm-common";

export const PERMISSIONS : Record<string, department[]> = {
  sales_admin: [DEPARTMENTS[0], DEPARTMENTS[1]], 
  drawing: [DEPARTMENTS[3]]
} as const;

export const canView = (department: department, feature: keyof typeof PERMISSIONS) => {
  return PERMISSIONS[feature]?.includes(department);
};
