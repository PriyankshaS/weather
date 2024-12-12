import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherModule } from './weather/weather.module';
import { LocationsModule } from './location/locations.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import config from 'ormconfig';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    WeatherModule,
    HttpModule,
    TypeOrmModule.forRoot(config),
    LocationsModule,
    AuthModule,
    CacheModule.register({
      isGlobal : true, //to use caching in any module
    }),
    ConfigModule.forRoot({ isGlobal: true }), // To load the .env variables
    ThrottlerModule.forRoot([{
        limit: 5,
        ttl: 60000
    }]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD, 
      useClass: ThrottlerGuard,
    },
    AppService],
})
export class AppModule {}
