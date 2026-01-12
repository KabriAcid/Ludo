import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { MenuScreen, GameScreen, ResultsScreen } from './components/Screens';
import { GameMode } from './types';

const AppContent: React.FC = () => {
    const { gamePhase, mode, initGame, goToMenu } = useGameStore();
    const navigate = useNavigate();

    const handleStartGame = (selectedMode: GameMode) => {
        initGame(selectedMode);
        navigate('/play');
    };

    const handleGoToMenu = () => {
        goToMenu();
        navigate('/');
    };

    const handlePlayAgain = () => {
        initGame(mode);
        navigate('/play');
    };

    React.useEffect(() => {
        if (gamePhase === 'finished') {
            navigate('/results');
        }
    }, [gamePhase, navigate]);

    return (
        <div className="min-h-screen overflow-hidden relative">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MenuScreen onStartGame={handleStartGame} />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/play"
                        element={
                            <motion.div
                                key="game"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                            >
                                <GameScreen onGoToMenu={handleGoToMenu} />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/results"
                        element={
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ResultsScreen
                                    onPlayAgain={handlePlayAgain}
                                    onGoToMenu={handleGoToMenu}
                                />
                            </motion.div>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
