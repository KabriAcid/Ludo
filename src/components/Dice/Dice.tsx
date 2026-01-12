import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

// Import dice images
const diceImages = [
    '/dice-1.png',
    '/dice-2.png',
    '/dice-3.png',
    '/dice-4.png',
    '/dice-5.png',
    '/dice-6.png',
];

export const Dice: React.FC = () => {
    const { diceValue, isRolling, hasRolled, rollDice, canRollAgain } = useGameStore();

    const canRoll = !isRolling && (!hasRolled || canRollAgain);

    const currentDiceImage = diceValue ? diceImages[diceValue - 1] : diceImages[0];

    return (
        <div className="flex flex-col items-center gap-3">
            <motion.button
                onClick={canRoll ? rollDice : undefined}
                disabled={!canRoll}
                className={`relative w-20 h-20 rounded-xl shadow-lg ${canRoll
                    ? 'cursor-pointer hover:scale-105 active:scale-95'
                    : 'cursor-not-allowed opacity-75'
                    } transition-transform`}
                animate={isRolling ? {
                    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
                whileTap={canRoll ? { scale: 0.9 } : {}}
            >
                <img
                    src={currentDiceImage}
                    alt={`Dice showing ${diceValue || 1}`}
                    className="w-full h-full object-contain rounded-xl"
                />

                {/* Glow effect when can roll */}
                {canRoll && (
                    <motion.div
                        className="absolute inset-0 rounded-xl border-4 border-white/50"
                        animate={{
                            boxShadow: [
                                '0 0 10px rgba(255,255,255,0.3)',
                                '0 0 25px rgba(255,255,255,0.6)',
                                '0 0 10px rgba(255,255,255,0.3)'
                            ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
            </motion.button>

            <div className="text-center">
                {canRoll && (
                    <motion.p
                        className="text-sm text-white/80"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Tap to roll
                    </motion.p>
                )}
                {hasRolled && diceValue && !canRollAgain && (
                    <motion.p
                        className="text-lg font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        You rolled {diceValue}!
                    </motion.p>
                )}
                {canRollAgain && (
                    <motion.p
                        className="text-sm text-yellow-400 font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Roll again!
                    </motion.p>
                )}
            </div>
        </div>
    );
};
