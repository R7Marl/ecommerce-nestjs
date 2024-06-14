import { SetMetadata } from "@nestjs/common";
import { Roles as Role } from "../utils/roles/role.enum";

export const Roles = (...roles:Role[]) => SetMetadata('roles', roles) 