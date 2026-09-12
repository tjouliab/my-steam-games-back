import z from 'zod';

const querySummarySchema = z
  .object({
    num_reviews: z.int().positive(),
    review_score: z.int().positive(),
    review_score_desc: z.string(),
    total_positive: z.int().positive(),
    total_negative: z.int().positive(),
    total_reviews: z.int().positive(),
  })
  .transform((query) => ({
    reviewCount: query.num_reviews,
    reviewScore: query.review_score,
    reviewScoreDescription: query.review_score_desc,
    totalPositive: query.total_positive,
    totalNegative: query.total_negative,
    totalReviews: query.total_reviews,
  }));

const gameReviewsSchema = z
  .object({
    success: z.boolean(),
    query_summary: querySummarySchema,
  })
  .transform((response) => ({
    success: response.success,
    gameReview: response.query_summary,
  }));

export type GameReviewDto = z.infer<typeof querySummarySchema>;

export type GameReviewResponse = z.infer<typeof gameReviewsSchema>;
