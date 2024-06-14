import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptors implements NestInterceptor { 
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        const { nombre, dni, country, city, address, email, password } = request.body;
        request.user = { nombre, dni, country, city, address, email, password };
        return next.handle();
    }    
}