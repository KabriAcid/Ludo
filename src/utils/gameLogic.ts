import { Token, Player, PlayerColor, GameState, GameMode } from '../types';
import {
    PLAYER_ORDER,
    getAbsolutePosition,
    isSafePosition,
} from './boardConfig';

// Create initial tokens for a player
export function createTokens(playerId: PlayerColor, mode: GameMode): Token[] {
    return Array.from({ length: 4 }, (_, index) => ({
        id: `${playerId}-${index}`,
        playerId,
        // In "One Token Out" mode, first token starts outside
        position: mode === 'oneTokenOut' && index === 0 ? 0 : -1,
        isHome: false,
        isOut: mode === 'oneTokenOut' && index === 0,
    }));
}

// Create initial players
export function createPlayers(mode: GameMode): Player[] {
    return PLAYER_ORDER.map((color) => ({
        id: color,
        name: color.charAt(0).toUpperCase() + color.slice(1),
        tokens: createTokens(color, mode),
        hasWon: false,
        rank: null,
    }));
}

// Create initial game state
export function createInitialGameState(mode: GameMode): GameState {
    return {
        mode,
        players: createPlayers(mode),
        currentPlayer: 'red',
        diceValue: null,
        isRolling: false,
        hasRolled: false,
        canRollAgain: false,
        gamePhase: 'playing',
        rankings: [],
        soundEnabled: true,
        musicEnabled: false,
    };
}

// Roll dice
export function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
}

// Check if a token can move
export function canTokenMove(token: Token, diceValue: number, _player: Player): boolean {
    // Token is already home
    if (token.isHome) return false;

    // Token is in base - needs 6 to come out
    if (!token.isOut) {
        return diceValue === 6;
    }

    // Token is on the board
    const newPosition = token.position + diceValue;

    // Check if moving into home stretch
    // Max position is 56 to enter home + 6 home cells

    // If in home stretch (100+), calculate remaining spaces
    if (token.position >= 100) {
        const homePosition = token.position - 100;
        const newHomePosition = homePosition + diceValue;
        // Must land exactly on home (position 5 is the final home cell)
        return newHomePosition <= 5;
    }

    // Check if token should enter home stretch
    if (token.position <= 50 && newPosition > 50) {
        // Token is entering home stretch
        const stepsIntoHome = newPosition - 51;
        return stepsIntoHome <= 5; // Must not overshoot
    }

    // Normal movement on main track
    return newPosition <= 51; // Can move up to home entry
}

// Get all movable tokens for current player
export function getMovableTokens(player: Player, diceValue: number): Token[] {
    return player.tokens.filter((token) => canTokenMove(token, diceValue, player));
}

// Calculate new position after move
export function calculateNewPosition(token: Token, diceValue: number): number {
    // Token coming out of base
    if (!token.isOut) {
        return 0; // Start position
    }

    // Token in home stretch
    if (token.position >= 100) {
        return token.position + diceValue;
    }

    // Token on main track
    const newPosition = token.position + diceValue;

    // Entering home stretch
    if (token.position <= 50 && newPosition > 50) {
        return 100 + (newPosition - 51);
    }

    return newPosition;
}

// Check if token reached home
export function isTokenHome(position: number): boolean {
    return position >= 105; // Position 105 is the final home cell
}

// Get tokens at a specific absolute position (for collision detection)
export function getTokensAtPosition(
    players: Player[],
    absolutePosition: number,
    excludePlayer?: PlayerColor
): Token[] {
    const tokensAtPosition: Token[] = [];

    players.forEach((player) => {
        if (excludePlayer && player.id === excludePlayer) return;

        player.tokens.forEach((token) => {
            if (token.isOut && !token.isHome && token.position < 100) {
                const tokenAbsPos = getAbsolutePosition(player.id, token.position);
                if (tokenAbsPos === absolutePosition) {
                    tokensAtPosition.push(token);
                }
            }
        });
    });

    return tokensAtPosition;
}

// Check if a kill will happen
export function checkForKill(
    movingToken: Token,
    newPosition: number,
    players: Player[]
): Token | null {
    // Can't kill in home stretch
    if (newPosition >= 100) return null;

    // Get absolute position of the moving token's new position
    const absoluteNewPos = getAbsolutePosition(movingToken.playerId, newPosition);

    // Can't kill on safe positions
    if (isSafePosition(absoluteNewPos)) return null;

    // Check for enemy tokens at this position
    const enemyTokens = getTokensAtPosition(players, absoluteNewPos, movingToken.playerId);

    // Return the first enemy token (to be killed)
    return enemyTokens.length > 0 ? enemyTokens[0] : null;
}

// Check if player has won
export function checkPlayerWin(player: Player, mode: GameMode): boolean {
    if (mode === 'firstTokenHome') {
        // First token home wins
        return player.tokens.some((token) => token.isHome);
    }

    // Standard win - all tokens home
    return player.tokens.every((token) => token.isHome);
}

// Get next player
export function getNextPlayer(currentPlayer: PlayerColor, players: Player[]): PlayerColor {
    const currentIndex = PLAYER_ORDER.indexOf(currentPlayer);
    let nextIndex = (currentIndex + 1) % 4;

    // Skip players who have already won
    let attempts = 0;
    while (players[nextIndex].hasWon && attempts < 4) {
        nextIndex = (nextIndex + 1) % 4;
        attempts++;
    }

    return PLAYER_ORDER[nextIndex];
}

// Check if game is finished
export function isGameFinished(players: Player[], mode: GameMode): boolean {
    if (mode === 'firstTokenHome') {
        // Game ends when all players have at least one token home (or rankings filled)
        return players.filter((p) => p.hasWon).length === 4;
    }

    // Standard mode - game ends when 3 players have finished
    return players.filter((p) => p.hasWon).length >= 3;
}

// Check if player can roll again (rolled a 6 and moved)
export function canRollAgain(diceValue: number, movedToken: boolean): boolean {
    return diceValue === 6 && movedToken;
}
