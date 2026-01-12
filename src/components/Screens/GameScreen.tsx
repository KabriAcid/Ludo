import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Board } from '../Board/Board';
import { Dice } from '../Dice/Dice';
import { PLAYER_COLORS, PLAYER_NAMES } from '../../utils/boardConfig';

export const GameScreen: React.FC = () => {
    const {
        players,
        currentPlayer,
        mode,
        soundEnabled,
        musicEnabled,
        toggleSound,
        toggleMusic,
        goToMenu,
    } = useGameStore();

    const [boardSize, setBoardSize] = useState(300);

    useEffect(() => {
        const updateBoardSize = () => {
            const maxWidth = window.innerWidth - 32;
            const maxHeight = window.innerHeight - 200;
            const size = Math.min(maxWidth, maxHeight, 500);
            setBoardSize(size);
        };

        updateBoardSize();
        window.addEventListener('resize', updateBoardSize);
        return () => window.removeEventListener('resize', updateBoardSize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-4 pb-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <div className="w-full max-w-lg flex justify-between items-center mb-2">
                <button
                    onClick={goToMenu}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                >
                    ← Menu
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={toggleSound}
                        className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-blue-600' : 'bg-gray-700'
                            }`}
                    >
                        {soundEnabled ? '🔊' : '🔇'}
                    </button>
                    <button
                        onClick={toggleMusic}
                        className={`p-2 rounded-lg transition-colors ${musicEnabled ? 'bg-blue-600' : 'bg-gray-700'
                            }`}
                    >
                        🎵
                    </button>
                </div>
            </div>

            {/* Player Status Bar */}
            <div className="w-full max-w-lg flex justify-around mb-3">
                {players.map((player) => (
                    <motion.div
                        key={player.id}
                        className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all ${currentPlayer === player.id
                                ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110'
                                : 'opacity-60'
                            }`}
                        style={{ backgroundColor: PLAYER_COLORS[player.id] }}
                        animate={currentPlayer === player.id ? {
                            boxShadow: ['0 0 10px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.8)', '0 0 10px rgba(255,255,255,0.5)']
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <span className="text-white font-bold text-sm">{PLAYER_NAMES[player.id]}</span>
                        <div className="flex gap-1 mt-1">
                            {player.tokens.map((token) => (
                                <div
                                    key={token.id}
                                    className={`w-2 h-2 rounded-full ${token.isHome
                                            ? 'bg-green-400'
                                            : token.isOut
                                                ? 'bg-white'
                                                : 'bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>
                        {player.hasWon && (
                            <span className="text-xs mt-1">🏆 #{player.rank}</span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Game Board */}
            <div className="flex-1 flex items-center justify-center">
                <Board size={boardSize} />
            </div>

            {/* Dice Area */}
            <div className="mt-4">
                <Dice />
            </div>

            {/* Mode Indicator */}
            <div className="mt-2 text-xs text-gray-400">
                {mode === 'oneTokenOut' ? '🚀 One Token Out Mode' : '🏆 First Token Home Mode'}
            </div>
        </div>
    );
};
