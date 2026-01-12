// Player colors
export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

// Game modes
export type GameMode = 'classic' | 'oneTokenOut' | 'firstTokenHome';

// Token state
export interface Token {
    id: string;
    playerId: PlayerColor;
    position: number; // -1 = in base, 0-56 = on track, 100-105 = home stretch
    isHome: boolean;
    isOut: boolean;
}

// Player state
export interface Player {
    id: PlayerColor;
    name: string;
    tokens: Token[];
    hasWon: boolean;
    rank: number | null;
}

// Game state
export interface GameState {
    mode: GameMode;
    players: Player[];
    currentPlayer: PlayerColor;
    diceValue: number | null;
    isRolling: boolean;
    hasRolled: boolean;
    canRollAgain: boolean;
    gamePhase: 'menu' | 'playing' | 'finished';
    rankings: PlayerColor[];
    soundEnabled: boolean;
    musicEnabled: boolean;
}

// Board cell types
export type CellType = 'normal' | 'safe' | 'start' | 'home-entry' | 'home-path' | 'home';

// Board cell
export interface BoardCell {
    id: string;
    type: CellType;
    position: number;
    color?: PlayerColor;
    x: number;
    y: number;
}

// Game statistics
export interface GameStats {
    totalRolls: Record<PlayerColor, number>;
    totalKills: Record<PlayerColor, number>;
    sixes: Record<PlayerColor, number>;
    tokensHome: Record<PlayerColor, number>;
}

// Sound types
export type SoundType = 'diceRoll' | 'tokenMove' | 'kill' | 'celebration' | 'click';

// Screen types
export type Screen = 'menu' | 'game' | 'results';
