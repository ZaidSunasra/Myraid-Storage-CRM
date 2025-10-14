import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../libs/prisma";

const checkDepartment = (allowedDepartment?: string[], permissionKey?: string | string[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = res.locals.user;

      if (allowedDepartment) {
        if (allowedDepartment.includes(user.department)) return next();
        return res.status(403).json({ message: "Access denied: department not allowed" });
      }

      if (permissionKey) {
        const keys = Array.isArray(permissionKey) ? permissionKey : [permissionKey];

        const permissions = await prisma.permission.findMany({
          where: { permission_key: { in: keys } },
        });

        if (permissions.length === 0) {
          return res.status(404).json({ message: "Permissions not found" });
        }

        const hasAccess = permissions.some((perm) =>
          perm.allowed_dept.includes(user.department)
        );

        if (hasAccess) return next();

        return res.status(403).json({ message: "Access denied: permission not allowed" });
      }

      return res.status(403).json({ message: "No permission configuration found" });
    } catch (error) {
      console.error("Error checking permission:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

export default checkDepartment;
