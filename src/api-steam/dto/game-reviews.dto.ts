import z from 'zod';

const querySummarySchema = z
  .object({
    num_reviews: z.int().nonnegative(),
    review_score: z.int().nonnegative(),
    review_score_desc: z.string(),
    total_positive: z.int().nonnegative(),
    total_negative: z.int().nonnegative(),
    total_reviews: z.int().nonnegative(),
  })
  .transform((query) => ({
    reviewCount: query.num_reviews,
    reviewScore: query.review_score,
    reviewScoreDescription: query.review_score_desc,
    totalPositive: query.total_positive,
    totalNegative: query.total_negative,
    totalReviews: query.total_reviews,
  }));

export const gameReviewsSchema = z
  .object({
    success: z.literal([0, 1]),
    query_summary: querySummarySchema,
  })
  .transform((response) => ({
    success: Boolean(response.success),
    gameReview: response.query_summary,
  }));

export type GameReviewDto = z.infer<typeof querySummarySchema>;
