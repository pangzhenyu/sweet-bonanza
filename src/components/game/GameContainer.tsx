"use client";

import { useState, useEffect } from "react";

// Simple symbol type
type Symbol = 'heart' | 'star' | 'gem' | 'coin' | 'candy' | 'bomb';

// Define emoji mapping
const symbolEmoji: Record<Symbol, string> = {
  'heart': '❤️',
  'star': '⭐',
  'gem': '💎',
  'coin': '🪙',
  'candy': '🍬',
  'bomb': '💣'
};

// Define color mapping
const symbolColors: Record<Symbol, string> = {
  'heart': 'bg-red-500',
  'star': 'bg-yellow-400',
  'gem': 'bg-blue-500',
  'coin': 'bg-amber-500',
  'candy': 'bg-pink-500',
  'bomb': 'bg-gray-700'
};

// Define payout multipliers for 3, 4, 5, and 6 symbols in a line - adjusted for ~75% RTP
const symbolPayouts: Record<Symbol, Record<string, number>> = {
  'heart': { '6': 60, '5': 30, '4': 10, '3': 4 },
  'star': { '6': 40, '5': 20, '4': 8, '3': 3 },
  'gem': { '6': 25, '5': 12, '4': 5, '3': 2 },
  'coin': { '6': 15, '5': 8, '4': 4, '3': 1.5 },
  'candy': { '6': 10, '5': 5, '4': 3, '3': 1 },
  'bomb': { '6': 5, '5': 3, '4': 2, '3': 0.5 }
};

// Define extremely weighted random symbol selection (to significantly reduce win frequency)
const symbolWeights: Record<Symbol, number> = {
  'heart': 3,     // Ultra rare, highest value symbol
  'star': 6,      // Very rare
  'gem': 12,      // Rare
  'coin': 20,     // Uncommon
  'candy': 30,    // Common
  'bomb': 40      // Most common, lowest value symbol
};

// Add additional constraints for consecutive same symbols (to reduce win chances)
const sameSymbolPenalty = 0.65; // 65% chance to break a potential winning streak

// Build weighted array for random selection
const buildWeightedSymbolsArray = (): Symbol[] => {
  const weightedArray: Symbol[] = [];

  Object.entries(symbolWeights).forEach(([symbol, weight]) => {
    for (let i = 0; i < weight; i++) {
      weightedArray.push(symbol as Symbol);
    }
  });

  return weightedArray;
};

// Pre-generate weighted symbols array for efficiency
const weightedSymbolsArray = buildWeightedSymbolsArray();

