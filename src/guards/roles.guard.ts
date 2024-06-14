import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles as Role} from '../utils/roles/role.enum';
  
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	
	canActivate(context: ExecutionContext): boolean {
				const requiredRoles = 
			this.reflector.getAllAndOverride<Role[]>('roles', [
				context.getHandler(),
				context.getClass(),
			]);
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		console.log(user)
		const hasRole = () => requiredRoles.some((role) => user?.roles?.includes(role));
		const valid = user && user.roles && hasRole();
		if (!valid) throw new ForbiddenException('You do not have permission to access this resource');
		return valid;
	}
}