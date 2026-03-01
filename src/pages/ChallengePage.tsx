import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { challengeById, totalChallengeCount } from '../data';
import {
  ADAPTIVE_RECALL_SESSION_SIZE,
  SPRINT_DURATION_SECONDS,
  SPRINT_SESSION_SIZE,
  TRAINER_SESSION_SIZE,
  computeSprintScore,
  getDifficultyConfig,
  matchBossKeywords,
} from '../lib/engine';
import {
  difficultyTitle,
  mechanicTitle,
  playModeTitle,
} from '../lib/labels';
import { nextChallengeInZone } from '../lib/selectors';
import { seededShuffle } from '../lib/text';
import { useGame } from '../state/GameContext';
import { Challenge, DifficultyLevel, GameMechanic, PlayMode } from '../types/game';

const trainerMechanics: GameMechanic[] = [
  'term_forge',
  'sentence_builder',
  'context_choice',
  'boardroom_boss',
  'adaptive_recall',
  'liquidity_sprint',
  'case_ladder',
];

const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

function hashSeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildAnswer(challenge: Challenge, selectedOption: string, sentence: string[], text: string): string {
  if (challenge.mechanic === 'sentence_builder') {
    return sentence.join(' ');
  }
  if (challenge.mechanic === 'boardroom_boss') {
    return text;
  }
  return selectedOption;
}

function parseTrainerMechanic(input: string | undefined): GameMechanic | null {
  if (!input) {
    return null;
  }

  if (input === 'adaptive-recall') {
    return 'adaptive_recall';
  }

  if (input === 'sprint') {
    return 'liquidity_sprint';
  }

  if (trainerMechanics.includes(input as GameMechanic)) {
    return input as GameMechanic;
  }

  return null;
}

function isDifficulty(input: string | undefined): input is DifficultyLevel {
  return typeof input === 'string' && difficulties.includes(input as DifficultyLevel);
}

