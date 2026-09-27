import z from 'zod';

export const personnalScoreSchema = z.literal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

export type PersonnalScore = z.infer<typeof personnalScoreSchema>;
