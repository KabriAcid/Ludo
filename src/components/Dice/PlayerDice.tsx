import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { PlayerColor } from '../../types';
import { PLAYER_COLORS } from '../../utils/boardConfig';

// Import dice images
const diceImages = [
    '/dice-1.png',
    '/dice-2.png',
    '/dice-3.png',
    '/dice-4.png',
    '/dice-5.png',
    '/dice-6.png',
];

interface PlayerDiceProps {
    playerId: PlayerColor;
    cellSize: number;
    position: { x: number; y: number };
}

export const PlayerDice: React.FC<PlayerDiceProps> = ({ playerId, cellSize, position }) => {
    const { currentPlayer, diceValue, isRolling, hasRolled, rollDice, canRollAgain } = useGameStore();

    const isCurrentPlayer = currentPlayer === playerId;
    const canRoll = isCurrentPlayer && !isRolling && (!hasRolled || canRollAgain);
    const diceSize = Math.max(cellSize * 1.4, 32);

    // Show dice value for current player, or default dice for others
    const currentDiceImage = isCurrentPlayer && diceValue
        ? diceImages[diceValue - 1]
        : diceImages[0];

    return (
        <motion.div
            className="absolute flex flex-col items-center"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                zIndex: isCurrentPlayer ? 50 : 10,
            }}
            animate={isCurrentPlayer ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
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
                animate={isRolling && isCurrentPlayer ? {
                    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: isRolling && isCurrentPlayer ? Infinity : 0 }}
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

            {/* Roll again indicator */}
            {isCurrentPlayer && canRollAgain && (
                <motion.div
                    className="absolute -bottom-5 text-[10px] font-bold text-yellow-400 whitespace-nowrap"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Roll again!
                </motion.div>
            )}

            {/* Tap to roll indicator */}
            {canRoll && !canRollAgain && (
                <motion.div
                    className="absolute -bottom-5 text-[10px] font-medium text-white/80 whitespace-nowrap"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Tap to roll
                </motion.div>
            )}
        </motion.div>
    );
};
