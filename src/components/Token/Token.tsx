import React from 'react';
import { motion } from 'framer-motion';
import { Token as TokenType } from '../../types';
import { PLAYER_COLORS } from '../../utils/boardConfig';
import { useGameStore } from '../../store/gameStore';

interface TokenProps {
    token: TokenType;
    x: number;
    y: number;
    cellSize: number;
    isMovable: boolean;
    stackIndex?: number;
    stackCount?: number;
}

export const Token: React.FC<TokenProps> = ({
    token,
    x,
    y,
    cellSize,
    isMovable,
    stackIndex = 0,
    stackCount = 1,
}) => {
    const { moveToken, hasRolled } = useGameStore();

    const color = PLAYER_COLORS[token.playerId];
    const tokenSize = cellSize * 0.8;

    // Offset for stacked tokens
    const stackOffset = stackCount > 1 ? (stackIndex - (stackCount - 1) / 2) * 5 : 0;

    const handleClick = () => {
        if (isMovable && hasRolled) {
            moveToken(token.id);
        }
    };

    return (
        <motion.div
            onClick={handleClick}
            className={`absolute flex items-center justify-center
                ${isMovable ? 'cursor-pointer z-20' : 'z-10'}
                ${token.isHome ? 'opacity-60' : ''}`}
            style={{
                width: tokenSize,
                height: tokenSize * 1.3,
                left: x * cellSize + (cellSize - tokenSize) / 2 + stackOffset,
                top: y * cellSize + (cellSize - tokenSize * 1.3) / 2 + stackOffset,
            }}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
                scale: { type: 'spring', stiffness: 500, damping: 30 },
            }}
            whileHover={isMovable ? { scale: 1.15, y: -3 } : {}}
            whileTap={isMovable ? { scale: 0.9 } : {}}
            layout
        >
            {/* Token using inline SVG pawn shape */}
            <svg
                viewBox="0 0 100 150"
                className="w-full h-full"
                style={{
                    filter: isMovable
                        ? 'drop-shadow(0 0 10px rgba(255,255,255,0.9))'
                        : 'drop-shadow(0 3px 4px rgba(0,0,0,0.5))',
                }}
            >
                {/* Base */}
                <ellipse cx="50" cy="140" rx="40" ry="10" fill={color} opacity="0.8" />
                <ellipse cx="50" cy="130" rx="35" ry="8" fill={color} />

                {/* Body */}
                <path
                    d="M25 130 Q15 100 25 70 Q30 50 50 45 Q70 50 75 70 Q85 100 75 130 Z"
                    fill={color}
                />

                {/* Neck */}
                <rect x="40" y="35" width="20" height="15" rx="3" fill={color} />

                {/* Head */}
                <circle cx="50" cy="25" r="22" fill={color} />

                {/* Highlight on head */}
                <circle cx="42" cy="18" r="8" fill="rgba(255,255,255,0.35)" />

                {/* Outline */}
                <path
                    d="M25 130 Q15 100 25 70 Q30 50 50 45 Q70 50 75 70 Q85 100 75 130"
                    fill="none"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                />
                <circle cx="50" cy="25" r="22" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
            </svg>

            {/* Glow animation for movable tokens */}
            {isMovable && (
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{
                        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                        borderRadius: '50%',
                    }}
                />
            )}
        </motion.div>
    );
};
