import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { PLAYER_COLORS, PLAYER_NAMES } from '../../utils/boardConfig';

export const ResultsScreen: React.FC = () => {
    const { rankings, players, stats, mode, goToMenu, initGame } = useGameStore();

    const handlePlayAgain = () => {
        initGame(mode);
    };

    const handleChangeMode = () => {
        goToMenu();
    };

    const trophies = ['🥇', '🥈', '🥉', '4️⃣'];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Title */}
            <motion.div
                className="text-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-bold text-white mb-2"
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
                <p className="text-xl text-blue-200">
                    {mode === 'firstTokenHome' ? 'First Token Home Mode' : 'One Token Out Mode'}
                </p>
            </motion.div>

            {/* Rankings */}
            <motion.div
                className="w-full max-w-md space-y-3 mb-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {rankings.map((playerId, index) => {
                    return (
                        <motion.div
                            key={playerId}
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{
                                backgroundColor: `${PLAYER_COLORS[playerId]}22`,
                                borderLeft: `4px solid ${PLAYER_COLORS[playerId]}`,
                            }}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <span className="text-3xl">{trophies[index]}</span>
                            <div
                                className="w-10 h-10 rounded-full"
                                style={{ backgroundColor: PLAYER_COLORS[playerId] }}
                            />
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg">
                                    {PLAYER_NAMES[playerId]}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {index === 0 ? 'Winner!' : `${index + 1}${['st', 'nd', 'rd', 'th'][index]} Place`}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Stats */}
            <motion.div
                className="w-full max-w-md mb-8 p-4 bg-white/5 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <h3 className="text-white font-bold mb-4 text-center">📊 Match Statistics</h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                    {(['red', 'green', 'yellow', 'blue'] as const).map((color) => (
                        <div key={color} className="space-y-2">
                            <div
                                className="w-8 h-8 rounded-full mx-auto"
                                style={{ backgroundColor: PLAYER_COLORS[color] }}
                            />
                            <div className="text-xs text-gray-400">
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
                className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.button
                    onClick={handlePlayAgain}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 
                     text-white rounded-xl font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🔄 Play Again
                </motion.button>

                <motion.button
                    onClick={handleChangeMode}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 
                     text-white rounded-xl font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🎮 Change Mode
                </motion.button>
            </motion.div>
        </div>
    );
};
