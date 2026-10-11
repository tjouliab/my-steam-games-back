import { INestiaConfig } from '@nestia/sdk';

export default {
  input: {
    include: ['src/**/*.controller.ts'],
  },
  output: 'packages/sdk/src',
  distribute: 'packages/sdk',
  clone: true,
  primitive: false,
} satisfies INestiaConfig;
