import { INestiaConfig } from '@nestia/sdk';

export default {
  input: {
    include: ['src/**/*.controller.ts'],
  },
  output: 'sdk',
  clone: true,
  primitive: false,
} satisfies INestiaConfig;