// Define paylines (grid is 6x5 - 6 columns, 5 rows)
// Each array contains coordinates [row, col] for each position in the payline
const paylines = [
  // Line 1: Middle row (row 2)
  [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]],
  // Line 2: Top row (row 0)
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  // Line 3: Bottom middle row (row 3)
  [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]],
  // Line 4: Second row from top (row 1)
  [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
  // Line 5: Bottom row (row 4)
  [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],

  // Line 6: V shape starting from top
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [4, 5]],
  // Line 7: Inverted V shape
  [[4, 0], [3, 1], [2, 2], [1, 3], [0, 4], [0, 5]],

  // Line 8: W zigzag
  [[0, 0], [1, 1], [0, 2], [1, 3], [0, 4], [0, 5]],
  // Line 9: M zigzag
  [[4, 0], [3, 1], [4, 2], [3, 3], [4, 4], [4, 5]],

  // Line 10: Diamond in middle
  [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4], [2, 5]],
  // Line 11: Inverted diamond
  [[2, 0], [3, 1], [4, 2], [3, 3], [2, 4], [2, 5]],

  // Line 12: Diagonal top-left to bottom-right
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [4, 5]],
  // Line 13: Diagonal bottom-left to top-right
  [[4, 0], [3, 1], [2, 2], [1, 3], [0, 4], [0, 5]],

  // Line 14: Zigzag from center top to center bottom
  [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0], [4, 1]],
  // Line 15: Zigzag from center bottom to center top
  [[4, 0], [3, 1], [2, 2], [1, 1], [0, 0], [0, 1]],

  // Line 16: Snake line from top left to bottom right
  [[0, 0], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  // Line 17: Snake line from bottom left to top right
  [[4, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5]],

  // Line 18: Step pattern left to right
  [[0, 0], [0, 1], [1, 2], [1, 3], [2, 4], [2, 5]],
  // Line 19: Step pattern right to left
  [[0, 5], [0, 4], [1, 3], [1, 2], [2, 1], [2, 0]],

  // Line 20: Zigzag across all rows
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [4, 5]],
  // Line 21: Reverse zigzag across all rows
  [[4, 0], [3, 1], [2, 2], [1, 3], [0, 4], [0, 5]],

  // Line 22: U shape
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1]],
  // Line 23: Inverted U shape
  [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [4, 4]],

  // Line 24: Horizontal zigzag (top rows)
  [[0, 0], [0, 1], [1, 2], [1, 3], [0, 4], [0, 5]],
  // Line 25: Horizontal zigzag (bottom rows)
  [[4, 0], [4, 1], [3, 2], [3, 3], [4, 4], [4, 5]],

  // Line 26: Diagonal zigzag top-left to bottom-right
  [[0, 0], [1, 1], [1, 2], [2, 3], [3, 3], [4, 4]],
  // Line 27: Diagonal zigzag bottom-left to top-right
  [[4, 0], [3, 1], [3, 2], [2, 3], [1, 3], [0, 4]],

  // Line 28: Cross through center
  [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [4, 3]],
  // Line 29: Inverted cross through center
  [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [4, 2]],

  // Line 30: Spiral from outside to center
  [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1]]
];

// Position type
type Position = [number, number]; // [row, col]

// Winning payline type
type WinningPayline = {
  lineIndex: number;
  positions: Position[];
  symbol: Symbol;
  count: number;
  payout: number;
};

