import { GameReviewDto } from "src/app/api-steam/dto/game-reviews.dto";

export const gameReviewFixture: GameReviewDto = {
  reviewCount: 100,
  reviewScore: 9,
  reviewScoreDescription: 'Very Positive',
  totalPositive: 90,
  totalNegative: 10,
  totalReviews: 100,
};
