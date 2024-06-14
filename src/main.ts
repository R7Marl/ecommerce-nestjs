import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middlewares/logger.middleware';
import { connectSource } from './config/database';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
async function bootstrap() {
  await connectSource.initialize().catch(error => {
    console.error('Error during Data Source initialization', error);
});
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Esto transforma los tipos de los datos recibidos
}));
app.use(json())

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('The Ecommerce API describes the endpoints of the application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const start = performance.now();
  await app.listen(3000);
  const end = performance.now();
  console.log(`Server started in ${Math.floor(end - start)} ms`);
}
bootstrap();