// Simple React-based game implementation
export function GameContainer() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0.2);
  const [win, setWin] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  // Update to 5 rows, 6 columns
  const [symbols, setSymbols] = useState<Symbol[][]>(
    Array(5).fill(null).map(() =>
      Array(6).fill(null).map(() => getWeightedRandomSymbol())
    )
  );
  const [isLoading, setIsLoading] = useState(true);
  const [winningPaylines, setWinningPaylines] = useState<WinningPayline[]>([]);
  const [showWinExplanation, setShowWinExplanation] = useState(false);
  const [highlightedPayline, setHighlightedPayline] = useState<number | null>(null);
  const [stats, setStats] = useState({
    spins: 0,
    wins: 0,
    totalBet: 0,
    totalWin: 0,
    rtp: 0,
    targetRtp: 75 // Target RTP of 75%
  });

  // Initialize the game
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Function to get a weighted random symbol (adjusted for ~75% RTP)
  function getWeightedRandomSymbol(): Symbol {
    const randomIndex = Math.floor(Math.random() * weightedSymbolsArray.length);
    return weightedSymbolsArray[randomIndex];
  }

  // Function to get the next symbol with streak breaking logic
  function getNextSymbol(previousSymbol: Symbol): Symbol {
    // Chance to break a streak
    if (Math.random() < sameSymbolPenalty) {
      // Get a different symbol
      let newSymbol = getWeightedRandomSymbol();
      while (newSymbol === previousSymbol) {
        newSymbol = getWeightedRandomSymbol();
      }
      return newSymbol;
    }

    // Return the weighted random symbol (which could be the same or different)
    return getWeightedRandomSymbol();
  }

  // Generate symbols for a single reel (column) with reduced win chances
  function generateReel(colIndex: number): Symbol[] {
    const reel: Symbol[] = [];

    // First symbol is completely random
    let prevSymbol = getWeightedRandomSymbol();
    reel.push(prevSymbol);

    // For the rest, apply streak-breaking logic
    for (let i = 1; i < 5; i++) {
      const nextSymbol = getNextSymbol(prevSymbol);
      reel.push(nextSymbol);
      prevSymbol = nextSymbol;
    }

    return reel;
  }

  // Generate symbols for the entire grid with reduced win chances
  function generateGrid(): Symbol[][] {
    const grid: Symbol[][] = [];

    for (let row = 0; row < 5; row++) {
      const rowSymbols: Symbol[] = [];

      for (let col = 0; col < 6; col++) {
        if (row === 0) {
          // For the first row, use completely random symbols
          rowSymbols.push(getWeightedRandomSymbol());
        } else {
          // For subsequent rows, try to avoid the same symbol as above
          const aboveSymbol = grid[row - 1][col];

          // 75% chance to avoid the same symbol
          if (Math.random() < 0.75) {
            let newSymbol = getWeightedRandomSymbol();
            while (newSymbol === aboveSymbol) {
              newSymbol = getWeightedRandomSymbol();
            }
            rowSymbols.push(newSymbol);
          } else {
            rowSymbols.push(getWeightedRandomSymbol());
          }
        }
      }

      grid.push(rowSymbols);
    }

    return grid;
  }

  // Handle spin button click
  const handleSpin = () => {
    if (isSpinning || balance < bet) return;

    // Clear any previous winning combinations
    setWinningPaylines([]);
    setShowWinExplanation(false);
    setHighlightedPayline(null);

    // Deduct bet and start spinning
    setBalance(prev => prev - bet);
    setWin(0);
    setIsSpinning(true);

    // Update stats
    setStats(prev => ({
      ...prev,
      spins: prev.spins + 1,
      totalBet: prev.totalBet + bet
    }));

    // Animation - multiple symbol changes
    let spinsLeft = 10;
    const spinInterval = setInterval(() => {
      setSymbols(generateGrid());

      spinsLeft--;

      if (spinsLeft <= 0) {
        clearInterval(spinInterval);
        evaluateWin();
      }
    }, 100);
  };

  // Toggle win explanation
  const toggleWinExplanation = () => {
    setShowWinExplanation(prev => !prev);
  };

  // Highlight a specific payline
  const highlightPayline = (lineIndex: number | null) => {
    setHighlightedPayline(lineIndex);
  };

  // Evaluate win after spin completes
  const evaluateWin = () => {
    // Generate final symbols for a 5x6 grid (5 rows, 6 columns) with reduced win chance
    const finalSymbols = generateGrid();

    // Check each payline for wins
    const wins: WinningPayline[] = [];
    let totalWin = 0;

    paylines.forEach((payline, lineIndex) => {
      // Get symbols on this payline
      const symbolsOnLine = payline.map(([row, col]) => finalSymbols[row][col]);

      // Count consecutive symbols from left to right
      const currentSymbol = symbolsOnLine[0];
      let count = 1;

      for (let i = 1; i < symbolsOnLine.length; i++) {
        if (symbolsOnLine[i] === currentSymbol) {
          count++;
        } else {
          break; // Stop counting when sequence breaks
        }
      }

      // Check if this is a winning combination (3 or more matching symbols)
      if (count >= 3) {
        // Calculate payout based on symbol and count
        const payoutKey = count.toString() as '3' | '4' | '5' | '6';
        const payout = symbolPayouts[currentSymbol][payoutKey] * bet;

        // Add to winning paylines
        wins.push({
          lineIndex,
          positions: payline.slice(0, count) as Position[],
          symbol: currentSymbol,
          count,
          payout
        });

        // Add to total win
        totalWin += payout;
      }
    });

    // Update game state
    setSymbols(finalSymbols);
    setWin(totalWin);
    setBalance(prev => prev + totalWin);
    setWinningPaylines(wins);
    setIsSpinning(false);

    // Update stats
    setStats(prev => {
      const newTotalWin = prev.totalWin + totalWin;
      const newWins = prev.wins + (totalWin > 0 ? 1 : 0);
      const newRtp = prev.totalBet > 0 ? (newTotalWin / prev.totalBet) * 100 : 0;

      return {
        ...prev,
        wins: newWins,
        totalWin: newTotalWin,
        rtp: newRtp
      };
    });

    // We don't automatically show win explanation now - user will click the button if they want to see it
  };

  // Handle bet changes
  const changeBet = (direction: 'up' | 'down') => {
    if (isSpinning) return;

    const betOptions = [0.20, 0.40, 0.60, 0.80, 1.00, 2.00, 5.00, 10.00];
    const currentIndex = betOptions.indexOf(bet);

    if (direction === 'up' && currentIndex < betOptions.length - 1) {
      setBet(betOptions[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      setBet(betOptions[currentIndex - 1]);
    }
  };

  // Check if a position is in a winning payline
  const isWinningPosition = (row: number, col: number): boolean => {
    if (highlightedPayline !== null) {
      // Only highlight the specific payline
      const payline = winningPaylines.find(wp => wp.lineIndex === highlightedPayline);
      if (payline) {
        return payline.positions.some(([r, c]) => r === row && c === col);
      }
      return false;
    }

    // Highlight all winning positions
    return winningPaylines.some(payline =>
      payline.positions.some(([r, c]) => r === row && c === col)
    );
  };

  // Get the winning payline for a position (if any)
  const getWinningPaylineForPosition = (row: number, col: number): WinningPayline | undefined => {
    if (highlightedPayline !== null) {
      return winningPaylines.find(wp =>
        wp.lineIndex === highlightedPayline &&
        wp.positions.some(([r, c]) => r === row && c === col)
      );
    }

    return winningPaylines.find(payline =>
      payline.positions.some(([r, c]) => r === row && c === col)
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Loading Slot Game</h1>
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto">
            <div className="h-full bg-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col">
      {/* Game area */}
      <div className="flex-grow bg-purple-900/90 flex items-center justify-center">
        <div className="relative bg-purple-950/60 p-4 rounded-lg">
          {/* Symbol grid - 5x6 layout (5 rows, 6 columns) */}
          <div className="grid grid-rows-5 gap-2">
            {symbols.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-2">
                {row.map((symbol, colIndex) => {
                  // Check if this symbol is part of a winning payline
                  const isWinning = isWinningPosition(rowIndex, colIndex);
                  const winPayline = getWinningPaylineForPosition(rowIndex, colIndex);

                  return (
                    <div
                      key={`symbol-${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-2xl ${symbolColors[symbol]} ${isWinning ? 'ring-2 ring-white ring-offset-2 ring-offset-purple-950' : ''}`}
                      style={{
                        animation: isSpinning
                          ? `spin-bounce 0.3s ease ${colIndex * 0.1}s`
                          : isWinning
                            ? 'pulse 1s infinite'
                            : 'none'
                      }}
                    >
                      {symbolEmoji[symbol]}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Win overlay - Only shown immediately after spinning */}
          {win > 0 && !showWinExplanation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 text-yellow-300 font-bold text-4xl px-8 py-4 rounded-lg animate-bounce">
                WIN ${win.toFixed(2)}!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar - Shows RTP and other stats */}
      <div className="bg-gray-800 text-xs text-gray-400 p-1 flex justify-between">
        <div>Spins: {stats.spins}</div>
        <div>Win Rate: {stats.spins > 0 ? ((stats.wins / stats.spins) * 100).toFixed(1) : '0.0'}%</div>
        <div>RTP: {stats.rtp.toFixed(1)}% (Target: {stats.targetRtp}%)</div>
      </div>

      {/* Controls area */}
      <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center px-4">
        <div className="flex-1 flex space-x-8">
          {/* Balance */}
          <div className="text-white">
            <div className="text-sm text-yellow-400">BALANCE</div>
            <div className="text-xl font-bold">${balance.toFixed(2)}</div>
          </div>

          {/* Bet */}
          <div className="text-white flex items-center">
            <div>
              <div className="text-sm text-yellow-400">BET</div>
              <div className="text-xl font-bold">${bet.toFixed(2)}</div>
            </div>
            <div className="flex flex-col ml-2">
              <button
                onClick={() => changeBet('up')}
                disabled={isSpinning}
                className="bg-gray-700 text-white h-6 w-6 flex items-center justify-center rounded-t-md disabled:opacity-50"
              >
                +
              </button>
              <button
                onClick={() => changeBet('down')}
                disabled={isSpinning}
                className="bg-gray-700 text-white h-6 w-6 flex items-center justify-center rounded-b-md disabled:opacity-50"
              >
                -
              </button>
            </div>
          </div>

          {/* Win */}
          <div className="text-white">
            <div className="text-sm text-yellow-400">WIN</div>
            <div className="text-xl font-bold">${win.toFixed(2)}</div>
          </div>

          {/* Win explanation button - Only shown if there are wins */}
          {win > 0 && (
            <button
              onClick={toggleWinExplanation}
              className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm"
            >
              {showWinExplanation ? 'Hide Paylines' : 'Show Paylines'}
            </button>
          )}
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || balance < bet}
          className={`px-8 py-3 rounded-md font-bold text-white
            ${isSpinning || balance < bet ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </button>
      </div>

      {/* Win explanation overlay - Only shown when user clicks the button */}
      {showWinExplanation && winningPaylines.length > 0 && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="bg-gray-900 rounded-lg p-6 max-w-xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Winning Paylines</h2>
            <p className="text-gray-300 mb-4">
              You've hit the following winning paylines:
            </p>

            <div className="space-y-4">
              {winningPaylines.map((payline, index) => (
                <div
                  key={`payline-${index}`}
                  className="bg-gray-800 rounded-md p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => highlightPayline(payline.lineIndex === highlightedPayline ? null : payline.lineIndex)}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-10 h-10 ${symbolColors[payline.symbol]} rounded-md flex items-center justify-center text-xl mr-3`}>
                      {symbolEmoji[payline.symbol]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">
                        Payline {payline.lineIndex + 1}: {payline.count} {payline.symbol}s in a row
                      </h3>
                      <p className="text-yellow-400">
                        {payline.count} in a row = {symbolPayouts[payline.symbol][payline.count.toString() as '3' | '4' | '5' | '6']}x multiplier
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-300">
                    Payout: ${bet.toFixed(2)} × {symbolPayouts[payline.symbol][payline.count.toString() as '3' | '4' | '5' | '6']} = ${payline.payout.toFixed(2)}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {highlightedPayline === payline.lineIndex ? 'Click to hide payline' : 'Click to highlight this payline'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-purple-900/50 p-4 rounded-md">
              <h3 className="text-white font-bold mb-2">How Paylines Work</h3>
              <p className="text-gray-300 mb-2">
                Winning combinations must start from the leftmost reel and go along a payline:
              </p>
              <ul className="text-gray-300 list-disc pl-5 space-y-1">
                <li><span className="text-red-400">3 matching symbols</span> = Lower payout</li>
                <li><span className="text-yellow-400">4 matching symbols</span> = Medium payout</li>
                <li><span className="text-green-400">5 matching symbols</span> = Higher payout</li>
                <li><span className="text-blue-400">6 matching symbols</span> = Maximum payout</li>
              </ul>
              <p className="text-gray-300 mt-2">
                Different symbols have different values. Hearts pay the most, followed by stars, gems, and so on.
              </p>
            </div>

            <button
              onClick={() => {
                toggleWinExplanation();
                highlightPayline(null);
              }}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin-bounce {
          0% { transform: translateY(-100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
