import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Board } from '../Board/Board';
import { PlayerDice } from '../Dice/PlayerDice';
import { ConfirmModal } from '../Modal/ConfirmModal';
import { PLAYER_COLORS, PLAYER_NAMES, BOARD_SIZE } from '../../utils/boardConfig';

interface GameScreenProps {
    onGoToMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGoToMenu }) => {
    const {
        players,
        currentPlayer,
        mode,
        soundEnabled,
        musicEnabled,
        toggleSound,
        toggleMusic,
    } = useGameStore();

    const [boardSize, setBoardSize] = useState(300);
    const [showExitModal, setShowExitModal] = useState(false);

    // Handle board size
    useEffect(() => {
        const updateBoardSize = () => {
            const maxWidth = window.innerWidth - 24;
            const maxHeight = window.innerHeight - 220;
            const size = Math.min(maxWidth, maxHeight, 520);
            setBoardSize(size);
        };

        updateBoardSize();
        window.addEventListener('resize', updateBoardSize);
        return () => window.removeEventListener('resize', updateBoardSize);
    }, []);

    // Prevent page reload/close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Prevent browser back button
    useEffect(() => {
        // Push a new state to history
        window.history.pushState(null, '', window.location.href);

        const handlePopState = (e: PopStateEvent) => {
            e.preventDefault();
            // Push state again to prevent going back
            window.history.pushState(null, '', window.location.href);
            // Show the exit confirmation modal
            setShowExitModal(true);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleMenuClick = useCallback(() => {
        setShowExitModal(true);
    }, []);

    const handleConfirmExit = useCallback(() => {
        setShowExitModal(false);
        onGoToMenu();
    }, [onGoToMenu]);

    const handleCancelExit = useCallback(() => {
        setShowExitModal(false);
    }, []);

    const getModeLabel = () => {
        switch (mode) {
            case 'classic': return '🎯 Classic';
            case 'oneTokenOut': return '🚀 Quick Start';
            case 'firstTokenHome': return '🏆 Sprint';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-3 sm:p-4 pb-4 sm:pb-6">
            {/* Exit Confirmation Modal */}
            <ConfirmModal
                isOpen={showExitModal}
                title="Leave Game?"
                message="Your current game progress will be lost. Are you sure you want to leave?"
                confirmText="Yes, Leave"
                cancelText="Continue Playing"
                onConfirm={handleConfirmExit}
                onCancel={handleCancelExit}
            />

            {/* Header */}
            <div className="w-full max-w-lg flex justify-between items-center mb-2">
                <button
                    onClick={handleMenuClick}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800/70 hover:bg-gray-700/80 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm transition-colors border border-gray-700/50"
                >
                    ← Menu
                </button>

                <div className="text-white/70 text-xs sm:text-sm font-medium">
                    {getModeLabel()}
                </div>

                <div className="flex gap-1.5 sm:gap-2">
                    <button
                        onClick={toggleSound}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors backdrop-blur-sm border border-gray-700/50 ${soundEnabled ? 'bg-blue-600/80' : 'bg-gray-800/70'
                            }`}
                    >
                        {soundEnabled ? '🔊' : '🔇'}
                    </button>
                    <button
                        onClick={toggleMusic}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors backdrop-blur-sm border border-gray-700/50 ${musicEnabled ? 'bg-blue-600/80' : 'bg-gray-800/70'
                            }`}
                    >
                        🎵
                    </button>
                </div>
            </div>

            {/* Player Status Bar */}
            <div className="w-full max-w-lg flex justify-around mb-2 sm:mb-3">
                {players.map((player) => (
                    <motion.div
                        key={player.id}
                        className={`flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all ${currentPlayer === player.id
                            ? 'ring-2 ring-white/80 scale-105 sm:scale-110 shadow-lg'
                            : 'opacity-50'
                            }`}
                        style={{ backgroundColor: PLAYER_COLORS[player.id] }}
                        animate={currentPlayer === player.id ? {
                            boxShadow: ['0 0 8px rgba(255,255,255,0.4)', '0 0 16px rgba(255,255,255,0.7)', '0 0 8px rgba(255,255,255,0.4)']
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <span className="text-white font-bold text-xs sm:text-sm drop-shadow">{PLAYER_NAMES[player.id]}</span>
                        <div className="flex gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                            {player.tokens.map((token) => (
                                <div
                                    key={token.id}
                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${token.isHome
                                        ? 'bg-green-400 shadow-green-400/50 shadow-sm'
                                        : token.isOut
                                            ? 'bg-white'
                                            : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                        {player.hasWon && (
                            <span className="text-xs mt-0.5 sm:mt-1">🏆 #{player.rank}</span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Game Board with external dice */}
            <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                    {/* Board */}
                    <Board size={boardSize} />

                    {/* External Dice - positioned outside board corners */}
                    {/* Red - top-left corner outside board */}
                    <div className="absolute" style={{ top: -50, left: 0 }}>
                        <PlayerDice
                            playerId="red"
                            cellSize={boardSize / BOARD_SIZE}
                        />
                    </div>
                    {/* Blue - top-right corner outside board */}
                    <div className="absolute" style={{ top: -50, right: 0 }}>
                        <PlayerDice
                            playerId="blue"
                            cellSize={boardSize / BOARD_SIZE}
                        />
                    </div>
                    {/* Yellow - bottom-right corner outside board */}
                    <div className="absolute" style={{ bottom: -50, right: 0 }}>
                        <PlayerDice
                            playerId="yellow"
                            cellSize={boardSize / BOARD_SIZE}
                        />
                    </div>
                    {/* Green - bottom-left corner outside board */}
                    <div className="absolute" style={{ bottom: -50, left: 0 }}>
                        <PlayerDice
                            playerId="green"
                            cellSize={boardSize / BOARD_SIZE}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
