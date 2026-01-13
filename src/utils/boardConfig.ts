import { PlayerColor } from '../types';

// Board dimensions (15x15 grid)
export const BOARD_SIZE = 15;

// Starting positions for each player (where tokens enter the main track)
// Standard: Red (top-left), Blue (top-right), Yellow (bottom-right), Green (bottom-left)
export const START_POSITIONS: Record<PlayerColor, number> = {
    red: 0,
    blue: 39,
    yellow: 26,
    green: 13,
};

// Home entry positions (where tokens turn into home stretch)
export const HOME_ENTRY_POSITIONS: Record<PlayerColor, number> = {
    red: 50,
    blue: 37,
    yellow: 24,
    green: 11,
};

// Safe positions on the main track (cannot be killed)
export const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

// Path length (main track)
export const MAIN_TRACK_LENGTH = 52;

// Home stretch length
export const HOME_STRETCH_LENGTH = 6;

// Token base positions in each player's home base
// Standard Ludo: Red (top-left), Green (bottom-left), Yellow (bottom-right), Blue (top-right)
export const BASE_POSITIONS: Record<PlayerColor, { x: number; y: number }[]> = {
    red: [
        { x: 1.5, y: 1.5 },
        { x: 3.5, y: 1.5 },
        { x: 1.5, y: 3.5 },
        { x: 3.5, y: 3.5 },
    ],
    blue: [
        { x: 10.5, y: 1.5 },
        { x: 12.5, y: 1.5 },
        { x: 10.5, y: 3.5 },
        { x: 12.5, y: 3.5 },
    ],
    yellow: [
        { x: 10.5, y: 10.5 },
        { x: 12.5, y: 10.5 },
        { x: 10.5, y: 12.5 },
        { x: 12.5, y: 12.5 },
    ],
    green: [
        { x: 1.5, y: 10.5 },
        { x: 3.5, y: 10.5 },
        { x: 1.5, y: 12.5 },
        { x: 3.5, y: 12.5 },
    ],
};

// Main track path coordinates (clockwise from red start)
export const MAIN_TRACK_COORDS: { x: number; y: number }[] = [
    // Red start going right
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 6, y: 4 },
    { x: 6, y: 5 },
    // Turn down
    { x: 5, y: 6 },
    { x: 4, y: 6 },
    { x: 3, y: 6 },
    { x: 2, y: 6 },
    { x: 1, y: 6 },
    { x: 0, y: 6 },
    // Turn to green side
    { x: 0, y: 7 },
    { x: 0, y: 8 },
    // Green start going down
    { x: 1, y: 8 },
    { x: 2, y: 8 },
    { x: 3, y: 8 },
    { x: 4, y: 8 },
    { x: 5, y: 8 },
    // Turn right
    { x: 6, y: 9 },
    { x: 6, y: 10 },
    { x: 6, y: 11 },
    { x: 6, y: 12 },
    { x: 6, y: 13 },
    { x: 6, y: 14 },
    // Turn to yellow side
    { x: 7, y: 14 },
    { x: 8, y: 14 },
    // Yellow start going left
    { x: 8, y: 13 },
    { x: 8, y: 12 },
    { x: 8, y: 11 },
    { x: 8, y: 10 },
    { x: 8, y: 9 },
    // Turn up
    { x: 9, y: 8 },
    { x: 10, y: 8 },
    { x: 11, y: 8 },
    { x: 12, y: 8 },
    { x: 13, y: 8 },
    { x: 14, y: 8 },
    // Turn to blue side
    { x: 14, y: 7 },
    { x: 14, y: 6 },
    // Blue start going up
    { x: 13, y: 6 },
    { x: 12, y: 6 },
    { x: 11, y: 6 },
    { x: 10, y: 6 },
    { x: 9, y: 6 },
    // Turn left
    { x: 8, y: 5 },
    { x: 8, y: 4 },
    { x: 8, y: 3 },
    { x: 8, y: 2 },
    { x: 8, y: 1 },
    { x: 8, y: 0 },
    // Back to red side
    { x: 7, y: 0 },
    { x: 6, y: 0 },
];

// Home stretch coordinates for each player
// Swapped green and blue to match the standard Ludo layout
export const HOME_STRETCH_COORDS: Record<PlayerColor, { x: number; y: number }[]> = {
    red: [
        { x: 7, y: 1 },
        { x: 7, y: 2 },
        { x: 7, y: 3 },
        { x: 7, y: 4 },
        { x: 7, y: 5 },
        { x: 7, y: 6 }, // Home center
    ],
    blue: [
        { x: 13, y: 7 },
        { x: 12, y: 7 },
        { x: 11, y: 7 },
        { x: 10, y: 7 },
        { x: 9, y: 7 },
        { x: 8, y: 7 }, // Home center
    ],
    yellow: [
        { x: 7, y: 13 },
        { x: 7, y: 12 },
        { x: 7, y: 11 },
        { x: 7, y: 10 },
        { x: 7, y: 9 },
        { x: 7, y: 8 }, // Home center
    ],
    green: [
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
        { x: 4, y: 7 },
        { x: 5, y: 7 },
        { x: 6, y: 7 }, // Home center
    ],
};

// Get absolute position on board from player-relative position
export function getAbsolutePosition(playerColor: PlayerColor, relativePosition: number): number {
    if (relativePosition < 0) return -1; // In base
    if (relativePosition >= 100) return relativePosition; // In home stretch

    const startPos = START_POSITIONS[playerColor];
    return (startPos + relativePosition) % MAIN_TRACK_LENGTH;
}

// Get board coordinates from position
export function getPositionCoords(
    playerColor: PlayerColor,
    position: number,
    tokenIndex: number
): { x: number; y: number } {
    // In base
    if (position < 0) {
        return BASE_POSITIONS[playerColor][tokenIndex];
    }

    // In home stretch (100-105)
    if (position >= 100) {
        const homeIndex = position - 100;
        return HOME_STRETCH_COORDS[playerColor][homeIndex];
    }

    // On main track
    const absolutePos = getAbsolutePosition(playerColor, position);
    return MAIN_TRACK_COORDS[absolutePos];
}

// Check if position is safe
export function isSafePosition(absolutePosition: number): boolean {
    return SAFE_POSITIONS.includes(absolutePosition);
}

// Get player order (clockwise from red)
export const PLAYER_ORDER: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];

// Player display names
export const PLAYER_NAMES: Record<PlayerColor, string> = {
    red: 'Red',
    green: 'Green',
    yellow: 'Yellow',
    blue: 'Blue',
};

// Player CSS colors (Premium RGB colors)
export const PLAYER_COLORS: Record<PlayerColor, string> = {
    red: 'rgb(220, 38, 38)',      // Premium Red
    green: 'rgb(34, 197, 94)',    // Premium Green
    yellow: 'rgb(250, 204, 21)',  // Premium Yellow/Gold
    blue: 'rgb(59, 130, 246)',    // Premium Blue
};

export const PLAYER_BG_CLASSES: Record<PlayerColor, string> = {
    red: 'bg-red-600',
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
};

export const PLAYER_BORDER_CLASSES: Record<PlayerColor, string> = {
    red: 'border-red-600',
    green: 'border-green-500',
    yellow: 'border-yellow-400',
    blue: 'border-blue-500',
};
