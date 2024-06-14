import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if(!request.headers.authorization) throw new UnauthorizedException('API KEY is not found')
      const [type, token] = request.headers.authorization.split(' ');
      if(type !== 'Bearer') throw new UnauthorizedException('Invalid token type')
      if(!token) throw new UnauthorizedException('Token not found')
      try {
        const secret = process.env.JWT_SECRET;
        this.jwtService.verify(token, { secret })
        return true
      } catch (error) {
        throw new UnauthorizedException('Invalid token')
      }
  }
}