import { DifficultyLevel, GameMechanic, PlayMode } from '../types/game';

export function mechanicTitle(mechanic: GameMechanic): string {
  switch (mechanic) {
    case 'term_forge':
      return 'Term Forge';
    case 'sentence_builder':
      return 'Sentence Builder';
    case 'context_choice':
      return 'Context Choice';
    case 'boardroom_boss':
      return 'Boardroom Boss';
    case 'adaptive_recall':
      return 'Adaptive Recall Cycle';
    case 'case_ladder':
      return 'Case Ladder';
    case 'liquidity_sprint':
      return 'Liquidity Sprint';
    default:
      return mechanic;
  }
}

export function mechanicDescription(mechanic: GameMechanic): string {
  switch (mechanic) {
    case 'term_forge':
      return 'Сопоставь термин с точным переводом.';
    case 'sentence_builder':
      return 'Собери перевод из фрагментов в правильном порядке.';
    case 'context_choice':
      return 'Выбери лучший перевод в контексте абзаца.';
    case 'boardroom_boss':
      return 'Введи полный перевод и сохрани ключевые смыслы.';
    case 'adaptive_recall':
      return 'Адаптивный повтор: 12 задач из due и слабых мест по Leitner-логике.';
    case 'case_ladder':
      return 'Сценарии из 3 шагов: контекст -> сборка -> boss с цепочным LP-бонусом.';
    case 'liquidity_sprint':
      return 'Спринт на 4 минуты: 7 быстрых задач + mini-boss и локальный рейтинг.';
    default:
      return '';
  }
}

export function difficultyTitle(level: DifficultyLevel): string {
  switch (level) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return level;
  }
}

export function difficultyDescription(level: DifficultyLevel): string {
  switch (level) {
    case 'easy':
      return 'Больше попыток, мягкий штраф и учебные подсказки.';
    case 'medium':
      return 'Базовый баланс точности и темпа.';
    case 'hard':
      return '2 попытки, таймер 60 секунд и строгая проверка.';
    default:
      return '';
  }
}

export function playModeTitle(mode: PlayMode): string {
  return mode === 'trainer' ? 'Тренажёр' : 'Кампания';
}
