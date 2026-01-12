import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { PLAYER_COLORS, PLAYER_NAMES } from '../../utils/boardConfig';

interface ResultsScreenProps {
    onPlayAgain: () => void;
    onGoToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onPlayAgain, onGoToMenu }) => {
    const { rankings, stats, mode } = useGameStore();

    const trophies = ['🥇', '🥈', '🥉', '4️⃣'];

    const getModeLabel = () => {
        switch (mode) {
            case 'classic': return 'Classic Mode';
            case 'oneTokenOut': return 'Quick Start Mode';
            case 'firstTokenHome': return 'Sprint Mode';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
            {/* Title */}
            <motion.div
                className="text-center mb-6 sm:mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
            >
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2"
                    animate={{
                        textShadow: [
                            '0 0 20px rgba(255,215,0,0.5)',
                            '0 0 40px rgba(255,215,0,0.8)',
                            '0 0 20px rgba(255,215,0,0.5)'
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🎉 Game Over! 🎉
                </motion.h1>
                <p className="text-lg sm:text-xl text-blue-200/90">
                    {getModeLabel()}
                </p>
            </motion.div>

            {/* Rankings */}
            <motion.div
                className="w-full max-w-md space-y-2 sm:space-y-3 mb-6 sm:mb-8 px-2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {rankings.map((playerId, index) => {
                    return (
                        <motion.div
                            key={playerId}
                            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl backdrop-blur-sm"
                            style={{
                                backgroundColor: `${PLAYER_COLORS[playerId]}33`,
                                borderLeft: `4px solid ${PLAYER_COLORS[playerId]}`,
                            }}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <span className="text-2xl sm:text-3xl">{trophies[index]}</span>
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg"
                                style={{ backgroundColor: PLAYER_COLORS[playerId] }}
                            />
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-base sm:text-lg">
                                    {PLAYER_NAMES[playerId]}
                                </h3>
                                <p className="text-gray-300/70 text-xs sm:text-sm">
                                    {index === 0 ? 'Winner!' : `${index + 1}${['st', 'nd', 'rd', 'th'][index]} Place`}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Stats */}
            <motion.div
                className="w-full max-w-md mb-6 sm:mb-8 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl mx-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <h3 className="text-white font-bold mb-3 sm:mb-4 text-center text-sm sm:text-base">📊 Match Statistics</h3>
                <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                    {(['red', 'blue', 'yellow', 'green'] as const).map((color) => (
                        <div key={color} className="space-y-1 sm:space-y-2">
                            <div
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mx-auto shadow"
                                style={{ backgroundColor: PLAYER_COLORS[color] }}
                            />
                            <div className="text-[10px] sm:text-xs text-gray-300">
                                <div>🎲 {stats.totalRolls[color]}</div>
                                <div>⚔️ {stats.totalKills[color]}</div>
                                <div>6️⃣ {stats.sixes[color]}</div>
                                <div>🏠 {stats.tokensHome[color]}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md px-2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.button
                    onClick={onPlayAgain}
                    className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-emerald-500 to-green-600 
                        text-white rounded-xl font-bold text-base sm:text-lg shadow-lg border border-emerald-400/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🔄 Play Again
                </motion.button>

                <motion.button
                    onClick={onGoToMenu}
                    className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-violet-500 to-purple-600 
                        text-white rounded-xl font-bold text-base sm:text-lg shadow-lg border border-violet-400/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🎮 Change Mode
                </motion.button>
            </motion.div>
        </div>
    );
};
