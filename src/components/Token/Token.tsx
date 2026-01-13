import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
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
    const tokenSize = cellSize * 0.85;

    // Offset for stacked tokens
    const stackOffset = stackCount > 1 ? (stackIndex - (stackCount - 1) / 2) * 4 : 0;

    const handleClick = () => {
        if (isMovable && hasRolled) {
            moveToken(token.id);
        }
    };

    return (
        <motion.div
            onClick={handleClick}
            className={`absolute flex items-center justify-center
                ${isMovable ? 'cursor-pointer' : ''}
                ${token.isHome ? 'opacity-60' : ''}`}
            style={{
                width: tokenSize,
                height: tokenSize,
                left: x * cellSize + (cellSize - tokenSize) / 2 + stackOffset,
                top: y * cellSize + (cellSize - tokenSize) / 2 + stackOffset,
                zIndex: isMovable ? 30 : 20,
            }}
            initial={{ scale: 0 }}
            animate={{
                scale: 1,
                ...(isMovable && {
                    y: [0, -3, 0],
                }),
            }}
            transition={{
                scale: { type: 'spring', stiffness: 500, damping: 30 },
                y: isMovable ? { duration: 0.8, repeat: Infinity } : {},
            }}
            whileHover={isMovable ? { scale: 1.2, y: -5 } : {}}
            whileTap={isMovable ? { scale: 0.9 } : {}}
        >
            {/* MapPin Icon Token */}
            <MapPin
                size={tokenSize}
                fill={color}
                color="rgba(0,0,0,0.3)"
                strokeWidth={1.5}
                style={{
                    filter: isMovable
                        ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 12px rgba(255,255,255,0.8))`
                        : 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
                }}
            />

            {/* Glow animation for movable tokens */}
            {isMovable && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{
                        background: `radial-gradient(circle, ${color}50 0%, transparent 60%)`,
                    }}
                />
            )}
        </motion.div>
    );
};
