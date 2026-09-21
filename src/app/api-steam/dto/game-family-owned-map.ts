import { GameId } from 'src/utils/types/game-id';
import { GameOwnedDto } from './game-owned.dto';

export type GameFamilyOwnedMap = Map<GameId, GameOwnedDto>;
