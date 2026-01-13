import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Token } from '../Token/Token';
import { PlayerColor } from '../../types';
import {
    BOARD_SIZE,
    MAIN_TRACK_COORDS,
    HOME_STRETCH_COORDS,
    SAFE_POSITIONS,
    PLAYER_COLORS,
    getPositionCoords,
} from '../../utils/boardConfig';

interface BoardProps {
    size: number;
}

export const Board: React.FC<BoardProps> = ({ size }) => {
    const { players, getMovableTokens, currentPlayer } = useGameStore();
    const cellSize = size / BOARD_SIZE;

    const movableTokens = getMovableTokens();
    const movableTokenIds = new Set(movableTokens.map((t) => t.id));

    // Render player home base with shimmer animation
    const renderHomeBase = (color: PlayerColor, startX: number, startY: number) => {
        const bgColor = PLAYER_COLORS[color];
        const isActive = currentPlayer === color;
        return (
            <motion.div
                key={`base-${color}`}
                className="absolute rounded-lg"
                style={{
                    left: startX * cellSize,
                    top: startY * cellSize,
                    width: cellSize * 6,
                    height: cellSize * 6,
                    backgroundColor: bgColor,
                    zIndex: 1,
                }}
                animate={isActive ? {
                    boxShadow: [
                        `0 0 15px ${bgColor}`,
                        `0 0 30px ${bgColor}`,
                        `0 0 15px ${bgColor}`
                    ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                {/* Shimmer overlay for active player */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
                            backgroundSize: '200% 100%',
                        }}
                        animate={{
                            backgroundPosition: ['200% 0', '-200% 0'],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                )}
                {/* Inner white area for tokens */}
                <div
                    className="absolute bg-white rounded-md"
                    style={{
                        left: cellSize * 0.8,
                        top: cellSize * 0.8,
                        width: cellSize * 4.4,
                        height: cellSize * 4.4,
                    }}
                >
                    {/* Token slots */}
                    {[0, 1, 2, 3].map((idx) => {
                        const row = Math.floor(idx / 2);
                        const col = idx % 2;
                        return (
                            <div
                                key={idx}
                                className="absolute rounded-full border-2"
                                style={{
                                    left: cellSize * 0.5 + col * cellSize * 1.8,
                                    top: cellSize * 0.5 + row * cellSize * 1.8,
                                    width: cellSize * 1.2,
                                    height: cellSize * 1.2,
                                    borderColor: bgColor,
                                    opacity: 0.5,
                                }}
                            />
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    // Render center home triangle
    const renderCenterHome = () => {
        const centerStart = 6;
        const centerSize = 3;

        return (
            <div
                className="absolute"
                style={{
                    left: centerStart * cellSize,
                    top: centerStart * cellSize,
                    width: centerSize * cellSize,
                    height: centerSize * cellSize,
                }}
            >
                {/* Triangles for each player */}
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    {/* Red - top */}
                    <polygon points="50,50 0,0 100,0" fill={PLAYER_COLORS.red} />
                    {/* Green - left */}
                    <polygon points="50,50 0,0 0,100" fill={PLAYER_COLORS.green} />
                    {/* Yellow - bottom */}
                    <polygon points="50,50 0,100 100,100" fill={PLAYER_COLORS.yellow} />
                    {/* Blue - right */}
                    <polygon points="50,50 100,0 100,100" fill={PLAYER_COLORS.blue} />
                    {/* Center circle */}
                    <circle cx="50" cy="50" r="15" fill="white" stroke="#333" strokeWidth="2" />
                </svg>
            </div>
        );
    };

    // Render track cells
    const renderTrackCells = () => {
        const cells: JSX.Element[] = [];

        // Main track
        MAIN_TRACK_COORDS.forEach((coord, index) => {
            const isSafe = SAFE_POSITIONS.includes(index);
            const isStart = [0, 13, 26, 39].includes(index);
            let cellColor = '#f5e6c8'; // Default cream color

            // Color the start positions - matches START_POSITIONS in boardConfig
            if (index === 0) cellColor = PLAYER_COLORS.red;
            else if (index === 13) cellColor = PLAYER_COLORS.green;
            else if (index === 26) cellColor = PLAYER_COLORS.yellow;
            else if (index === 39) cellColor = PLAYER_COLORS.blue;

            cells.push(
                <div
                    key={`track-${index}`}
                    className={`absolute border border-gray-400 ${isSafe && !isStart ? 'flex items-center justify-center' : ''}`}
                    style={{
                        left: coord.x * cellSize,
                        top: coord.y * cellSize,
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: cellColor,
                    }}
                >
                    {isSafe && !isStart && (
                        <span className="text-gray-500 text-xs">★</span>
                    )}
                </div>
            );
        });

        // Home stretches
        const homeColors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
        homeColors.forEach((color) => {
            HOME_STRETCH_COORDS[color].forEach((coord, index) => {
                cells.push(
                    <div
                        key={`home-${color}-${index}`}
                        className="absolute border border-gray-400"
                        style={{
                            left: coord.x * cellSize,
                            top: coord.y * cellSize,
                            width: cellSize,
                            height: cellSize,
                            backgroundColor: PLAYER_COLORS[color],
                            opacity: 0.8,
                        }}
                    />
                );
            });
        });

        return cells;
    };

    // Render all tokens
    const renderTokens = () => {
        const tokens: JSX.Element[] = [];

        players.forEach((player) => {
            // Group tokens by position for stacking
            const tokensByPosition = new Map<string, typeof player.tokens>();

            player.tokens.forEach((token, idx) => {
                const coords = getPositionCoords(player.id, token.position, idx);
                const key = `${coords.x}-${coords.y}`;

                if (!tokensByPosition.has(key)) {
                    tokensByPosition.set(key, []);
                }
                tokensByPosition.get(key)!.push(token);
            });

            // Render tokens with stacking
            tokensByPosition.forEach((stackedTokens, _posKey) => {
                stackedTokens.forEach((token, stackIdx) => {
                    const tokenIdx = player.tokens.findIndex((t) => t.id === token.id);
                    const coords = getPositionCoords(player.id, token.position, tokenIdx);

                    tokens.push(
                        <Token
                            key={token.id}
                            token={token}
                            x={coords.x}
                            y={coords.y}
                            cellSize={cellSize}
                            isMovable={movableTokenIds.has(token.id)}
                            stackIndex={stackIdx}
                            stackCount={stackedTokens.length}
                        />
                    );
                });
            });
        });

        return tokens;
    };

    return (
        <motion.div
            className="relative bg-board-bg rounded-xl shadow-2xl"
            style={{
                width: size,
                height: size,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: `${cellSize}px ${cellSize}px`,
                }}
            />

            {/* Home bases */}
            {renderHomeBase('red', 0, 0)}
            {renderHomeBase('blue', 9, 0)}
            {renderHomeBase('yellow', 9, 9)}
            {renderHomeBase('green', 0, 9)}

            {/* Track cells */}
            {renderTrackCells()}

            {/* Center home */}
            {renderCenterHome()}

            {/* Tokens */}
            {renderTokens()}
        </motion.div>
    );
};
