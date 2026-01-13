import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { PlayerColor } from '../../types';
import { PLAYER_COLORS } from '../../utils/boardConfig';

// Import dice images from public/icons
const diceImages = [
    '/icons/dice-1.svg',
    '/icons/dice-2.svg',
    '/icons/dice-3.svg',
    '/icons/dice-4.svg',
    '/icons/dice-5.svg',
    '/icons/dice-6.svg',
];

interface PlayerDiceProps {
    playerId: PlayerColor;
    cellSize: number;
    position?: { x: number; y: number };
}

export const PlayerDice: React.FC<PlayerDiceProps> = ({ playerId, cellSize }) => {
    const { currentPlayer, diceValue, hasRolled, rollDice, canRollAgain } = useGameStore();

    const isCurrentPlayer = currentPlayer === playerId;
    const canRoll = isCurrentPlayer && (!hasRolled || canRollAgain);
    const diceSize = Math.max(cellSize * 1.3, 36);

    // Show dice value for current player, or default dice for others
    const currentDiceImage = isCurrentPlayer && diceValue
        ? diceImages[diceValue - 1]
        : diceImages[0];

    return (
        <motion.div
            className="flex flex-col items-center"
            style={{
                zIndex: isCurrentPlayer ? 50 : 10,
            }}
            animate={isCurrentPlayer && canRoll ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
        >
            <motion.button
                onClick={canRoll ? rollDice : undefined}
                disabled={!canRoll}
                className={`relative rounded-lg shadow-lg ${canRoll
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                    } ${!isCurrentPlayer ? 'opacity-40 grayscale' : ''}`}
                style={{
                    width: diceSize,
                    height: diceSize,
                }}
                whileHover={canRoll ? { scale: 1.1 } : {}}
                whileTap={canRoll ? { scale: 0.9 } : {}}
            >
                <img
                    src={currentDiceImage}
                    alt={`Dice for ${playerId}`}
                    className="w-full h-full object-contain rounded-lg"
                />

                {/* Glow effect when can roll */}
                {canRoll && (
                    <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{
                            border: `3px solid ${PLAYER_COLORS[playerId]}`,
                        }}
                        animate={{
                            boxShadow: [
                                `0 0 8px ${PLAYER_COLORS[playerId]}`,
                                `0 0 20px ${PLAYER_COLORS[playerId]}`,
                                `0 0 8px ${PLAYER_COLORS[playerId]}`
                            ]
                        }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                    />
                )}

                {/* Player color indicator ring */}
                <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                        border: `2px solid ${PLAYER_COLORS[playerId]}`,
                        opacity: isCurrentPlayer ? 1 : 0.5,
                    }}
                />
            </motion.button>
        </motion.div>
    );
};
