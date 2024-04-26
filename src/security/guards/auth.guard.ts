import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const authToken = req?.headers?.['authorization'];

    if (!authToken) {
      return false;
    }

    if (this.configService.getOrThrow<string>('AUTH_TOKEN') !== authToken) {
      return false;
    }

    return true;
  }
}
