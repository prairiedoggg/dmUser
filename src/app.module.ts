import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import {
  appConfig,
  corsConfiguration,
  jwtConfiguration,
  supabaseConfiguration,
} from './config/env.config'; // Import registered configurations
import { UpdatesModule } from './modules/updates/updates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 환경 변수 사용 가능
      envFilePath: ['.env.development', '.env'], 
      load: [ // Load the registered configurations
        appConfig,
        supabaseConfiguration,
        jwtConfiguration,
        corsConfiguration
      ],
    }),
    AuthModule,
    UpdatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