function highlightContext(context: string, keywords: string[]): ReactNode {
  const tokens = keywords
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length >= 4);

  if (tokens.length === 0) {
    return context;
  }

  const regex = new RegExp(`(${tokens.map((token) => escapeRegExp(token)).join('|')})`, 'gi');
  const parts = context.split(regex);
  const tokenSet = new Set(tokens.map((token) => token.toLowerCase()));

  return parts.map((part, index) => {
    if (tokenSet.has(part.toLowerCase())) {
      return (
        <mark key={`${part}-${index}`} className="context-highlight">
          {part}
        </mark>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export function ChallengePage() {
  const {
    zoneId,
    challengeId,
    mechanic: mechanicParam,
    difficulty: difficultyParam,
  } = useParams<{
    zoneId: string;
    challengeId: string;
    mechanic: string;
    difficulty: string;
  }>();
  const navigate = useNavigate();
  const {
    zones,
    progress,
    submitAnswer,
    submitTrainerAnswer,
    buildTrainerQueue,
    startAdaptiveRecallSession,
    startLiquiditySprintSession,
    recordSprintResult,
    recordTrainerSessionResult,
    setCurrentZone,
  } = useGame();

  const trainerMechanic = parseTrainerMechanic(mechanicParam);
  const trainerDifficulty = isDifficulty(difficultyParam) ? difficultyParam : null;
  const isTrainerMode = trainerMechanic !== null && trainerDifficulty !== null;
  const playMode: PlayMode = isTrainerMode ? 'trainer' : 'campaign';

  const zone = zones.find((item) => item.id === zoneId);
  const campaignChallenge = challengeId ? challengeById[challengeId] : undefined;

  const [trainerQueue, setTrainerQueue] = useState<string[]>([]);
  const [arcDueChallengeIds, setArcDueChallengeIds] = useState<Set<string>>(new Set());
  const [trainerIndex, setTrainerIndex] = useState(0);
  const [sessionSize, setSessionSize] = useState(TRAINER_SESSION_SIZE);
  const [trainerSession, setTrainerSession] = useState({
    answered: 0,
    correct: 0,
    awardedLp: 0,
    streakBonus: 0,
  });
  const [trainerFinished, setTrainerFinished] = useState(false);
  const [sessionFinalized, setSessionFinalized] = useState(false);
  const [sprintTimeLeft, setSprintTimeLeft] = useState<number | null>(null);
  const [sprintRank, setSprintRank] = useState<number | null>(null);
  const [sprintScore, setSprintScore] = useState<number | null>(null);
  const [sessionTheme, setSessionTheme] = useState<{ title: string; brief: string } | null>(null);

  const trainerChallengeId = isTrainerMode ? trainerQueue[trainerIndex] : undefined;
  const trainerChallenge = trainerChallengeId ? challengeById[trainerChallengeId] : undefined;
  const challenge = isTrainerMode ? trainerChallenge : campaignChallenge;

  const activeZone = challenge ? zones.find((item) => item.id === challenge.zoneId) : zone;
  const invalidCampaignRoute =
    !isTrainerMode && (!zone || !campaignChallenge || campaignChallenge.zoneId !== zone.id);
  const invalidTrainerRoute = (mechanicParam || difficultyParam) && !isTrainerMode;
  const unsupportedTrainerRoute = isTrainerMode && trainerMechanic === 'case_ladder';

  const completedRecord = !isTrainerMode && challenge ? progress.completedChallenges[challenge.id] : undefined;
  const difficulty = isTrainerMode ? trainerDifficulty : 'medium';
  const difficultyRules = getDifficultyConfig(difficulty);
  const hardTimerEnabled = isTrainerMode && difficulty === 'hard' && difficultyRules.hardTimerSeconds !== null;
  const maxAttempts = difficultyRules.maxAttempts;

  const [attempts, setAttempts] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isResolved, setIsResolved] = useState(false);
  const [assembledFragments, setAssembledFragments] = useState<string[]>([]);
  const [availableFragments, setAvailableFragments] = useState<string[]>([]);
  const [freeInput, setFreeInput] = useState('');
  const [lastAward, setLastAward] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const initializeTrainerSession = () => {
    if (!isTrainerMode || !trainerMechanic || !trainerDifficulty) {
      return;
    }

    if (trainerMechanic === 'adaptive_recall') {
      const plan = startAdaptiveRecallSession(ADAPTIVE_RECALL_SESSION_SIZE);
      setTrainerQueue(plan.queue);
      setArcDueChallengeIds(new Set(plan.dueChallengeIds));
      setSessionSize(ADAPTIVE_RECALL_SESSION_SIZE);
      setSprintTimeLeft(null);
      setSessionTheme({ title: plan.title, brief: plan.brief });
    } else if (trainerMechanic === 'liquidity_sprint') {
      const plan = startLiquiditySprintSession(SPRINT_SESSION_SIZE);
      setTrainerQueue(plan.queue);
      setArcDueChallengeIds(new Set());
      setSessionSize(SPRINT_SESSION_SIZE);
      setSprintTimeLeft(SPRINT_DURATION_SECONDS);
      setSessionTheme({ title: plan.title, brief: plan.brief });
    } else {
      const queue = buildTrainerQueue(trainerMechanic, trainerDifficulty, TRAINER_SESSION_SIZE);
      setTrainerQueue(queue);
      setArcDueChallengeIds(new Set());
      setSessionSize(TRAINER_SESSION_SIZE);
      setSprintTimeLeft(null);
      setSessionTheme(null);
    }

    setTrainerIndex(0);
    setTrainerSession({
      answered: 0,
      correct: 0,
      awardedLp: 0,
      streakBonus: 0,
    });
    setTrainerFinished(false);
    setSessionFinalized(false);
    setSprintRank(null);
    setSprintScore(null);
  };

  useEffect(() => {
    initializeTrainerSession();
  }, [isTrainerMode, trainerDifficulty, trainerMechanic]);

  const nextChallengeId = useMemo(() => {
    if (!challenge || !activeZone || isTrainerMode) {
      return null;
    }
    return nextChallengeInZone(progress, activeZone.id, challenge.id);
  }, [challenge, activeZone, isTrainerMode, progress]);

  useEffect(() => {
    if (!challenge) {
      return;
    }

    const isCampaignCompleted = completedRecord?.isCorrect ?? false;

    setAttempts(0);
    setHintVisible(false);
    setHintUsed(false);
    setSelectedOption('');
    setFeedback(isCampaignCompleted ? 'Задание уже выполнено. Можно перейти дальше.' : '');
    setIsResolved(isCampaignCompleted);
    setAssembledFragments([]);
    setFreeInput('');
    setLastAward(0);
    setHiddenOptions([]);

    if (challenge.mechanic === 'sentence_builder') {
      setAvailableFragments(seededShuffle(challenge.fragmentsRu, hashSeed(challenge.id)));
    } else {
      setAvailableFragments([]);
    }

    if (hardTimerEnabled) {
      setTimeLeft(difficultyRules.hardTimerSeconds);
    } else {
      setTimeLeft(null);
    }
  }, [
    challenge?.id,
    completedRecord?.isCorrect,
    difficultyRules.hardTimerSeconds,
    hardTimerEnabled,
  ]);

  useEffect(() => {
    if (!hardTimerEnabled || isResolved || !challenge) {
      return;
    }

    if (timeLeft === null || timeLeft <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous === null) {
          return null;
        }
        return Math.max(0, previous - 1);
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [challenge, isResolved, timeLeft, hardTimerEnabled]);

  useEffect(() => {
    if (!isTrainerMode || trainerMechanic !== 'liquidity_sprint' || trainerFinished) {
      return;
    }

    if (sprintTimeLeft === null) {
      return;
    }

    if (sprintTimeLeft <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setSprintTimeLeft((previous) => {
        if (previous === null) {
          return null;
        }
        return Math.max(0, previous - 1);
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isTrainerMode, trainerMechanic, sprintTimeLeft, trainerFinished]);

  const liveBossKeywords = useMemo(() => {
    if (!challenge || challenge.mechanic !== 'boardroom_boss') {
      return [];
    }
    return matchBossKeywords(freeInput, challenge);
  }, [challenge, freeInput]);

  const canUseFiftyFifty =
    isTrainerMode &&
    difficulty === 'easy' &&
    challenge?.mechanic === 'term_forge' &&
    attempts >= 1 &&
    !isResolved;

  const visibleOptions = useMemo(() => {
    if (!challenge || (challenge.mechanic !== 'term_forge' && challenge.mechanic !== 'context_choice')) {
      return [];
    }

    if (challenge.mechanic !== 'term_forge' || !canUseFiftyFifty || hiddenOptions.length === 0) {
      return challenge.optionsRu;
    }

    return challenge.optionsRu.filter((option) => !hiddenOptions.includes(option));
  }, [canUseFiftyFifty, challenge, hiddenOptions]);

  function finalizeTrainerSession() {
    if (!isTrainerMode || sessionFinalized) {
      return;
    }

    let score = null;
    let rank = null;

    if (trainerMechanic === 'liquidity_sprint') {
      const timeLeft = Math.max(0, sprintTimeLeft ?? 0);
      score = computeSprintScore({
        awardedLp: trainerSession.awardedLp,
        timeLeftSec: timeLeft,
        streakBonus: trainerSession.streakBonus,
      });
      const accuracy =
        trainerSession.answered > 0
          ? Math.round((trainerSession.correct / trainerSession.answered) * 100)
          : 0;
      const sprintResult = recordSprintResult({
        score,
        accuracy,
        durationSec: SPRINT_DURATION_SECONDS - timeLeft,
      });
      rank = sprintResult.rank;
      setSprintRank(rank);
      setSprintScore(score);
    }

    recordTrainerSessionResult();
    setSessionFinalized(true);
    setTrainerFinished(true);
  }

  useEffect(() => {
    if (!isTrainerMode || trainerMechanic !== 'liquidity_sprint' || trainerFinished) {
      return;
    }

    if (sprintTimeLeft === null) {
      return;
    }

    if (sprintTimeLeft > 0) {
      return;
    }

    finalizeTrainerSession();
  }, [isTrainerMode, trainerMechanic, sprintTimeLeft, trainerFinished]);

  useEffect(() => {
    if (!hardTimerEnabled || isResolved || timeLeft !== 0) {
      return;
    }

    submitCurrent('timeout');
  }, [isResolved, timeLeft, hardTimerEnabled]);

  if (invalidTrainerRoute) {
    return <Navigate to="/trainer" replace />;
  }

  if (unsupportedTrainerRoute) {
    return <Navigate to="/trainer" replace />;
  }

  if (invalidCampaignRoute) {
    return <Navigate to="/world" replace />;
  }

  if (isTrainerMode && trainerFinished) {
    const sessionAccuracy =
      trainerSession.answered > 0 ? Math.round((trainerSession.correct / trainerSession.answered) * 100) : 0;

    return (
      <section className="panel challenge-panel">
        <header className="panel-header">
          <p className="chip">{playModeTitle('trainer')}</p>
          <h2>{trainerMechanic === 'liquidity_sprint' ? 'Спринт завершён' : 'Сессия завершена'}</h2>
          <p>
            {mechanicTitle(trainerMechanic)} · {difficultyTitle(trainerDifficulty)}
          </p>
        </header>

        <article className="subpanel card-elevated">
          <p>Решено задач: {trainerSession.answered} / {sessionSize}</p>
          <p>Правильных ответов: {trainerSession.correct}</p>
          <p>Точность сессии: {sessionAccuracy}%</p>
          <p>Получено LP: +{trainerSession.awardedLp}</p>
          {trainerMechanic === 'liquidity_sprint' && sprintScore !== null && (
            <>
              <p>Итоговый score: {sprintScore}</p>
              <p>Ранг в локальном рейтинге: #{sprintRank ?? 1}</p>
            </>
          )}
        </article>

        <div className="resolution-actions">
          <button
            type="button"
            className="primary-button"
            onClick={initializeTrainerSession}
          >
            {trainerMechanic === 'liquidity_sprint' ? 'Ещё один спринт' : `Ещё ${sessionSize} задач`}
          </button>
          <Link className="ghost-button" to="/trainer">
            Сменить механику или сложность
          </Link>
        </div>
      </section>
    );
  }

  if (!challenge || !activeZone) {
    return (
      <section className="panel">
        <h2>Подготовка заданий...</h2>
      </section>
    );
  }

  const contextIsEasy = isTrainerMode && difficulty === 'easy' && challenge.mechanic === 'context_choice';
  const sprintExpired = isTrainerMode && trainerMechanic === 'liquidity_sprint' && (sprintTimeLeft ?? 0) <= 0;
  const disableInputs = isResolved || sprintExpired;

  const onHint = () => {
    setHintVisible(true);
    setHintUsed(true);
  };

  const smartSentenceCheck = () => {
    if (challenge.mechanic !== 'sentence_builder') {
      return;
    }

    if (assembledFragments.length === 0) {
      setFeedback('Сначала добавь хотя бы один фрагмент.');
      return;
    }

    const mismatchIndex = assembledFragments.findIndex(
      (fragment, index) => fragment !== challenge.fragmentsRu[index],
    );

    if (mismatchIndex === -1) {
      if (assembledFragments.length === challenge.fragmentsRu.length) {
        setFeedback('Порядок фрагментов собран верно.');
      } else {
        setFeedback(`Отлично: первые ${assembledFragments.length} фрагментов стоят в правильном порядке.`);
      }
      return;
    }

    setFeedback(`Проверь позицию ${mismatchIndex + 1}: здесь нарушен порядок фрагментов.`);
  };

  const armFiftyFifty = () => {
    if (challenge.mechanic !== 'term_forge' || hiddenOptions.length > 0) {
      return;
    }

    const wrongOptions = challenge.optionsRu.filter(
      (option) => option !== challenge.correctAnswer && option !== selectedOption,
    );
    const optionsToHide = seededShuffle(wrongOptions, hashSeed(challenge.id)).slice(0, 2);
    setHiddenOptions(optionsToHide);
  };

  function submitCurrent(reason: 'manual' | 'timeout') {
    if (disableInputs) {
      return;
    }

    if (!challenge) {
      return;
    }

    const currentChallenge = challenge;

    const answer = buildAnswer(currentChallenge, selectedOption, assembledFragments, freeInput);
    if (reason === 'manual' && !answer.trim()) {
      setFeedback('Сначала введи или собери ответ.');
      return;
    }

    const nextAttempt = attempts + 1;
    const markAsFailed = nextAttempt >= maxAttempts;

    const result = isTrainerMode
      ? submitTrainerAnswer({
          challenge: currentChallenge,
          answer,
          attempt: nextAttempt,
          hintUsed,
          difficulty,
          markAsFailed,
          mode:
            trainerMechanic === 'adaptive_recall'
              ? 'adaptive_recall'
              : trainerMechanic === 'liquidity_sprint'
                ? 'liquidity_sprint'
                : 'classic',
          retentionDue:
            trainerMechanic === 'adaptive_recall' && arcDueChallengeIds.has(currentChallenge.id),
        })
      : submitAnswer({
          challenge: currentChallenge,
          answer,
          attempt: nextAttempt,
          hintUsed,
          markAsFailed,
        });

    setAttempts(nextAttempt);

    if (result.score.isCorrect) {
      setFeedback(
        `${result.score.feedback} +${result.totalAwarded} LP${
          result.retentionBonus > 0 ? ` (ARC бонус +${result.retentionBonus})` : ''
        }${result.streakBonus > 0 ? ` (бонус серии +${result.streakBonus})` : ''}`,
      );
      setLastAward(result.totalAwarded);
      setIsResolved(true);
      setTrainerSession((previous) => ({
        answered: previous.answered + 1,
        correct: previous.correct + 1,
        awardedLp: previous.awardedLp + result.totalAwarded,
        streakBonus: previous.streakBonus + result.streakBonus,
      }));
      return;
    }

    if (isTrainerMode && difficulty === 'easy' && currentChallenge.mechanic === 'term_forge') {
      armFiftyFifty();
    }

    if (markAsFailed) {
      const timeoutNote = reason === 'timeout' ? ' Время вышло на финальной попытке.' : '';
      setFeedback(
        `Попытки закончились.${timeoutNote} Эталон: ${currentChallenge.correctAnswer}`,
      );
      setIsResolved(true);
      setTrainerSession((previous) => ({
        ...previous,
        answered: previous.answered + 1,
      }));
      return;
    }

    if (reason === 'timeout' && hardTimerEnabled) {
      setTimeLeft(difficultyRules.hardTimerSeconds);
      setFeedback(`Время вышло. Осталось попыток: ${maxAttempts - nextAttempt}.`);
      return;
    }

    setFeedback(`${result.score.feedback} Осталось попыток: ${maxAttempts - nextAttempt}.`);
  }

  const onSubmit = () => submitCurrent('manual');

  const onProceed = () => {
    if (isTrainerMode) {
      const nextIndex = trainerIndex + 1;
      if (nextIndex < trainerQueue.length && !sprintExpired) {
        setTrainerIndex(nextIndex);
        return;
      }

      finalizeTrainerSession();
      return;
    }

    if (!activeZone) {
      navigate('/world');
      return;
    }

    if (nextChallengeId) {
      navigate(`/zone/${activeZone.id}/challenge/${nextChallengeId}`);
      return;
    }

    navigate(`/zone/${activeZone.id}`);
  };

  const selectFragment = (fragment: string) => {
    setAssembledFragments((previous) => [...previous, fragment]);
    setAvailableFragments((previous) => {
      const next = [...previous];
      const index = next.indexOf(fragment);
      if (index >= 0) {
        next.splice(index, 1);
      }
      return next;
    });
  };

  const removeFragment = (indexToRemove: number) => {
    setAssembledFragments((previous) => {
      const next = [...previous];
      const [removed] = next.splice(indexToRemove, 1);
      if (removed) {
        setAvailableFragments((available) => [...available, removed]);
      }
      return next;
    });
  };

  const resetSentence = () => {
    if (challenge.mechanic !== 'sentence_builder') {
      return;
    }

    setAssembledFragments([]);
    setAvailableFragments(seededShuffle(challenge.fragmentsRu, hashSeed(challenge.id)));
  };

  const sentenceProgress =
    challenge.mechanic === 'sentence_builder'
      ? `${assembledFragments.length}/${challenge.fragmentsRu.length}`
      : null;

  const zoneCompletedCount = activeZone.challengeIds.filter(
    (itemChallengeId) => progress.completedChallenges[itemChallengeId] !== undefined,
  ).length;
  const zoneProgressPercent = Math.round((zoneCompletedCount / activeZone.challengeIds.length) * 100);
  const campaignCompletedCount = Object.keys(progress.completedChallenges).length;
  const campaignProgressPercent = Math.round((campaignCompletedCount / totalChallengeCount) * 100);

  return (
    <section className="panel challenge-panel">
      <header className="challenge-header">
        <div>
          <div className="challenge-mode-row">
            <p className="chip">{playModeTitle(playMode)}</p>
            <p className="chip">{mechanicTitle(isTrainerMode ? trainerMechanic : challenge.mechanic)}</p>
            {isTrainerMode && <p className="chip">{difficultyTitle(difficulty)}</p>}
            {hardTimerEnabled && <p className="chip">Таймер: {timeLeft ?? difficultyRules.hardTimerSeconds}с</p>}
            {isTrainerMode && trainerMechanic === 'liquidity_sprint' && (
              <p className="chip">Спринт: {sprintTimeLeft ?? SPRINT_DURATION_SECONDS}с</p>
            )}
          </div>
          <h2>{activeZone.title}</h2>
          <p>Задание: {challenge.promptEn}</p>
          {isTrainerMode && sessionTheme && (
            <p className="muted">
              Пакет: <strong>{sessionTheme.title}</strong>. {sessionTheme.brief}
            </p>
          )}
          {isTrainerMode && (
            <p className="muted">
              Сессия: {Math.min(trainerIndex + 1, sessionSize)} / {sessionSize}
            </p>
          )}
        </div>

        <div className="challenge-meta card-elevated">
          <p>Попытка: {Math.min(attempts + 1, maxAttempts)} / {maxAttempts}</p>
          <p>
            Подсказка: {hintUsed ? `использована (-${difficultyRules.hintPenalty} LP)` : 'не использована'}
          </p>
          {lastAward > 0 && <p>Награда: +{lastAward} LP</p>}
          {sentenceProgress && <p>Сборка: {sentenceProgress}</p>}
        </div>
      </header>

      {isTrainerMode ? (
        <article className="subpanel card-elevated trainer-progress-panel">
          <p>
            Прогресс сессии: <strong>{trainerSession.answered}</strong> / {sessionSize}
          </p>
          <p>
            Сохранено в профиле: <strong>{progress.trainerStats.correctAnswers}</strong> верных из{' '}
            <strong>{progress.trainerStats.answersGiven}</strong> ответов
          </p>
        </article>
      ) : (
        <article className="subpanel card-elevated trainer-progress-panel">
          <p>
            Прогресс зоны: <strong>{zoneCompletedCount}</strong> / {activeZone.challengeIds.length}
          </p>
          <div className="progress-track" aria-label="Прогресс текущей зоны">
            <div className="progress-fill" style={{ width: `${zoneProgressPercent}%` }} />
          </div>
          <p>
            Прогресс кампании: <strong>{campaignCompletedCount}</strong> / {totalChallengeCount}
          </p>
          <div className="progress-track" aria-label="Прогресс кампании">
            <div className="progress-fill" style={{ width: `${campaignProgressPercent}%` }} />
          </div>
        </article>
      )}

      {(challenge.mechanic === 'term_forge' || challenge.mechanic === 'context_choice') && (
        <div className="task-block card-elevated">
          {challenge.mechanic === 'context_choice' && (
            <>
              <blockquote className="context-block">
                {contextIsEasy ? highlightContext(challenge.contextEn, challenge.keywords) : challenge.contextEn}
              </blockquote>
              {contextIsEasy && (
                <div className="keywords-row">
                  {challenge.keywords.slice(0, 5).map((keyword) => (
                    <span key={keyword} className="chip">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="options-list">
            {visibleOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option)}
                disabled={disableInputs}
              >
                {option}
              </button>
            ))}
          </div>
          {canUseFiftyFifty && hiddenOptions.length > 0 && (
            <p className="muted">Режим easy: активирован 50/50, две неверные опции скрыты.</p>
          )}
        </div>
      )}

      {challenge.mechanic === 'sentence_builder' && (
        <div className="task-block sentence-builder card-elevated">
          <p className="sentence-label">Собранный перевод:</p>
          <div className="assembled-line">
            {assembledFragments.length === 0 && <span className="muted">Пока пусто</span>}
            {assembledFragments.map((fragment, index) => {
              let stateClass = '';
              if (isTrainerMode && difficulty === 'easy' && !isResolved) {
                stateClass = fragment === challenge.fragmentsRu[index] ? 'fragment-correct' : 'fragment-wrong';
              }

              return (
                <button
                  type="button"
                  key={`${fragment}-${index}`}
                  className={`fragment-chip selected ${stateClass}`}
                  onClick={() => removeFragment(index)}
                  disabled={disableInputs}
                >
                  {index + 1}. {fragment}
                </button>
              );
            })}
          </div>

          <p className="sentence-label">Фрагменты:</p>
          <div className="fragments-pool">
            {availableFragments.map((fragment, index) => (
              <button
                type="button"
                key={`${fragment}-${index}`}
                className="fragment-chip"
                onClick={() => selectFragment(fragment)}
                disabled={disableInputs}
              >
                {fragment}
              </button>
            ))}
          </div>

          <div className="resolution-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={resetSentence}
              disabled={disableInputs}
            >
              Перемешать заново
            </button>

            {isTrainerMode && difficulty === 'easy' && (
              <button
                type="button"
                className="secondary-button"
                onClick={smartSentenceCheck}
                disabled={disableInputs}
              >
                Умная проверка порядка
              </button>
            )}
          </div>
        </div>
      )}

      {challenge.mechanic === 'boardroom_boss' && (
        <div className="task-block card-elevated">
          <textarea
            className="boss-input"
            placeholder="Введи полный перевод предложения..."
            value={freeInput}
            onChange={(event) => setFreeInput(event.target.value)}
            disabled={disableInputs}
          />
          <p className="muted">
            Покрытие ключевых смыслов: {liveBossKeywords.length} / {challenge.requiredKeywords.length}
          </p>
          <div className="keywords-row">
            {challenge.requiredKeywords.map((keyword) => {
              const isMatched = liveBossKeywords.some(
                (matched) => matched.toLowerCase() === keyword.toLowerCase(),
              );

              return (
                <span key={keyword} className={`chip ${isMatched ? 'keyword-hit' : ''}`}>
                  {keyword}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="challenge-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onHint}
          disabled={hintVisible || disableInputs}
        >
          Показать подсказку
        </button>

        <button type="button" className="primary-button" onClick={onSubmit} disabled={disableInputs}>
          Проверить ответ
        </button>
      </div>

      {hintVisible && <p className="hint-box">Подсказка: {challenge.hint}</p>}
      {feedback && <p className="feedback-box">{feedback}</p>}

      {isResolved && (
        <div className="resolution-box">
          <p>
            Объяснение: <strong>{challenge.explanation}</strong>
          </p>
          <div className="resolution-actions">
            <button type="button" className="primary-button" onClick={onProceed}>
              {isTrainerMode
                ? trainerIndex + 1 < trainerQueue.length
                  ? 'Следующее задание'
                  : 'К итогам сессии'
                : nextChallengeId
                  ? 'Следующее задание'
                  : 'Вернуться в зону'}
            </button>
            {isTrainerMode ? (
              <Link className="ghost-button" to="/trainer">
                К выбору тренажёра
              </Link>
            ) : (
              <Link
                className="ghost-button"
                to={`/zone/${activeZone.id}`}
                onClick={() => setCurrentZone(activeZone.id)}
              >
                К обзору зоны
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
