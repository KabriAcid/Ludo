import { create } from 'zustand';
import { GameState, GameMode, Token, GameStats } from '../types';
import {
    createInitialGameState,
    rollDice,
    getMovableTokens,
    calculateNewPosition,
    isTokenHome,
    checkForKill,
    checkPlayerWin,
    getNextPlayer,
    isGameFinished,
    canRollAgain,
} from '../utils/gameLogic';
// Board configuration is used through gameLogic
import { audioManager } from '../utils/audioManager';

interface GameStore extends GameState {
    stats: GameStats;

    // Actions
    initGame: (mode: GameMode) => void;
    rollDice: () => void;
    moveToken: (tokenId: string) => void;
    skipTurn: () => void;
    toggleSound: () => void;
    toggleMusic: () => void;
    goToMenu: () => void;

    // Computed
    getMovableTokens: () => Token[];
    getCurrentPlayer: () => import('../types').Player | undefined;
}

const initialStats: GameStats = {
    totalRolls: { red: 0, green: 0, yellow: 0, blue: 0 },
    totalKills: { red: 0, green: 0, yellow: 0, blue: 0 },
    sixes: { red: 0, green: 0, yellow: 0, blue: 0 },
    tokensHome: { red: 0, green: 0, yellow: 0, blue: 0 },
};

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial state
    mode: 'oneTokenOut',
    players: [],
    currentPlayer: 'red',
    diceValue: null,
    isRolling: false,
    hasRolled: false,
    canRollAgain: false,
    gamePhase: 'menu',
    rankings: [],
    soundEnabled: true,
    musicEnabled: false,
    stats: { ...initialStats },

    // Initialize game
    initGame: (mode: GameMode) => {
        audioManager.init();
        const initialState = createInitialGameState(mode);
        set({
            ...initialState,
            stats: {
                totalRolls: { red: 0, green: 0, yellow: 0, blue: 0 },
                totalKills: { red: 0, green: 0, yellow: 0, blue: 0 },
                sixes: { red: 0, green: 0, yellow: 0, blue: 0 },
                tokensHome: { red: 0, green: 0, yellow: 0, blue: 0 },
            },
        });
    },

    // Roll dice
    rollDice: () => {
        const state = get();
        if (state.isRolling || (state.hasRolled && !state.canRollAgain)) return;

        audioManager.play('diceRoll');

        set({ isRolling: true, diceValue: null });

        // Animate dice roll
        let rollCount = 0;
        const maxRolls = 10;
        const rollInterval = setInterval(() => {
            set({ diceValue: rollDice() });
            rollCount++;

            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);
                const finalValue = rollDice();

                set((state) => {
                    const newStats = { ...state.stats };
                    newStats.totalRolls[state.currentPlayer]++;
                    if (finalValue === 6) {
                        newStats.sixes[state.currentPlayer]++;
                    }

                    return {
                        diceValue: finalValue,
                        isRolling: false,
                        hasRolled: true,
                        canRollAgain: false,
                        stats: newStats,
                    };
                });

                // Check if player can move
                const updatedState = get();
                const currentPlayer = updatedState.players.find(
                    (p) => p.id === updatedState.currentPlayer
                );

                if (currentPlayer) {
                    const movableTokens = getMovableTokens(currentPlayer, finalValue);

                    if (movableTokens.length === 0) {
                        // No moves available, skip turn after delay
                        setTimeout(() => {
                            get().skipTurn();
                        }, 1000);
                    } else if (movableTokens.length === 1) {
                        // Auto-move if only one token can move
                        setTimeout(() => {
                            get().moveToken(movableTokens[0].id);
                        }, 500);
                    }
                }
            }
        }, 100);
    },

    // Move a token
    moveToken: (tokenId: string) => {
        const state = get();
        if (!state.hasRolled || state.diceValue === null) return;

        const currentPlayer = state.players.find((p) => p.id === state.currentPlayer);
        if (!currentPlayer) return;

        const token = currentPlayer.tokens.find((t) => t.id === tokenId);
        if (!token) return;

        const movableTokens = getMovableTokens(currentPlayer, state.diceValue);
        if (!movableTokens.some((t) => t.id === tokenId)) return;

        audioManager.play('tokenMove');

        const newPosition = calculateNewPosition(token, state.diceValue);
        const isGoingHome = isTokenHome(newPosition);
        const isComingOut = !token.isOut;

        // Check for kill
        let killedToken: Token | null = null;
        if (!isComingOut && newPosition < 100) {
            killedToken = checkForKill(token, newPosition, state.players);
        }

        if (killedToken) {
            audioManager.play('kill');
        }

        // Update state
        set((state) => {
            const newPlayers = state.players.map((player) => {
                // Update moving player's token
                if (player.id === state.currentPlayer) {
                    return {
                        ...player,
                        tokens: player.tokens.map((t) => {
                            if (t.id === tokenId) {
                                return {
                                    ...t,
                                    position: newPosition,
                                    isOut: true,
                                    isHome: isGoingHome,
                                };
                            }
                            return t;
                        }),
                    };
                }

                // Update killed token (send back to base)
                if (killedToken && player.tokens.some((t) => t.id === killedToken!.id)) {
                    return {
                        ...player,
                        tokens: player.tokens.map((t) => {
                            if (t.id === killedToken!.id) {
                                return {
                                    ...t,
                                    position: -1,
                                    isOut: false,
                                };
                            }
                            return t;
                        }),
                    };
                }

                return player;
            });

            // Update stats
            const newStats = { ...state.stats };
            if (killedToken) {
                newStats.totalKills[state.currentPlayer]++;
            }
            if (isGoingHome) {
                newStats.tokensHome[state.currentPlayer]++;
            }

            // Check for win
            const updatedCurrentPlayer = newPlayers.find((p) => p.id === state.currentPlayer);
            let newRankings = [...state.rankings];
            let gamePhase = state.gamePhase;

            if (updatedCurrentPlayer && checkPlayerWin(updatedCurrentPlayer, state.mode)) {
                if (!updatedCurrentPlayer.hasWon) {
                    audioManager.play('celebration');
                    newRankings.push(state.currentPlayer);

                    // Update player's win status
                    const playerIndex = newPlayers.findIndex((p) => p.id === state.currentPlayer);
                    newPlayers[playerIndex] = {
                        ...newPlayers[playerIndex],
                        hasWon: true,
                        rank: newRankings.length,
                    };

                    // Check if game is finished
                    if (isGameFinished(newPlayers, state.mode)) {
                        // Add remaining players to rankings
                        const remainingPlayers = newPlayers
                            .filter((p) => !p.hasWon)
                            .map((p) => p.id);
                        newRankings = [...newRankings, ...remainingPlayers];
                        gamePhase = 'finished';
                    }
                }
            }

            // Determine if player can roll again
            const shouldRollAgain = canRollAgain(state.diceValue!, true) &&
                !newPlayers.find((p) => p.id === state.currentPlayer)?.hasWon &&
                gamePhase !== 'finished';

            // Get next player if not rolling again
            const nextPlayer = shouldRollAgain
                ? state.currentPlayer
                : getNextPlayer(state.currentPlayer, newPlayers);

            return {
                players: newPlayers,
                rankings: newRankings,
                gamePhase,
                currentPlayer: shouldRollAgain ? state.currentPlayer : nextPlayer,
                hasRolled: shouldRollAgain ? false : false,
                canRollAgain: shouldRollAgain,
                diceValue: shouldRollAgain ? null : state.diceValue,
                stats: newStats,
            };
        });

        // If not rolling again, reset for next player
        const updatedState = get();
        if (!updatedState.canRollAgain && updatedState.gamePhase !== 'finished') {
            setTimeout(() => {
                set({ hasRolled: false, diceValue: null });
            }, 500);
        }
    },

    // Skip turn
    skipTurn: () => {
        set((state) => {
            const nextPlayer = getNextPlayer(state.currentPlayer, state.players);
            return {
                currentPlayer: nextPlayer,
                hasRolled: false,
                diceValue: null,
                canRollAgain: false,
            };
        });
    },

    // Toggle sound
    toggleSound: () => {
        set((state) => {
            const newValue = !state.soundEnabled;
            audioManager.setSoundEnabled(newValue);
            return { soundEnabled: newValue };
        });
    },

    // Toggle music
    toggleMusic: () => {
        set((state) => {
            const newValue = !state.musicEnabled;
            audioManager.setMusicEnabled(newValue);
            return { musicEnabled: newValue };
        });
    },

    // Go to menu
    goToMenu: () => {
        set({ gamePhase: 'menu' });
    },

    // Get movable tokens
    getMovableTokens: () => {
        const state = get();
        if (!state.hasRolled || state.diceValue === null) return [];

        const currentPlayer = state.players.find((p) => p.id === state.currentPlayer);
        if (!currentPlayer) return [];

        return getMovableTokens(currentPlayer, state.diceValue);
    },

    // Get current player
    getCurrentPlayer: () => {
        const state = get();
        return state.players.find((p) => p.id === state.currentPlayer);
    },
}));
