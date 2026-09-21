import { GameOwnedDto } from 'src/app/api-steam/dto/game-owned.dto';
import { gameIdSchema } from 'src/utils/types/game-id';

export const gameOwnedFixture: GameOwnedDto = {
  gameId: gameIdSchema.parse(730),
  name: 'Counter-Strike 2',
  playtimeForever: 120,
  imgIconUrl: 'icon',
  rtimeLastPlayed: 1_700_000_000,
};
