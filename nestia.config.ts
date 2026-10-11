import { INestiaConfig } from '@nestia/sdk';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app/app.module';

export default {
  input: () => NestFactory.create<INestApplication>(AppModule),
  output: 'sdk',
  clone: true,
  primitive: false,
  distribute: 'packages/sdk',
} satisfies INestiaConfig;
