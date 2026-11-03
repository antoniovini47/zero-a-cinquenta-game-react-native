export const LAST_NUMBER = 50;

export type Mode = 'draw' | 'pick';
export type Status = 'hiding' | 'playing' | 'found' | 'cornered';

export type Game = {
  mode: Mode;
  secret: number | null;
  low: number;
  high: number;
  guesses: number;
  status: Status;
};

export function newGame(mode: Mode, random: () => number = Math.random): Game {
  const base = { mode, low: 1, high: LAST_NUMBER, guesses: 0 };
  if (mode === 'pick') return { ...base, secret: null, status: 'hiding' };
  return { ...base, secret: 1 + Math.floor(random() * LAST_NUMBER), status: 'playing' };
}

export function isOpen(game: Game, n: number): boolean {
  return n >= game.low && n <= game.high;
}

export function remaining(game: Game): number {
  return game.high - game.low + 1;
}

export function isOver(game: Game): boolean {
  return game.status === 'found' || game.status === 'cornered';
}

export function hide(game: Game, n: number): Game {
  if (game.status !== 'hiding' || !isOpen(game, n)) return game;
  return { ...game, secret: n, status: 'playing' };
}

export function guess(game: Game, n: number): Game {
  if (game.status !== 'playing' || game.secret === null || !isOpen(game, n)) return game;
  const guesses = game.guesses + 1;
  if (n === game.secret) return { ...game, guesses, status: 'found' };
  const next = n < game.secret ? { ...game, guesses, low: n + 1 } : { ...game, guesses, high: n - 1 };
  return next.mode === 'pick' && remaining(next) === 1 ? { ...next, status: 'cornered' } : next;
}
