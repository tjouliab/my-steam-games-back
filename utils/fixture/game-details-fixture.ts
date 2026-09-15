import { GameDetailsDto } from 'src/api-steam/dto/game-details.dto';

export const gameDetailsFixture: GameDetailsDto = {
  releaseDate: new Date('2012-08-21T00:00:00.000Z'),
  metacriticScore: 88,
  genres: [],
  initialPrice: 1_499,
};
