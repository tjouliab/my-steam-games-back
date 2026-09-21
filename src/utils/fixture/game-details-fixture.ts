import { GameDetailsDto } from 'src/app/api-steam/dto/game-details.dto';

export const gameDetailsFixture: GameDetailsDto = {
  releaseDate: Temporal.PlainDate.from('2012-08-21T00:00:00.000'),
  metacriticScore: 88,
  genres: [],
  initialPrice: 1_499,
};
