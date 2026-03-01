import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { challengeById } from '../data';
import { getDifficultyConfig, matchBossKeywords } from '../lib/engine';
import { mechanicTitle } from '../lib/labels';
import { seededShuffle } from '../lib/text';
import { useGame } from '../state/GameContext';
import { Challenge } from '../types/game';

const chainMultipliers = [1, 1.1, 1.25] as const;

function hashSeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
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

export function CasePage() {
  const { zoneId, scenarioId } = useParams<{ zoneId: string; scenarioId: string }>();
  const {
    unlockedZones,
    startCaseScenario,
    submitTrainerAnswer,
    recordCaseScenarioResult,
  } = useGame();

  const scenario = scenarioId ? startCaseScenario(scenarioId) : null;

  const [stepIndex, setStepIndex] = useState(0);
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
  const [chainActive, setChainActive] = useState(true);
  const [finished, setFinished] = useState(false);
  const [session, setSession] = useState({
    answered: 0,
    correct: 0,
    awardedLp: 0,
  });

  const mediumRules = getDifficultyConfig('medium');
  const maxAttempts = mediumRules.maxAttempts;

  const currentChallengeId = scenario ? scenario.steps[stepIndex] : null;
  const challenge = currentChallengeId ? challengeById[currentChallengeId] : undefined;

  const liveBossKeywords = useMemo(() => {
    if (!challenge || challenge.mechanic !== 'boardroom_boss') {
      return [];
    }
    return matchBossKeywords(freeInput, challenge);
  }, [challenge, freeInput]);

  useEffect(() => {
    if (!challenge) {
      return;
    }

    setAttempts(0);
    setHintVisible(false);
    setHintUsed(false);
    setSelectedOption('');
    setFeedback('');
    setIsResolved(false);
    setAssembledFragments([]);
    setFreeInput('');
    setLastAward(0);

    if (challenge.mechanic === 'sentence_builder') {
      setAvailableFragments(seededShuffle(challenge.fragmentsRu, hashSeed(challenge.id)));
    } else {
      setAvailableFragments([]);
    }
  }, [challenge?.id]);

  if (!scenario || !zoneId || scenario.zoneId !== zoneId) {
    return <Navigate to="/trainer" replace />;
  }

  if (!unlockedZones.has(scenario.zoneId)) {
    return (
      <section className="panel">
        <h2>Кейс пока закрыт</h2>
        <p>Сначала разблокируй соответствующую зону на карте.</p>
        <Link to="/world" className="primary-button">
          К карте
        </Link>
      </section>
    );
  }

  if (!challenge) {
    return (
      <section className="panel">
        <h2>Кейс не найден</h2>
        <p>В сценарии отсутствуют ожидаемые шаги.</p>
        <Link to="/trainer" className="primary-button">
          К тренажёру
        </Link>
      </section>
    );
  }

  if (finished) {
    const accuracy = session.answered > 0 ? Math.round((session.correct / session.answered) * 100) : 0;

    return (
      <section className="panel challenge-panel">
        <header className="panel-header">
          <p className="chip">Case Ladder</p>
          <h2>{scenario.title}</h2>
          <p>{scenario.brief}</p>
        </header>

        <article className="subpanel card-elevated">
          <p>Шагов решено: {session.answered} / 3</p>
          <p>Правильных шагов: {session.correct}</p>
          <p>Точность кейса: {accuracy}%</p>
          <p>Получено LP: +{session.awardedLp}</p>
          <p>Цепочка: {chainActive ? 'сохранена до конца' : 'прервана'}</p>
        </article>

        <div className="resolution-actions">
          <Link className="primary-button" to="/trainer">
            К тренажёру
          </Link>
          <Link className="ghost-button" to={`/case/${scenario.zoneId}/${scenario.id}`}>
            Переиграть кейс
          </Link>
        </div>
      </section>
    );
  }

  const multiplier = chainActive ? chainMultipliers[stepIndex] : 1;

  const submitCurrent = () => {
    if (!challenge || isResolved) {
      return;
    }

    const answer = buildAnswer(challenge, selectedOption, assembledFragments, freeInput);
    if (!answer.trim()) {
      setFeedback('Сначала введи или собери ответ.');
      return;
    }

    const nextAttempt = attempts + 1;
    const markAsFailed = nextAttempt >= maxAttempts;

    const result = submitTrainerAnswer({
      challenge,
      answer,
      attempt: nextAttempt,
      hintUsed,
      difficulty: 'medium',
      markAsFailed,
      mode: 'case_ladder',
      lpMultiplier: multiplier,
    });

    setAttempts(nextAttempt);

    if (result.score.isCorrect) {
      setFeedback(`${result.score.feedback} +${result.totalAwarded} LP`);
      setLastAward(result.totalAwarded);
      setIsResolved(true);
      setSession((previous) => ({
        answered: previous.answered + 1,
        correct: previous.correct + 1,
        awardedLp: previous.awardedLp + result.totalAwarded,
      }));
      return;
    }

    if (markAsFailed) {
      setChainActive(false);
      setFeedback(`Шаг провален. Эталон: ${challenge.correctAnswer}`);
      setIsResolved(true);
      setSession((previous) => ({
        ...previous,
        answered: previous.answered + 1,
      }));
      return;
    }

    setFeedback(`${result.score.feedback} Осталось попыток: ${maxAttempts - nextAttempt}.`);
  };

  const onProceed = () => {
    const nextStep = stepIndex + 1;
    if (nextStep < scenario.steps.length) {
      setStepIndex(nextStep);
      return;
    }

    const completed = session.correct === scenario.steps.length;
    const accuracy = session.answered > 0 ? Math.round((session.correct / session.answered) * 100) : 0;

    recordCaseScenarioResult({
      scenarioId: scenario.id,
      awardedLp: session.awardedLp,
      accuracy,
      completed,
    });

    setFinished(true);
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

  return (
    <section className="panel challenge-panel">
      <header className="challenge-header">
        <div>
          <div className="challenge-mode-row">
            <p className="chip">Case Ladder</p>
            <p className="chip">Шаг {stepIndex + 1} / 3</p>
            <p className="chip">{mechanicTitle(challenge.mechanic)}</p>
            <p className="chip">x{multiplier.toFixed(2)}</p>
          </div>
          <h2>{scenario.title}</h2>
          <p>{scenario.brief}</p>
          <p>Задание: {challenge.promptEn}</p>
        </div>

        <div className="challenge-meta card-elevated">
          <p>Попытка: {Math.min(attempts + 1, maxAttempts)} / {maxAttempts}</p>
          <p>Цепочка: {chainActive ? 'активна' : 'сброшена'}</p>
          <p>
            Подсказка: {hintUsed ? `использована (-${mediumRules.hintPenalty} LP)` : 'не использована'}
          </p>
          {lastAward > 0 && <p>Награда: +{lastAward} LP</p>}
        </div>
      </header>

      {(challenge.mechanic === 'term_forge' || challenge.mechanic === 'context_choice') && (
        <div className="task-block card-elevated">
          {challenge.mechanic === 'context_choice' && (
            <blockquote className="context-block">{challenge.contextEn}</blockquote>
          )}
          <div className="options-list">
            {challenge.optionsRu.map((option) => (
              <button
                key={option}
                type="button"
                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option)}
                disabled={isResolved}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {challenge.mechanic === 'sentence_builder' && (
        <div className="task-block sentence-builder card-elevated">
          <p className="sentence-label">Собранный перевод:</p>
          <div className="assembled-line">
            {assembledFragments.length === 0 && <span className="muted">Пока пусто</span>}
            {assembledFragments.map((fragment, index) => (
              <button
                type="button"
                key={`${fragment}-${index}`}
                className="fragment-chip selected"
                onClick={() => removeFragment(index)}
                disabled={isResolved}
              >
                {index + 1}. {fragment}
              </button>
            ))}
          </div>

          <p className="sentence-label">Фрагменты:</p>
          <div className="fragments-pool">
            {availableFragments.map((fragment, index) => (
              <button
                type="button"
                key={`${fragment}-${index}`}
                className="fragment-chip"
                onClick={() => selectFragment(fragment)}
                disabled={isResolved}
              >
                {fragment}
              </button>
            ))}
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
            disabled={isResolved}
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
          onClick={() => {
            setHintVisible(true);
            setHintUsed(true);
          }}
          disabled={hintVisible || isResolved}
        >
          Показать подсказку
        </button>

        <button type="button" className="primary-button" onClick={submitCurrent} disabled={isResolved}>
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
              {stepIndex + 1 < scenario.steps.length ? 'Следующий шаг' : 'К итогам кейса'}
            </button>
            <Link className="ghost-button" to="/trainer">
              К тренажёру
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
