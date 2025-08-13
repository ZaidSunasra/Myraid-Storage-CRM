import { DEPARTMENTS, type department } from "zs-crm-common";

type Feature = "sales_admin" | "drawing";

const PERMISSIONS: Record<Feature, department[]> = {
  sales_admin: [DEPARTMENTS[0], DEPARTMENTS[1]],
  drawing: [DEPARTMENTS[3]]
} as const;

export const canView = (department: department, feature: Feature): boolean => {
  return PERMISSIONS[feature].includes(department);
};
