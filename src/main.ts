import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { createServer } from 'http';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable HTTP request logging using Morgan
  // Options include: 'combined', 'common', 'dev', 'tiny', 'combined' logs more details
  app.use(morgan('dev'));

  // Enable CORS for the entire application
  app.enableCors({
    origin: '*', // Adjust this origin to match your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const httpServer = createServer(app.getHttpAdapter().getInstance());
  app.useWebSocketAdapter(new IoAdapter(httpServer));

  await app.listen(3000);
}
bootstrap();
