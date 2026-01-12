import React from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '../../types';
import { useGameStore } from '../../store/gameStore';

interface MenuScreenProps {
    onStartGame: (mode: GameMode) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onStartGame }) => {
    const { soundEnabled, musicEnabled, toggleSound, toggleMusic } = useGameStore();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
            {/* Title */}
            <motion.div
                className="text-center mb-8 sm:mb-12"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
                    🎲 Ludo
                </h1>
                <p className="text-lg sm:text-xl text-blue-200/90">Classic Game, Modern Experience</p>
            </motion.div>

            {/* Game Mode Selection */}
            <motion.div
                className="w-full max-w-md space-y-3 sm:space-y-4 mb-6 sm:mb-8 px-2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h2 className="text-lg sm:text-xl text-white text-center mb-4 sm:mb-6 font-medium">Select Game Mode</h2>

                {/* Classic Mode */}
                <motion.button
                    onClick={() => onStartGame('classic')}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 
                        text-white shadow-lg hover:shadow-xl transition-all
                        border border-amber-400/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-3xl sm:text-4xl">🎯</span>
                        <div className="text-left">
                            <h3 className="text-lg sm:text-xl font-bold">Classic Mode</h3>
                            <p className="text-amber-100 text-xs sm:text-sm">
                                Traditional Ludo - Get all 4 tokens home to win!
                            </p>
                        </div>
                    </div>
                </motion.button>

                {/* Mode A - One Token Out */}
                <motion.button
                    onClick={() => onStartGame('oneTokenOut')}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 
                        text-white shadow-lg hover:shadow-xl transition-all
                        border border-emerald-400/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-3xl sm:text-4xl">🚀</span>
                        <div className="text-left">
                            <h3 className="text-lg sm:text-xl font-bold">Quick Start</h3>
                            <p className="text-emerald-100 text-xs sm:text-sm">
                                Start with 1 token already on the board!
                            </p>
                        </div>
                    </div>
                </motion.button>

                {/* Mode B - First Token Home */}
                <motion.button
                    onClick={() => onStartGame('firstTokenHome')}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 
                        text-white shadow-lg hover:shadow-xl transition-all
                        border border-violet-400/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-3xl sm:text-4xl">🏆</span>
                        <div className="text-left">
                            <h3 className="text-lg sm:text-xl font-bold">Sprint Mode</h3>
                            <p className="text-violet-100 text-xs sm:text-sm">
                                First player to get any token home wins!
                            </p>
                        </div>
                    </div>
                </motion.button>
            </motion.div>

            {/* Sound Controls */}
            <motion.div
                className="flex gap-3 sm:gap-4 mb-6 sm:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <button
                    onClick={toggleSound}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition-all text-sm sm:text-base
                        ${soundEnabled
                            ? 'bg-blue-600/80 text-white backdrop-blur-sm'
                            : 'bg-gray-700/60 text-gray-400 backdrop-blur-sm'}`}
                >
                    {soundEnabled ? '🔊' : '🔇'}
                    <span>Sound</span>
                </button>

                <button
                    onClick={toggleMusic}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition-all text-sm sm:text-base
                        ${musicEnabled
                            ? 'bg-blue-600/80 text-white backdrop-blur-sm'
                            : 'bg-gray-700/60 text-gray-400 backdrop-blur-sm'}`}
                >
                    {musicEnabled ? '🎵' : '🎵'}
                    <span>Music</span>
                </button>
            </motion.div>

            {/* Footer */}
            <motion.p
                className="text-gray-400 text-xs sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                4 Players • Human vs Human
            </motion.p>
        </div>
    );
};
