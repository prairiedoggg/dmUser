import 'reflect-metadata'; // Must be the first import
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import Swagger classes

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger (OpenAPI) Document Setup
  const config = new DocumentBuilder()
    .setTitle('DreamIn User API') // Set the title of the API
    .setDescription('API documentation for the DreamIn User Management service') // Set the description
    .setVersion('1.0') // Set the version
    // .addTag('auth') // Add tags for grouping endpoints (optional)
    // .addBearerAuth() // If you use JWT Bearer tokens (optional)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Mount Swagger UI at /api-docs

  // Get port from environment variables via ConfigService
  const configService = app.get(ConfigService);
  // Use the registered appConfig namespace 'app' to get the port
  const port = configService.get<number>('app.port') || 3001; // Correctly access nested config

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api-docs`); // Log Swagger URL
}
bootstrap();
