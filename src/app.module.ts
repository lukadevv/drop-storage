import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContextsModule } from './contexts/contexts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      cache: true,
      isGlobal: true,
    }),
    ContextsModule,
  ],
})
export class AppModule {}
