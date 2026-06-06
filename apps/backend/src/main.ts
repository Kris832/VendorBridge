import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './common/services/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.onModuleInit();

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('VendorBridge API')
    .setDescription('Procurement & Vendor Management ERP API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer('http://localhost:3001', 'Development')
    .addServer('https://api.vendorbridge.com', 'Production')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Vendors', 'Vendor management')
    .addTag('RFQ', 'Request for Quotation')
    .addTag('Quotations', 'Quotation management')
    .addTag('Purchase Orders', 'PO management')
    .addTag('Invoices', 'Invoice management')
    .addTag('Reports', 'Reporting')
    .addTag('Dashboard', 'Dashboard metrics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  const host = process.env.API_HOST || '0.0.0.0';
  await app.listen(port, host);

  console.log(`✅ VendorBridge Backend running on http://${host}:${port}`);
  console.log(`📚 Swagger docs available at http://${host}:${port}/api/docs`);
}

bootstrap();
