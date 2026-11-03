import { describe, expect, it } from '@jest/globals';
import { guess, hide, isOpen, isOver, LAST_NUMBER, newGame, remaining, type Game } from '../game';

const playing = (secret: number, mode: Game['mode'] = 'draw'): Game => ({ mode, secret, low: 1, high: LAST_NUMBER, guesses: 0, status: 'playing' });

describe('newGame', () => {
  it('given draw mode, when started, then a secret between 1 and 50 is already set and play begins', () => {
    expect(newGame('draw', () => 0)).toMatchObject({ secret: 1, status: 'playing', low: 1, high: 50 });
    expect(newGame('draw', () => 0.999)).toMatchObject({ secret: 50 });
  });

  it('given pick mode, when started, then it waits for someone to hide a number', () => {
    expect(newGame('pick')).toMatchObject({ secret: null, status: 'hiding' });
  });
});

describe('hide', () => {
  it('given pick mode waiting, when a number is chosen, then it becomes the secret', () => {
    expect(hide(newGame('pick'), 17)).toMatchObject({ secret: 17, status: 'playing', guesses: 0 });
  });

  it('given a game already playing, when hide is called, then nothing changes', () => {
    const game = playing(10);
    expect(hide(game, 3)).toBe(game);
  });
});

describe('guess', () => {
  it('given a guess below the secret, when made, then everything up to it is closed', () => {
    const game = guess(playing(30), 12);
    expect(game).toMatchObject({ low: 13, high: 50, guesses: 1, status: 'playing' });
    expect(isOpen(game, 12)).toBe(false);
    expect(isOpen(game, 13)).toBe(true);
  });

  it('given a guess above the secret, when made, then everything from it up is closed', () => {
    expect(guess(playing(30), 41)).toMatchObject({ low: 1, high: 40 });
  });

  it('given the secret, when guessed, then that player lost', () => {
    expect(guess(playing(30), 30)).toMatchObject({ status: 'found', guesses: 1 });
  });

  it('given a closed number, when tapped, then it is ignored', () => {
    const game = guess(playing(30), 12);
    expect(guess(game, 5)).toBe(game);
  });

  it('given pick mode, when only the secret is left, then the one who hid it lost', () => {
    const game = guess(guess(playing(20, 'pick'), 19), 21);
    expect(game).toMatchObject({ low: 20, high: 20, status: 'cornered' });
    expect(isOver(game)).toBe(true);
  });

  it('given draw mode, when only the secret is left, then the next player still has to tap it', () => {
    const game = guess(guess(playing(20), 19), 21);
    expect(game.status).toBe('playing');
    expect(remaining(game)).toBe(1);
  });

  it('given a finished game, when tapped again, then nothing changes', () => {
    const game = guess(playing(30), 30);
    expect(guess(game, 31)).toBe(game);
  });
});
