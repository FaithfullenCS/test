import {
  BoardroomBossChallenge,
  Challenge,
  ContextChoiceChallenge,
  SentenceBuilderChallenge,
  TermForgeChallenge,
  ZoneId,
} from '../../../types/game';

const WORLD_ID = 'cash-flow-statement-performance' as const;

interface TermSeed {
  promptEn: string;
  correctRu: string;
  distractors: [string, string, string];
  hint: string;
  explanation: string;
  keywords: string[];
}

interface SentenceSeed {
  promptEn: string;
  fragmentsRu: string[];
  hint: string;
  explanation: string;
  keywords: string[];
}

interface ContextSeed {
  contextEn: string;
  promptEn: string;
  correctRu: string;
  optionsRu: [string, string, string, string];
  hint: string;
  explanation: string;
  keywords: string[];
}

interface BossSeed {
  promptEn: string;
  canonicalRu: string;
  acceptableAnswers: string[];
  requiredKeywords: string[];
  keywordSynonyms: Record<string, string[]>;
  hint: string;
  explanation: string;
  keywords: string[];
}

interface ZoneSeeds {
  term: TermSeed[];
  sentence: SentenceSeed[];
  context: ContextSeed[];
  boss: BossSeed[];
}

function rotateOptions(
  options: [string, string, string, string],
  index: number,
): string[] {
  const offset = index % options.length;
  return options.map((_, itemIndex) => options[(itemIndex + offset) % options.length]);
}

function buildTermChallenges(zoneId: ZoneId, seeds: TermSeed[]): TermForgeChallenge[] {
  return seeds.map((seed, index) => ({
    id: `${zoneId}-term-${index + 1}`,
    worldId: WORLD_ID,
    zoneId,
    mechanic: 'term_forge',
    promptEn: seed.promptEn,
    optionsRu: rotateOptions(
      [seed.correctRu, seed.distractors[0], seed.distractors[1], seed.distractors[2]],
      index,
    ),
    correctAnswer: seed.correctRu,
    hint: seed.hint,
    explanation: seed.explanation,
    reward: 10,
    keywords: seed.keywords,
  }));
}

function buildSentenceChallenges(
  zoneId: ZoneId,
  seeds: SentenceSeed[],
): SentenceBuilderChallenge[] {
  return seeds.map((seed, index) => ({
    id: `${zoneId}-sentence-${index + 1}`,
    worldId: WORLD_ID,
    zoneId,
    mechanic: 'sentence_builder',
    promptEn: seed.promptEn,
    fragmentsRu: seed.fragmentsRu,
    correctAnswer: seed.fragmentsRu.join(' '),
    hint: seed.hint,
    explanation: seed.explanation,
    reward: 10,
    keywords: seed.keywords,
  }));
}

function buildContextChallenges(
  zoneId: ZoneId,
  seeds: ContextSeed[],
): ContextChoiceChallenge[] {
  return seeds.map((seed, index) => ({
    id: `${zoneId}-context-${index + 1}`,
    worldId: WORLD_ID,
    zoneId,
    mechanic: 'context_choice',
    contextEn: seed.contextEn,
    promptEn: seed.promptEn,
    optionsRu: rotateOptions(seed.optionsRu, index),
    correctAnswer: seed.correctRu,
    hint: seed.hint,
    explanation: seed.explanation,
    reward: 10,
    keywords: seed.keywords,
  }));
}

function buildBossChallenges(zoneId: ZoneId, seeds: BossSeed[]): BoardroomBossChallenge[] {
  return seeds.map((seed, index) => ({
    id: `${zoneId}-boss-${index + 1}`,
    worldId: WORLD_ID,
    zoneId,
    mechanic: 'boardroom_boss',
    promptEn: seed.promptEn,
    correctAnswer: seed.canonicalRu,
    acceptableAnswers: seed.acceptableAnswers,
    requiredKeywords: seed.requiredKeywords,
    keywordSynonyms: seed.keywordSynonyms,
    hint: seed.hint,
    explanation: seed.explanation,
    reward: 10,
    keywords: seed.keywords,
  }));
}

const zoneSeeds: Record<string, ZoneSeeds> = {
  cfs_abstract_delta: {
    term: [
      {
        promptEn: 'cash flow',
        correctRu: 'денежный поток',
        distractors: ['бухгалтерский баланс', 'себестоимость продаж', 'рыночная капитализация'],
        hint: 'Это движение денег внутрь и наружу компании.',
        explanation: 'Cash flow переводится как движение денежных средств или денежный поток.',
        keywords: ['cash flow', 'денежный поток'],
      },
      {
        promptEn: 'financial performance',
        correctRu: 'финансовая результативность',
        distractors: ['налоговая ставка', 'кассовая дисциплина', 'производственная мощность'],
        hint: 'Речь о том, насколько успешно компания работает в денежном выражении.',
        explanation: 'Финансовая результативность описывает финансовые результаты фирмы.',
        keywords: ['financial performance', 'результативность'],
      },
      {
        promptEn: 'operating activities',
        correctRu: 'операционная деятельность',
        distractors: ['внеоборотные активы', 'биржевые торги', 'страховые выплаты'],
        hint: 'Это основная ежедневная деятельность компании.',
        explanation: 'Operating activities - основная деятельность, формирующая выручку и расходы.',
        keywords: ['operating activities', 'операционная'],
      },
      {
        promptEn: 'financing activities',
        correctRu: 'финансовая деятельность',
        distractors: ['складская деятельность', 'маркетинговая кампания', 'кадровая политика'],
        hint: 'Связано с получением средств от внешних источников.',
        explanation: 'Financing activities включают заемные средства, эмиссию и выплаты собственникам.',
        keywords: ['financing activities', 'финансовая деятельность'],
      },
      {
        promptEn: 'investing activities',
        correctRu: 'инвестиционная деятельность',
        distractors: ['операционная аренда', 'амортизационная политика', 'сезонная корректировка'],
        hint: 'Здесь компания покупает или продает долгосрочные активы.',
        explanation: 'Investing activities касаются инвестиций в оборудование и другие долгосрочные активы.',
        keywords: ['investing activities', 'инвестиции'],
      },
      {
        promptEn: 'ex-post facto research design',
        correctRu: 'исследовательский дизайн ex-post facto',
        distractors: ['экспериментальный протокол', 'рандомизированный опрос', 'полевой аудит'],
        hint: 'Это анализ уже произошедших фактов, без вмешательства исследователя.',
        explanation: 'Ex-post facto обозначает исследование на основе исторических данных.',
        keywords: ['ex-post facto', 'исследовательский дизайн'],
      },
      {
        promptEn: 'corporate performance (ROTA)',
        correctRu: 'корпоративная результативность (ROTA)',
        distractors: ['долгосрочный долг', 'ежеквартальная выручка', 'валютный резерв'],
        hint: 'В этой статье performance измеряется через return on total assets.',
        explanation:
          'Corporate performance в модели статьи измеряется через ROTA (return on total assets).',
        keywords: ['corporate performance (ROTA)', 'ROTA'],
      },
      {
        promptEn: 'listed companies',
        correctRu: 'компании, котирующиеся на бирже',
        distractors: ['дочерние предприятия', 'компании-стартапы', 'государственные агентства'],
        hint: 'Эти фирмы торгуются на фондовом рынке.',
        explanation: 'Listed companies - публичные компании, акции которых обращаются на бирже.',
        keywords: ['listed companies', 'биржа'],
      },
    ],
    sentence: [
      {
        promptEn:
          'The aim of this study was to investigate the effect of cash flow on financial performance.',
        fragmentsRu: [
          'Целью данного исследования было',
          'изучить влияние денежного потока',
          'на финансовую результативность.',
        ],
        hint: 'Начни с конструкции «Целью данного исследования было...»',
        explanation: 'Ключевой шаблон академического введения - «целью исследования было».',
        keywords: ['цель', 'влияние', 'результативность'],
      },
      {
        promptEn: 'Cash in organizations usually takes two directions: inflow and outflow.',
        fragmentsRu: [
          'Денежные средства в организациях',
          'обычно имеют два направления:',
          'приток и отток.',
        ],
        hint: 'В переводе должны быть слова «приток» и «отток».',
        explanation: 'Inflow/outflow в контексте cash flow переводятся как приток и отток.',
        keywords: ['приток', 'отток'],
      },
      {
        promptEn:
          'Net positive cash flow indicates prudent management under operating, investing and financing activities.',
        fragmentsRu: [
          'Чистый положительный денежный поток',
          'указывает на разумное управление',
          'в операционной, инвестиционной и финансовой деятельности.',
        ],
        hint: 'Сохрани три вида деятельности в одном фрагменте.',
        explanation: 'В предложении важно перечисление трех потоков: operating, investing, financing.',
        keywords: ['положительный', 'управление', 'операционной'],
      },
      {
        promptEn:
          'Cash flows from investing activities are associated with the purchase and disposal of productive facilities.',
        fragmentsRu: [
          'Денежные потоки от инвестиционной деятельности',
          'связаны с покупкой и выбытием',
          'производственных объектов.',
        ],
        hint: 'Disposal здесь переводится как «выбытие» или «продажа».',
        explanation: 'Investing activities часто описывают через покупку и продажу долгосрочных активов.',
        keywords: ['инвестиционной', 'покупкой', 'выбытием'],
      },
      {
        promptEn:
          'One of the main reasons businesses fail is their inability to meet financial obligations when due.',
        fragmentsRu: [
          'Одна из главных причин',
          'неудачи бизнеса - неспособность',
          'своевременно выполнять финансовые обязательства.',
        ],
        hint: 'When due = вовремя, в срок.',
        explanation: 'Фраза подчеркивает, что кассовые разрывы ведут к невыполнению обязательств.',
        keywords: ['обязательства', 'своевременно'],
      },
      {
        promptEn: 'Maintaining healthy cash flow is essential for a successful business.',
        fragmentsRu: [
          'Поддержание здорового денежного потока',
          'является необходимым условием',
          'успешного бизнеса.',
        ],
        hint: 'Смысл: без контроля cash flow бизнес неустойчив.',
        explanation: 'Healthy cash flow передается как устойчивый/здоровый денежный поток.',
        keywords: ['поддержание', 'необходимым', 'успешного'],
      },
    ],
    context: [
      {
        contextEn:
          'The study focused on listed food and beverage firms and used panel regression with secondary data.',
        promptEn: 'Which translation is best for "secondary sources of data" in this context?',
        correctRu: 'вторичные источники данных',
        optionsRu: [
          'вторичные источники данных',
          'дополнительные полевые датчики',
          'временные кассовые таблицы',
          'запасы сырья на складе',
        ],
        hint: 'Secondary data = уже собранные кем-то данные.',
        explanation: 'В исследовательском контексте это официальная отчетность и публикации.',
        keywords: ['secondary data', 'вторичные данные'],
      },
      {
        contextEn: 'Research questions were set to guide the study objectives.',
        promptEn: 'Choose the best translation for "to guide the study".',
        correctRu: 'направлять исследование',
        optionsRu: [
          'направлять исследование',
          'завершить финансирование',
          'свернуть производство',
          'проверить склад',
        ],
        hint: 'Guide = направлять, служить ориентиром.',
        explanation: 'Фраза означает роль исследовательских вопросов как ориентира.',
        keywords: ['guide', 'направлять'],
      },
      {
        contextEn: 'Hypotheses were formulated for operating, financing and investing cash flows.',
        promptEn: 'Best translation of "were formulated"?',
        correctRu: 'были сформулированы',
        optionsRu: [
          'были сформулированы',
          'были куплены',
          'были списаны',
          'были переведены в акции',
        ],
        hint: 'Глагол из академического стиля.',
        explanation: 'Гипотезы формулируют до статистической проверки.',
        keywords: ['hypotheses', 'сформулированы'],
      },
      {
        contextEn: 'The broad objective was to appraise the effect of cash flow.',
        promptEn: 'Select the best translation of "broad objective".',
        correctRu: 'общая цель',
        optionsRu: ['общая цель', 'короткий вывод', 'частная метрика', 'пороговая ставка'],
        hint: 'Broad opposite to specific.',
        explanation: 'В статье общая цель раскрывается через конкретные подцели.',
        keywords: ['objective', 'цель'],
      },
      {
        contextEn: 'Cash inflows and outflows are the heartbeat of every business endeavor.',
        promptEn: 'How to translate "heartbeat" metaphor in this sentence?',
        correctRu: 'жизненно важная основа',
        optionsRu: [
          'жизненно важная основа',
          'медицинский термин',
          'временная переменная',
          'налоговый период',
        ],
        hint: 'Это метафора про жизнеспособность бизнеса.',
        explanation: 'Heartbeat тут не про медицину, а про ключевую роль денежных потоков.',
        keywords: ['heartbeat', 'основа'],
      },
      {
        contextEn: 'Investors and analysts face issues when cash flow data is missing.',
        promptEn: 'Choose the best translation of "assessing a company’s performance".',
        correctRu: 'оценка результативности компании',
        optionsRu: [
          'оценка результативности компании',
          'закрытие компании',
          'покупка облигаций',
          'пересчет амортизации',
        ],
        hint: 'Assessing = оценивание.',
        explanation: 'Фраза относится к аналитической оценке качества работы фирмы.',
        keywords: ['assessing', 'оценка'],
      },
    ],
    boss: [
      {
        promptEn:
          'Cash from operating activities significantly affects corporate performance (ROTA) of food and beverage firms in Nigeria.',
        canonicalRu:
          'Денежные потоки от операционной деятельности существенно влияют на корпоративную результативность (ROTA) пищевых и напиточных компаний Нигерии.',
        acceptableAnswers: [
          'Операционный денежный поток статистически значимо влияет на корпоративную результативность (ROTA) компаний пищевой и напиточной отрасли Нигерии.',
          'Потоки денежных средств от операционной деятельности существенно воздействуют на показатель ROTA фирм food and beverage в Нигерии.',
        ],
        requiredKeywords: ['операционной', 'влияют', 'ROTA', 'Нигерии'],
        keywordSynonyms: {
          операционной: ['операц', 'текущей'],
          влияют: ['воздействуют', 'влияет', 'влияют'],
          ROTA: ['rota', 'result', 'результатив'],
          Нигерии: ['нигерии'],
        },
        hint: 'Сохрани связь: operating cash flow -> corporate performance (ROTA).',
        explanation:
          'Ключевой вывод статьи: OPCF имеет статистически значимую положительную связь с ROTA.',
        keywords: ['operating', 'ROTA', 'Nigeria'],
      },
      {
        promptEn:
          'The researcher adopted an ex-post facto design and used data from 2007 to 2011 financial statements.',
        canonicalRu:
          'Исследователь применил дизайн ex-post facto и использовал данные финансовой отчетности за 2007-2011 годы.',
        acceptableAnswers: [
          'Был применен дизайн ex-post facto, а данные взяты из финансовых отчетов за 2007-2011 годы.',
          'Автор использовал ex-post facto подход и данные из финансовой отчетности периода 2007-2011.',
        ],
        requiredKeywords: ['ex-post', 'данные', '2007', '2011'],
        keywordSynonyms: {
          'ex-post': ['ex-post', 'экс-пост'],
          данные: ['данные', 'сведения'],
          '2007': ['2007'],
          '2011': ['2011'],
        },
        hint: 'Обязательно сохрани годы и метод исследования.',
        explanation: 'Ex-post facto опирается на исторические данные без экспериментального вмешательства.',
        keywords: ['ex-post facto', '2007', '2011'],
      },
      {
        promptEn:
          'The study recommends that external auditors should use cash flow ratios before forming an independent opinion.',
        canonicalRu:
          'Исследование рекомендует, чтобы внешние аудиторы использовали коэффициенты денежных потоков до формирования независимого мнения по финансовой отчетности.',
        acceptableAnswers: [
          'Авторы рекомендуют внешним аудиторам применять cash flow ratios при оценке компании до вынесения независимого мнения.',
          'Рекомендуется использовать коэффициенты денежных потоков в аудите до формирования независимого заключения по отчетности.',
        ],
        requiredKeywords: ['аудитор', 'коэффици', 'денежн', 'мнения'],
        keywordSynonyms: {
          аудитор: ['аудитор', 'внешн'],
          коэффици: ['коэффици', 'ratio'],
          денежн: ['денежн', 'cash flow'],
          мнения: ['мнения', 'заключен', 'opinion'],
        },
        hint: 'Сохрани логику: сначала cash flow ratios, затем независимое мнение аудитора.',
        explanation:
          'Это прямая рекомендация из текста статьи для повышения качества инвестиционных решений.',
        keywords: ['external auditors', 'cash flow ratios'],
      },
      {
        promptEn:
          'Knowing how to maintain healthy cash flow is essential to a successful business.',
        canonicalRu:
          'Понимание того, как поддерживать здоровый денежный поток, необходимо для успешного бизнеса.',
        acceptableAnswers: [
          'Умение поддерживать устойчивый денежный поток является необходимым условием успешного бизнеса.',
          'Знание способов поддержания здорового cash flow критично для успеха бизнеса.',
        ],
        requiredKeywords: ['поддерж', 'денежн', 'необходим', 'успеш'],
        keywordSynonyms: {
          поддерж: ['поддерж', 'сохран'],
          денежн: ['денежн', 'cash flow'],
          необходим: ['необходим', 'важн', 'критич'],
          успеш: ['успеш', 'успех'],
        },
        hint: 'Healthy cash flow можно передать как «здоровый» или «устойчивый».',
        explanation: 'Это центральный практический тезис введения.',
        keywords: ['healthy cash flow', 'successful business'],
      },
    ],
  },
  cfs_liquidity_corridor: {
    term: [
      {
        promptEn: 'cash inflows',
        correctRu: 'денежные притоки',
        distractors: ['денежные остатки', 'курсовые разницы', 'налоговые вычеты'],
        hint: 'Это поступления денег в компанию.',
        explanation: 'Inflows - это входящие денежные потоки.',
        keywords: ['cash inflows', 'притоки'],
      },
      {
        promptEn: 'cash outflows',
        correctRu: 'денежные оттоки',
        distractors: ['денежные резервы', 'фонд оплаты труда', 'дебиторская просрочка'],
        hint: 'Это выплаты и уход денег.',
        explanation: 'Outflows описывают расход денежных средств.',
        keywords: ['cash outflows', 'оттоки'],
      },
      {
        promptEn: 'working capital management',
        correctRu: 'управление оборотным капиталом',
        distractors: ['управление амортизацией', 'управление брендом', 'управление аудитом'],
        hint: 'Working capital = оборотный капитал.',
        explanation: 'Термин связан с краткосрочными активами и обязательствами.',
        keywords: ['working capital', 'оборотный капитал'],
      },
      {
        promptEn: 'indirect method',
        correctRu: 'косвенный метод',
        distractors: ['балансовый метод', 'графический метод', 'структурный метод'],
        hint: 'Метод, где чистая прибыль корректируется на неденежные статьи.',
        explanation: 'Косвенный метод начинается с net income и вносит корректировки.',
        keywords: ['indirect method', 'косвенный'],
      },
      {
        promptEn: 'direct method',
        correctRu: 'прямой метод',
        distractors: ['линейный метод', 'корректировочный метод', 'учетный метод'],
        hint: 'Метод, где показываются валовые денежные поступления и выплаты.',
        explanation: 'Прямой метод показывает реальные денежные потоки по операциям.',
        keywords: ['direct method', 'прямой'],
      },
      {
        promptEn: 'trade receivables',
        correctRu: 'торговая дебиторская задолженность',
        distractors: ['торговая выручка', 'запасы готовой продукции', 'кредиторская задолженность'],
        hint: 'Это деньги, которые должны заплатить покупатели.',
        explanation: 'Receivables - суммы к получению от контрагентов.',
        keywords: ['receivables', 'дебиторская'],
      },
      {
        promptEn: 'operating expenses',
        correctRu: 'операционные расходы',
        distractors: ['финансовые доходы', 'инвестиционные активы', 'капитальные вложения'],
        hint: 'Расходы по основной деятельности.',
        explanation: 'Operating expenses формируют текущую затратную часть бизнеса.',
        keywords: ['operating expenses', 'расходы'],
      },
      {
        promptEn: 'liquidity position',
        correctRu: 'позиция ликвидности',
        distractors: ['позиция бренда', 'позиция акционеров', 'позиция налогов'],
        hint: 'Насколько легко компания покрывает краткосрочные обязательства.',
        explanation: 'Liquidity position описывает платежеспособность в кратком горизонте.',
        keywords: ['liquidity', 'ликвидность'],
      },
    ],
    sentence: [
      {
        promptEn:
          'Cash flow analysis gives a snapshot of cash coming into the business and cash flowing out.',
        fragmentsRu: [
          'Анализ денежных потоков дает моментальный срез',
          'о поступлении денег в бизнес',
          'и об их выбытии.',
        ],
        hint: 'Snapshot передай как «моментальный срез».',
        explanation: 'Фраза описывает оперативную картину притоков и оттоков.',
        keywords: ['анализ', 'поступлении', 'выбытии'],
      },
      {
        promptEn:
          'Cash sales and cash collections from trade receivables constitute cash inflows from operating activities.',
        fragmentsRu: [
          'Продажи за наличные и денежные поступления',
          'по торговой дебиторской задолженности',
          'формируют притоки от операционной деятельности.',
        ],
        hint: 'Constitute = формируют / составляют.',
        explanation: 'Это классический пример operating inflows.',
        keywords: ['наличные', 'дебиторской', 'притоки'],
      },
      {
        promptEn:
          'Cash payments for inventories, taxes, interest and dividends are considered cash outflows.',
        fragmentsRu: [
          'Денежные выплаты за запасы, налоги, проценты и дивиденды',
          'рассматриваются как',
          'денежные оттоки.',
        ],
        hint: 'Ключевой термин - cash outflows.',
        explanation: 'Перечень типичных выплат по операционным активностям.',
        keywords: ['выплаты', 'оттоки'],
      },
      {
        promptEn:
          'This section is crucial because it highlights success in operations and working capital management.',
        fragmentsRu: [
          'Этот раздел критически важен,',
          'потому что отражает успех',
          'в операциях и управлении оборотным капиталом.',
        ],
        hint: 'Highlights success = отражает успех.',
        explanation: 'Автор акцентирует значение operating section для оценки эффективности.',
        keywords: ['критически', 'успех', 'оборотным'],
      },
      {
        promptEn:
          'The indirect method expresses net income on a cash basis by adjusting non-cash items.',
        fragmentsRu: [
          'Косвенный метод выражает чистую прибыль',
          'в денежном формате',
          'через корректировку неденежных статей.',
        ],
        hint: 'Non-cash items = неденежные статьи.',
        explanation: 'В косвенном методе важны корректировки на начисления и резервы.',
        keywords: ['косвенный', 'чистую', 'неденежных'],
      },
      {
        promptEn:
          'The direct method considers comprehensive cash flows by examining accounts related to operating activities.',
        fragmentsRu: [
          'Прямой метод учитывает полный денежный поток',
          'путем анализа счетов,',
          'связанных с операционной деятельностью.',
        ],
        hint: 'Comprehensive = полный, охватывающий все.',
        explanation: 'Прямой метод опирается на движение денег по счетам.',
        keywords: ['прямой', 'полный', 'операционной'],
      },
    ],
    context: [
      {
        contextEn:
          'Operating cash flow demonstrates inflows and outflows arising from revenues and expenses.',
        promptEn: 'Translate "arising from revenues and expenses".',
        correctRu: 'возникающие из выручки и расходов',
        optionsRu: [
          'возникающие из выручки и расходов',
          'формирующие фонд оплаты труда',
          'используемые для валютного контроля',
          'связанные только с дивидендами',
        ],
        hint: 'Arising from = возникающие из.',
        explanation: 'Фраза связывает поток с доходами и расходами основной деятельности.',
        keywords: ['revenues', 'expenses'],
      },
      {
        contextEn: 'Income statement and statement of financial position should be used.',
        promptEn: 'Best translation for "statement of financial position"?',
        correctRu: 'отчет о финансовом положении',
        optionsRu: [
          'отчет о финансовом положении',
          'план производства',
          'проспект эмиссии',
          'график отгрузки',
        ],
        hint: 'Это современное название баланса.',
        explanation: 'Statement of financial position = бухгалтерский баланс (отчет о фин. положении).',
        keywords: ['statement of financial position', 'баланс'],
      },
      {
        contextEn: 'Cash collections from receivables are inflows from operations.',
        promptEn: 'Translate "cash collections" in context.',
        correctRu: 'денежные поступления',
        optionsRu: [
          'денежные поступления',
          'кассовые остатки',
          'денежные штрафы',
          'валютные интервенции',
        ],
        hint: 'Collections = суммы, фактически полученные.',
        explanation: 'В контексте receivables это погашение задолженности клиентами.',
        keywords: ['collections', 'поступления'],
      },
      {
        contextEn: 'Operating section is crucial for firms.',
        promptEn: 'Pick best translation for "crucial".',
        correctRu: 'критически важный',
        optionsRu: ['критически важный', 'необязательный', 'случайный', 'второстепенный'],
        hint: 'Crucial = очень важный.',
        explanation: 'Слово усиливает значимость операционных потоков.',
        keywords: ['crucial', 'важный'],
      },
      {
        contextEn: 'Two methods are available for determination of operating cash flows.',
        promptEn: 'Translate "are available".',
        correctRu: 'доступны',
        optionsRu: ['доступны', 'исключены', 'отменены', 'перенесены'],
        hint: 'Фраза про наличие вариантов.',
        explanation: 'В тексте прямо сравниваются direct и indirect методы.',
        keywords: ['available', 'доступны'],
      },
      {
        contextEn: 'Working capital management reflects operational success.',
        promptEn: 'Best translation for "reflects".',
        correctRu: 'отражает',
        optionsRu: ['отражает', 'ограничивает', 'заменяет', 'исключает'],
        hint: 'Reflects = показывает/отражает.',
        explanation: 'Management of working capital выступает индикатором качества операций.',
        keywords: ['reflects', 'отражает'],
      },
    ],
    boss: [
      {
        promptEn:
          'Cash payments for inventories, taxes, interests and dividends are considered as cash outflows.',
        canonicalRu:
          'Денежные выплаты за запасы, налоги, проценты и дивиденды рассматриваются как денежные оттоки.',
        acceptableAnswers: [
          'Платежи за запасы, налоги, процентные расходы и дивиденды относятся к денежным оттокам.',
          'Выплаты по запасам, налогам, процентам и дивидендам считаются оттоком денежных средств.',
        ],
        requiredKeywords: ['выплат', 'налог', 'дивиден', 'отток'],
        keywordSynonyms: {
          выплат: ['выплат', 'платеж'],
          налог: ['налог'],
          дивиден: ['дивиден'],
          отток: ['отток', 'выбыт'],
        },
        hint: 'Сохрани перечисление четырех статей выплат.',
        explanation: 'Это классическая формулировка operating cash outflows.',
        keywords: ['outflows', 'inventories', 'taxes'],
      },
      {
        promptEn:
          'The indirect method expresses net income on cash basis by making adjustments for non-cash items.',
        canonicalRu:
          'Косвенный метод переводит чистую прибыль в денежную базу путем корректировок неденежных статей.',
        acceptableAnswers: [
          'Косвенный метод выражает чистую прибыль на денежной основе через корректировку неденежных статей.',
          'При косвенном методе чистая прибыль корректируется на неденежные элементы для получения денежного показателя.',
        ],
        requiredKeywords: ['косвен', 'чист', 'денежн', 'неденеж'],
        keywordSynonyms: {
          косвен: ['косвен'],
          чист: ['чист'],
          денежн: ['денежн'],
          неденеж: ['неденеж'],
        },
        hint: 'Должны присутствовать и «косвенный», и «неденежные статьи».',
        explanation: 'Суть indirect method - корректировка accrual-показателей.',
        keywords: ['indirect method', 'non-cash items'],
      },
      {
        promptEn:
          'This section is regarded as crucial for companies since it highlights success in operations and working capital management.',
        canonicalRu:
          'Этот раздел считается критически важным для компаний, поскольку отражает успех в операциях и управлении оборотным капиталом.',
        acceptableAnswers: [
          'Данный раздел крайне важен, так как показывает успешность операционной деятельности и управления оборотным капиталом.',
          'Раздел признается ключевым, потому что демонстрирует успех операций и менеджмента оборотного капитала.',
        ],
        requiredKeywords: ['раздел', 'критич', 'операц', 'оборотн'],
        keywordSynonyms: {
          раздел: ['раздел'],
          критич: ['критич', 'ключев', 'важн'],
          операц: ['операц'],
          оборотн: ['оборотн'],
        },
        hint: 'Передай причинную связку «since».',
        explanation: 'Фраза соединяет оценку раздела и причину этой оценки.',
        keywords: ['crucial', 'working capital'],
      },
      {
        promptEn:
          'Cash sales and collections from trade receivables constitute cash inflows from operating activities.',
        canonicalRu:
          'Продажи за наличные и поступления по торговой дебиторской задолженности формируют притоки денежных средств от операционной деятельности.',
        acceptableAnswers: [
          'Наличные продажи и инкассация дебиторской задолженности создают приток денежных средств по операционной деятельности.',
          'Денежные продажи вместе с поступлениями от дебиторов составляют операционный денежный приток.',
        ],
        requiredKeywords: ['налич', 'дебитор', 'приток', 'операц'],
        keywordSynonyms: {
          налич: ['налич', 'денежн'],
          дебитор: ['дебитор'],
          приток: ['приток', 'поступлен'],
          операц: ['операц'],
        },
        hint: 'Сфокусируйся на двух источниках притока.',
        explanation: 'Предложение перечисляет составляющие operating cash inflow.',
        keywords: ['cash sales', 'trade receivables'],
      },
    ],
  },
  cfs_financing_spine: {
    term: [
      {
        promptEn: 'external financing',
        correctRu: 'внешнее финансирование',
        distractors: ['внутренняя отчетность', 'операционный цикл', 'сезонное планирование'],
        hint: 'Это привлечение средств извне.',
        explanation: 'Внешнее финансирование включает долг и выпуск капитала.',
        keywords: ['external financing', 'внешнее'],
      },
      {
        promptEn: 'retained earnings',
        correctRu: 'нераспределенная прибыль',
        distractors: ['денежные резервы', 'страховые выплаты', 'валовая маржа'],
        hint: 'Это прибыль, оставленная в компании.',
        explanation: 'Pecking order theory ставит retained earnings на первое место.',
        keywords: ['retained earnings', 'нераспределенная прибыль'],
      },
      {
        promptEn: 'equity issue',
        correctRu: 'выпуск акций',
        distractors: ['выпуск облигаций', 'краткосрочный заем', 'кассовый разрыв'],
        hint: 'Issue equity = привлечение капитала через акции.',
        explanation: 'В теории pecking order это последний источник финансирования.',
        keywords: ['equity issue', 'акций'],
      },
      {
        promptEn: 'debt financing',
        correctRu: 'долговое финансирование',
        distractors: ['налоговое администрирование', 'валютное хеджирование', 'бюджетное субсидирование'],
        hint: 'Средства, привлеченные через займы.',
        explanation: 'Debt financing предшествует выпуску новых акций по pecking order.',
        keywords: ['debt financing', 'долговое'],
      },
      {
        promptEn: 'dividend payout',
        correctRu: 'выплата дивидендов',
        distractors: ['дивидендная отсрочка', 'накопление запасов', 'капитализация процентов'],
        hint: 'Это перечисление прибыли акционерам.',
        explanation: 'В выводах статьи своевременная выплата дивидендов выделена как важная.',
        keywords: ['dividend payout', 'дивидендов'],
      },
      {
        promptEn: 'cash proceeds from issuing shares',
        correctRu: 'денежные поступления от выпуска акций',
        distractors: [
          'денежные расходы на амортизацию',
          'поступления от продажи запасов',
          'расходы на маркетинг',
        ],
        hint: 'Proceeds = поступления.',
        explanation: 'Это один из источников cash inflow в financing activities.',
        keywords: ['proceeds', 'issuing shares'],
      },
      {
        promptEn: 'capital structure',
        correctRu: 'структура капитала',
        distractors: ['структура персонала', 'структура спроса', 'структура налогов'],
        hint: 'Соотношение собственного и заемного капитала.',
        explanation: 'Capital structure напрямую связана с финансовыми решениями фирмы.',
        keywords: ['capital structure', 'структура капитала'],
      },
      {
        promptEn: 'borrowings',
        correctRu: 'заемные средства',
        distractors: ['денежные резервы', 'капитальные затраты', 'операционные доходы'],
        hint: 'Это деньги, которые компания заняла.',
        explanation: 'Borrowings включают краткосрочные и долгосрочные займы.',
        keywords: ['borrowings', 'заемные'],
      },
    ],
    sentence: [
      {
        promptEn:
          'Pecking order theory states that firms prefer internal finance, then debt, and finally new equity.',
        fragmentsRu: [
          'Теория иерархии финансирования утверждает,',
          'что фирмы предпочитают внутренние источники, затем долг,',
          'и только потом выпуск нового капитала.',
        ],
        hint: 'Соблюдай порядок: internal -> debt -> equity.',
        explanation: 'Это центральный тезис pecking order theory.',
        keywords: ['внутренние', 'долг', 'капитала'],
      },
      {
        promptEn:
          'Internal funds incur no flotation costs and require no disclosure of proprietary information.',
        fragmentsRu: [
          'Внутренние средства не несут',
          'затрат на размещение капитала',
          'и не требуют раскрытия конфиденциальной информации.',
        ],
        hint: 'Flotation costs = затраты на размещение.',
        explanation: 'Преимущество внутренних средств - меньшая стоимость и приватность.',
        keywords: ['внутренние', 'затрат', 'раскрытия'],
      },
      {
        promptEn:
          'Information asymmetry increases the cost of external finance.',
        fragmentsRu: [
          'Информационная асимметрия',
          'повышает стоимость',
          'внешнего финансирования.',
        ],
        hint: 'Asymmetry = асимметрия информации.',
        explanation: 'Чем меньше информации у инвесторов, тем выше требуемая премия.',
        keywords: ['асимметрия', 'стоимость', 'внешнего'],
      },
      {
        promptEn:
          'Lenders may satisfy only part of loan demand to mitigate risks.',
        fragmentsRu: [
          'Кредиторы могут удовлетворять',
          'только часть спроса на займы',
          'для снижения рисков.',
        ],
        hint: 'Mitigate risks = снижать риски.',
        explanation: 'Это описание кредитного рационирования.',
        keywords: ['кредиторы', 'часть', 'рисков'],
      },
      {
        promptEn:
          'Cash proceeds from issuing shares and bonds belong to financing cash inflows.',
        fragmentsRu: [
          'Денежные поступления от выпуска акций и облигаций',
          'относятся к',
          'притокам по финансовой деятельности.',
        ],
        hint: 'Ключ: financing inflows.',
        explanation: 'Эмиссия инструментов капитала и долга формирует приток финансирования.',
        keywords: ['поступления', 'акций', 'финансовой'],
      },
      {
        promptEn:
          'Cash repayments of borrowed amounts are financing cash outflows.',
        fragmentsRu: [
          'Денежное погашение заемных сумм',
          'является',
          'денежным оттоком по финансовой деятельности.',
        ],
        hint: 'Repayment = погашение.',
        explanation: 'Возврат долга всегда уменьшает денежные средства.',
        keywords: ['погашение', 'заемных', 'оттоком'],
      },
    ],
    context: [
      {
        contextEn: 'Prospective investors ask for a premium due to information asymmetry.',
        promptEn: 'Best translation of "ask for a premium"?',
        correctRu: 'требуют премию за риск',
        optionsRu: [
          'требуют премию за риск',
          'переходят в операционный отдел',
          'получают налоговый вычет',
          'делят дивиденды поровну',
        ],
        hint: 'Премия здесь связана с риском и неопределенностью.',
        explanation: 'Инвесторы закладывают дополнительную доходность при высоком риске.',
        keywords: ['premium', 'риск'],
      },
      {
        contextEn: 'Credit rationing is done to mitigate risks and asymmetry.',
        promptEn: 'Translate "credit rationing".',
        correctRu: 'кредитное рационирование',
        optionsRu: [
          'кредитное рационирование',
          'кредитная амнистия',
          'кредитное субсидирование',
          'кредитный аудит',
        ],
        hint: 'Это ограничение объема выдаваемых кредитов.',
        explanation: 'Lenders выдают только часть желаемого объема кредита.',
        keywords: ['credit rationing', 'рационирование'],
      },
      {
        contextEn: 'Firms become less accessible to external funds.',
        promptEn: 'Choose best translation of "less accessible".',
        correctRu: 'менее доступными',
        optionsRu: ['менее доступными', 'более ликвидными', 'полностью закрытыми', 'более прибыльными'],
        hint: 'Accessible = доступный.',
        explanation: 'Фирмы испытывают ограничения при привлечении внешнего капитала.',
        keywords: ['accessible', 'доступными'],
      },
      {
        contextEn: 'The pecking order is about management preference among funding sources.',
        promptEn: 'Best translation of "management prefer"?',
        correctRu: 'менеджмент предпочитает',
        optionsRu: [
          'менеджмент предпочитает',
          'менеджмент списывает',
          'менеджмент запрещает',
          'менеджмент игнорирует',
        ],
        hint: 'Prefer = предпочитать.',
        explanation: 'Теория объясняет очередность выбора источников финансирования.',
        keywords: ['prefer', 'предпочитает'],
      },
      {
        contextEn: 'Issuing new shares is considered the last option.',
        promptEn: 'Translate "last option".',
        correctRu: 'последний вариант',
        optionsRu: ['последний вариант', 'основной вариант', 'случайный вариант', 'обязательный вариант'],
        hint: 'Last option = крайняя мера.',
        explanation: 'В теории pecking order эмиссия акций идет в конце очереди.',
        keywords: ['last option', 'последний'],
      },
      {
        contextEn: 'Financing activities include proceeds from debentures, notes and bonds.',
        promptEn: 'Best translation of "proceeds" in this sentence?',
        correctRu: 'денежные поступления',
        optionsRu: ['денежные поступления', 'производственные запасы', 'кассовые разрывы', 'налоговые издержки'],
        hint: 'Proceeds = received cash.',
        explanation: 'В контексте финансирования proceeds означает фактически полученные деньги.',
        keywords: ['proceeds', 'поступления'],
      },
    ],
    boss: [
      {
        promptEn:
          'Pecking order theory says firms use retained earnings first, debt second, and equity issuance last.',
        canonicalRu:
          'Теория иерархии финансирования утверждает, что фирмы сначала используют нераспределенную прибыль, затем долг и в последнюю очередь выпуск акций.',
        acceptableAnswers: [
          'Согласно pecking order, приоритет таков: сначала нераспределенная прибыль, потом заемные средства, и лишь затем эмиссия акций.',
          'Теория pecking order ставит на первое место retained earnings, далее debt, а выпуск equity считает последним шагом.',
        ],
        requiredKeywords: ['сначала', 'нераспредел', 'долг', 'послед'],
        keywordSynonyms: {
          сначала: ['сначала', 'вначале'],
          нераспредел: ['нераспредел', 'retained'],
          долг: ['долг', 'заем'],
          послед: ['послед', 'лишь затем'],
        },
        hint: 'Критично передать порядок источников финансирования.',
        explanation: 'Очередность источников - ядро теории pecking order.',
        keywords: ['pecking order', 'retained earnings'],
      },
      {
        promptEn:
          'Information asymmetry increases external financing cost because outside investors demand compensation for risk.',
        canonicalRu:
          'Информационная асимметрия увеличивает стоимость внешнего финансирования, поскольку внешние инвесторы требуют компенсацию за риск.',
        acceptableAnswers: [
          'Из-за информационной асимметрии внешнее финансирование дорожает, так как инвесторы извне требуют риск-премию.',
          'Асимметрия информации повышает цену внешних средств, потому что внешние инвесторы закладывают компенсацию риска.',
        ],
        requiredKeywords: ['асимметр', 'стоим', 'внешн', 'риск'],
        keywordSynonyms: {
          асимметр: ['асимметр'],
          стоим: ['стоим', 'цен'],
          внешн: ['внешн'],
          риск: ['риск', 'прем'],
        },
        hint: 'Нужна причинно-следственная конструкция «поскольку».',
        explanation: 'Смысл - инвестиционный риск повышает стоимость капитала.',
        keywords: ['information asymmetry', 'external finance'],
      },
      {
        promptEn:
          'Cash repayments of borrowings and payments to owners to redeem shares are financing cash outflows.',
        canonicalRu:
          'Денежное погашение займов и выплаты собственникам при выкупе акций относятся к оттокам по финансовой деятельности.',
        acceptableAnswers: [
          'Погашение заемных средств и выплаты владельцам за выкуп акций являются финансовыми денежными оттоками.',
          'Возврат долга и расчеты с собственниками при обратном выкупе акций формируют отток по financing activities.',
        ],
        requiredKeywords: ['погаш', 'займ', 'выкуп', 'отток'],
        keywordSynonyms: {
          погаш: ['погаш', 'возврат'],
          займ: ['займ', 'долг'],
          выкуп: ['выкуп'],
          отток: ['отток'],
        },
        hint: 'Укажи обе операции: погашение долга и выкуп акций.',
        explanation: 'Обе операции уменьшают денежные средства фирмы.',
        keywords: ['repayments', 'redeem shares'],
      },
      {
        promptEn:
          'The study found that financing cash flow has a significant effect on corporate performance (ROTA).',
        canonicalRu:
          'Исследование показало, что денежный поток от финансовой деятельности оказывает значимое влияние на прибыль за год.',
        acceptableAnswers: [
          'Было выявлено, что финансовый денежный поток существенно влияет на годовую прибыль.',
          'Авторы установили статистически значимое влияние financing cash flow на прибыль за год.',
        ],
        requiredKeywords: ['финансов', 'значим', 'влия', 'прибыл'],
        keywordSynonyms: {
          финансов: ['финансов', 'financing'],
          значим: ['значим', 'существен'],
          влия: ['влия', 'воздейств'],
          прибыл: ['прибыл'],
        },
        hint: 'Сохрани формулу «has a significant effect».',
        explanation: 'Это один из трех ключевых статистических выводов статьи.',
        keywords: ['significant effect', 'corporate performance (ROTA)'],
      },
    ],
  },
  cfs_investment_atrium: {
    term: [
      {
        promptEn: 'long-term assets',
        correctRu: 'долгосрочные активы',
        distractors: ['краткосрочные обязательства', 'операционные доходы', 'оборотные запасы'],
        hint: 'Assets with long useful life.',
        explanation: 'Long-term assets служат компании на протяжении нескольких лет.',
        keywords: ['long-term assets', 'долгосрочные'],
      },
      {
        promptEn: 'property, plant and equipment',
        correctRu: 'основные средства (имущество, оборудование)',
        distractors: ['нематериальные активы', 'краткосрочные депозиты', 'налоговые активы'],
        hint: 'Это класс активов PPE.',
        explanation: 'PPE - здания, оборудование и другие материальные долгосрочные активы.',
        keywords: ['PPE', 'основные средства'],
      },
      {
        promptEn: 'disposal of assets',
        correctRu: 'выбытие активов',
        distractors: ['оценка активов', 'хеджирование активов', 'амортизация активов'],
        hint: 'Disposal = продажа/ликвидация.',
        explanation: 'Disposal фиксирует выбытие долгосрочного актива из компании.',
        keywords: ['disposal', 'выбытие'],
      },
      {
        promptEn: 'productive facilities',
        correctRu: 'производственные объекты',
        distractors: ['маркетинговые каналы', 'складские квоты', 'финансовые нормативы'],
        hint: 'Facilities used for production.',
        explanation: 'Термин описывает активы, участвующие в производстве.',
        keywords: ['productive facilities', 'производственные'],
      },
      {
        promptEn: 'financial health',
        correctRu: 'финансовое здоровье',
        distractors: ['финансовая дисциплина', 'финансовый контроль', 'финансовая тревожность'],
        hint: 'General condition of company finances.',
        explanation: 'Financial health показывает устойчивость и способность фирмы выполнять обязательства.',
        keywords: ['financial health', 'здоровье'],
      },
      {
        promptEn: 'share prices',
        correctRu: 'цены акций',
        distractors: ['цены облигаций', 'себестоимость акций', 'стоимость долга'],
        hint: 'Price of stocks on exchange.',
        explanation: 'Share prices реагируют на качество финансовых потоков и ожиданий.',
        keywords: ['share prices', 'акций'],
      },
      {
        promptEn: 'cash flow volatility',
        correctRu: 'волатильность денежного потока',
        distractors: ['стабильность затрат', 'скорость производства', 'инфляционная премия'],
        hint: 'Volatility = изменчивость.',
        explanation: 'Высокая волатильность побуждает фирмы держать больше ликвидности.',
        keywords: ['volatility', 'волатильность'],
      },
      {
        promptEn: 'growth prospects',
        correctRu: 'перспективы роста',
        distractors: ['ограничения роста', 'производственные риски', 'сезонные скидки'],
        hint: 'Prospects = ожидания будущего.',
        explanation: 'Инвестиции обычно направлены на улучшение будущего роста.',
        keywords: ['growth prospects', 'роста'],
      },
    ],
    sentence: [
      {
        promptEn: 'The purchase and sale of long-term assets form investing cash flows.',
        fragmentsRu: [
          'Покупка и продажа долгосрочных активов',
          'формируют денежные потоки',
          'инвестиционной деятельности.',
        ],
        hint: 'Investing cash flows связаны с long-term assets.',
        explanation: 'Базовое определение инвестиционного потока из статьи.',
        keywords: ['покупка', 'продажа', 'инвестиционной'],
      },
      {
        promptEn:
          'Cash inflows are associated with sale of long-term assets, while outflows arise from purchases.',
        fragmentsRu: [
          'Притоки денежных средств связаны',
          'с продажей долгосрочных активов, а оттоки -',
          'с их покупкой.',
        ],
        hint: 'Сохрани контраст «while».',
        explanation: 'Продажа активов дает приток, покупка - отток.',
        keywords: ['притоки', 'продажей', 'покупкой'],
      },
      {
        promptEn:
          'Future investments determine growth and the chance of survival of firms.',
        fragmentsRu: [
          'Будущие инвестиции определяют',
          'рост компании и',
          'ее шансы на выживание.',
        ],
        hint: 'Chance of survival = шансы на выживание.',
        explanation: 'Инвестиционный горизонт влияет на долгосрочную устойчивость бизнеса.',
        keywords: ['инвестиции', 'рост', 'выживание'],
      },
      {
        promptEn:
          'Financial performance is a measure of how well a firm uses assets to generate revenue.',
        fragmentsRu: [
          'Финансовая результативность - это показатель того,',
          'насколько эффективно фирма использует активы',
          'для формирования выручки.',
        ],
        hint: 'How well = насколько эффективно.',
        explanation: 'Важна связь между активами и созданием дохода.',
        keywords: ['результативность', 'эффективно', 'выручки'],
      },
      {
        promptEn:
          'The term is used to compare similar firms across the same industry.',
        fragmentsRu: [
          'Этот термин используется',
          'для сравнения схожих компаний',
          'в рамках одной отрасли.',
        ],
        hint: 'Across the same industry = в одной отрасли.',
        explanation: 'Метрика удобна для отраслевого бенчмаркинга.',
        keywords: ['сравнения', 'схожих', 'отрасли'],
      },
      {
        promptEn:
          'Financial performance is an important aspect of financial risk management.',
        fragmentsRu: [
          'Финансовая результативность является',
          'важным аспектом',
          'управления финансовыми рисками.',
        ],
        hint: 'Risk management = управление рисками.',
        explanation: 'Показатели результативности связаны с контролем рисков.',
        keywords: ['важным', 'аспектом', 'рисками'],
      },
    ],
    context: [
      {
        contextEn: 'Cash outflows occur through long-term asset purchases.',
        promptEn: 'Best translation for "occur through"?',
        correctRu: 'возникают через',
        optionsRu: ['возникают через', 'компенсируются за счет', 'исчезают из-за', 'замещаются при'],
        hint: 'Occur = происходить/возникать.',
        explanation: 'Отток возникает как следствие покупки актива.',
        keywords: ['occur', 'возникают'],
      },
      {
        contextEn: 'Cash inflows may sometimes be equal to cash outflows.',
        promptEn: 'Translate "be equal to".',
        correctRu: 'быть равными',
        optionsRu: ['быть равными', 'быть выше', 'быть ниже', 'быть исключенными'],
        hint: 'Equal = равный.',
        explanation: 'В некоторых периодах инвестпотоки могут балансироваться.',
        keywords: ['equal', 'равными'],
      },
      {
        contextEn: 'Cash is regularly invested in productive assets.',
        promptEn: 'Best translation for "productive assets"?',
        correctRu: 'производительные активы',
        optionsRu: ['производительные активы', 'налоговые активы', 'резервные активы', 'социальные активы'],
        hint: 'Это активы, создающие выпуск/доход.',
        explanation: 'Инвестиции направляются в активы, генерирующие будущую отдачу.',
        keywords: ['productive', 'активы'],
      },
      {
        contextEn: 'The process measures results in monetary terms.',
        promptEn: 'Translate "monetary terms".',
        correctRu: 'в денежном выражении',
        optionsRu: ['в денежном выражении', 'в натуральном объеме', 'в трудовых часах', 'в прогнозном виде'],
        hint: 'Monetary = денежный.',
        explanation: 'Оценка результативности обычно делается в деньгах.',
        keywords: ['monetary', 'денежном'],
      },
      {
        contextEn: 'This measure can be used to compare industries in aggregation.',
        promptEn: 'Best translation for "in aggregation"?',
        correctRu: 'в агрегированном виде',
        optionsRu: ['в агрегированном виде', 'в ручном режиме', 'по кварталам', 'в отдельном филиале'],
        hint: 'Aggregation = укрупненное объединение.',
        explanation: 'Сравнение возможно не только по фирмам, но и по секторам в целом.',
        keywords: ['aggregation', 'агрегированном'],
      },
      {
        contextEn: 'Future investments determine the chance of survival.',
        promptEn: 'Choose best translation of "chance of survival".',
        correctRu: 'шанс на выживание',
        optionsRu: ['шанс на выживание', 'скорость амортизации', 'долю капитала', 'инфляционную ставку'],
        hint: 'Смысл про долгосрочную устойчивость.',
        explanation: 'Инвестиционные решения влияют на жизнеспособность бизнеса.',
        keywords: ['survival', 'выживание'],
      },
    ],
    boss: [
      {
        promptEn:
          'The purchase and sale of long-term assets form cash flows from investing activities.',
        canonicalRu:
          'Покупка и продажа долгосрочных активов формируют денежные потоки от инвестиционной деятельности.',
        acceptableAnswers: [
          'Денежные потоки инвестиционной деятельности формируются покупкой и продажей долгосрочных активов.',
          'Операции покупки и продажи долгосрочных активов образуют инвестицонный денежный поток.',
        ],
        requiredKeywords: ['покуп', 'продаж', 'долгосроч', 'инвести'],
        keywordSynonyms: {
          покуп: ['покуп'],
          продаж: ['продаж'],
          долгосроч: ['долгосроч'],
          инвести: ['инвести'],
        },
        hint: 'Сохрани фокус на long-term assets.',
        explanation: 'Это определение investing cash flow.',
        keywords: ['long-term assets', 'investing activities'],
      },
      {
        promptEn:
          'Financial performance is a subjective measure of how well a firm uses assets to generate revenues.',
        canonicalRu:
          'Финансовая результативность - это субъективная мера того, насколько хорошо фирма использует активы для генерации выручки.',
        acceptableAnswers: [
          'Финансовая результативность выступает субъективным показателем эффективности использования активов для получения дохода.',
          'Под финансовой результативностью понимают субъективную оценку того, насколько эффективно активы создают выручку.',
        ],
        requiredKeywords: ['финансов', 'субъектив', 'актив', 'выруч'],
        keywordSynonyms: {
          финансов: ['финансов'],
          субъектив: ['субъектив'],
          актив: ['актив'],
          выруч: ['выруч', 'доход'],
        },
        hint: 'Используй конструкцию «насколько хорошо».',
        explanation: 'Смысл в эффективности использования активов.',
        keywords: ['financial performance', 'revenues'],
      },
      {
        promptEn:
          'Future investments determine growth and the chance of survival, so firms invest cash in productive assets.',
        canonicalRu:
          'Будущие инвестиции определяют рост и шанс на выживание, поэтому фирмы направляют денежные средства в производительные активы.',
        acceptableAnswers: [
          'Поскольку будущие инвестиции влияют на рост и выживание, компании вкладывают деньги в производительные активы.',
          'Инвестиции будущих периодов задают рост и устойчивость, поэтому cash направляется в продуктивные активы.',
        ],
        requiredKeywords: ['будущ', 'рост', 'выжив', 'производ'],
        keywordSynonyms: {
          будущ: ['будущ'],
          рост: ['рост'],
          выжив: ['выжив', 'устойчив'],
          производ: ['производ', 'продуктив'],
        },
        hint: 'Важно передать причинную связку «so».',
        explanation: 'Предложение объединяет стратегию инвестиций и долгосрочный результат.',
        keywords: ['future investments', 'productive assets'],
      },
      {
        promptEn:
          'The study found that cash from investment activities significantly affects corporate performance (ROTA).',
        canonicalRu:
          'Исследование показало, что денежные потоки от инвестиционной деятельности значимо влияют на прибыль за год.',
        acceptableAnswers: [
          'Было выявлено значимое влияние инвестиционных денежных потоков на годовую прибыль.',
          'Авторы установили, что cash flow от investing activities существенно влияет на прибыль за год.',
        ],
        requiredKeywords: ['инвестиц', 'значим', 'влия', 'прибыл'],
        keywordSynonyms: {
          инвестиц: ['инвестиц', 'investing'],
          значим: ['значим', 'существен'],
          влия: ['влия', 'воздейств'],
          прибыл: ['прибыл'],
        },
        hint: 'Повтори структуру «significantly affects corporate performance (ROTA)».',
        explanation: 'Это третий статистически значимый вывод исследования.',
        keywords: ['significant', 'corporate performance (ROTA)'],
      },
    ],
  },
  cfs_regulator_forum: {
    term: [
      {
        promptEn: 'regression analysis',
        correctRu: 'регрессионный анализ',
        distractors: ['факторный учет', 'кассовый аудит', 'полевое интервью'],
        hint: 'Статистический метод оценки связи переменных.',
        explanation: 'Regression analysis измеряет зависимость между переменными модели.',
        keywords: ['regression analysis', 'регрессионный'],
      },
      {
        promptEn: 'goodness of fit',
        correctRu: 'качество подгонки модели',
        distractors: ['стоимость проекта', 'срок окупаемости', 'эффект масштаба'],
        hint: 'Насколько модель объясняет данные.',
        explanation: 'Goodness of fit часто оценивают через R² и F-статистику.',
        keywords: ['goodness of fit', 'подгонки'],
      },
      {
        promptEn: 'statistically significant',
        correctRu: 'статистически значимый',
        distractors: ['случайно выбранный', 'эмпирически слабый', 'графически выраженный'],
        hint: 'Значимость при проверке гипотез.',
        explanation: 'Statistically significant указывает на надежность вывода при p-value пороге.',
        keywords: ['statistically significant', 'значимый'],
      },
      {
        promptEn: 'probability value (p-value)',
        correctRu: 'значение вероятности (p-value)',
        distractors: ['стоимость вероятности', 'процентная ставка', 'весовой коэффициент'],
        hint: 'Показатель для принятия/отклонения гипотезы.',
        explanation: 'p-value сравнивают с уровнем значимости 0.05.',
        keywords: ['p-value', 'вероятности'],
      },
      {
        promptEn: 'summary of findings',
        correctRu: 'сводка результатов',
        distractors: ['график расходов', 'вводный обзор', 'дневник наблюдений'],
        hint: 'Это краткое перечисление ключевых итогов.',
        explanation: 'В финале статьи summary перечисляет подтвержденные выводы.',
        keywords: ['summary', 'results'],
      },
      {
        promptEn: 'recommendations',
        correctRu: 'рекомендации',
        distractors: ['ограничения', 'предпосылки', 'допущения'],
        hint: 'Практические советы по итогам исследования.',
        explanation: 'Recommendations связывают выводы статьи с практикой.',
        keywords: ['recommendations', 'рекомендации'],
      },
      {
        promptEn: 'tax agencies',
        correctRu: 'налоговые органы',
        distractors: ['кредитные отделы', 'биржевые брокеры', 'операционные менеджеры'],
        hint: 'Государственные структуры в сфере налогов.',
        explanation: 'В статье упоминается эффективность налоговых агентств.',
        keywords: ['tax agencies', 'налоговые'],
      },
      {
        promptEn: 'corporate performance',
        correctRu: 'корпоративная результативность',
        distractors: ['валовая рентабельность', 'операционная маржа', 'коэффициент ликвидности'],
        hint: 'В исследовании performance измеряется через ROTA.',
        explanation: 'Corporate performance в статье отражает итоговую результативность компании.',
        keywords: ['corporate performance', 'результативность'],
      },
    ],
    sentence: [
      {
        promptEn:
          'The model has R2 close to 0.97, meaning about 97% of corporate performance changes are explained by independent variables.',
        fragmentsRu: [
          'Модель имеет R2 около 0.97,',
          'что означает объяснение примерно 97% изменений корпоративной результативности',
          'независимыми переменными.',
        ],
        hint: 'Передай идею «explained by independent variables».',
        explanation: 'R² интерпретируется как доля объясненной вариации.',
        keywords: ['R2', '97%', 'независимыми'],
      },
      {
        promptEn:
          'Since F-statistic is greater than 2 and probability is below 0.05, the model is significant.',
        fragmentsRu: [
          'Поскольку F-статистика больше 2,',
          'а вероятность ниже 0.05,',
          'модель является значимой.',
        ],
        hint: 'Нужно сохранить условие и вывод.',
        explanation: 'Это базовая логика проверки статистической значимости модели.',
        keywords: ['F-статистика', '0.05', 'значимой'],
      },
      {
        promptEn:
          'The study discovered significant effects of operating, financing and investing cash flows on corporate performance (ROTA).',
        fragmentsRu: [
          'Исследование выявило значимое влияние',
          'операционных, финансовых и инвестиционных денежных потоков',
          'на корпоративную результативность (ROTA).',
        ],
        hint: 'Сохрани перечисление всех трех потоков.',
        explanation: 'Итог объединяет три подтвержденные гипотезы.',
        keywords: ['операционных', 'финансовых', 'инвестиционных'],
      },
      {
        promptEn:
          'External auditors should use cash flow ratios before forming an independent opinion on financial statements.',
        fragmentsRu: [
          'Внешним аудиторам следует применять',
          'коэффициенты денежных потоков',
          'до формирования независимого мнения по отчетности.',
        ],
        hint: 'Independent opinion = независимое мнение.',
        explanation: 'Это центральная рекомендация финального раздела статьи.',
        keywords: ['аудиторам', 'коэффициенты', 'мнения'],
      },
      {
        promptEn:
          'Regulatory authorities should encourage a result-oriented cash flow system for listed companies.',
        fragmentsRu: [
          'Регуляторы должны стимулировать',
          'результат-ориентированную систему денежных потоков',
          'в котирующихся компаниях.',
        ],
        hint: 'Result-oriented = ориентированная на результат.',
        explanation: 'В тексте перечислены IFRS, FRCN, CBN, NSE, SEC и NDIC.',
        keywords: ['регуляторы', 'систему', 'компаниях'],
      },
      {
        promptEn:
          'Government should introduce compulsory cash flow policies, including investment and dividend policy.',
        fragmentsRu: [
          'Государству следует вводить обязательные',
          'политики по денежным потокам, включая инвестиционную',
          'и дивидендную политику.',
        ],
        hint: 'Compulsory policy = обязательная политика.',
        explanation:
          'Рекомендация направлена на восстановление доверия инвесторов и кредиторов.',
        keywords: ['государству', 'обязательные', 'политику'],
      },
    ],
    context: [
      {
        contextEn: 'Jarque-Bera statistics were used to test normality of variables.',
        promptEn: 'Translate "normality" in this sentence.',
        correctRu: 'нормальность распределения',
        optionsRu: [
          'нормальность распределения',
          'прибыльность продаж',
          'стоимость капитала',
          'скорость оборачиваемости',
        ],
        hint: 'Термин из статистики.',
        explanation: 'Нормальность проверяется как предварительное допущение.',
        keywords: ['normality', 'распределения'],
      },
      {
        contextEn: 'The assumption of normality was rejected by JB statistics.',
        promptEn: 'Best translation for "was rejected"?',
        correctRu: 'было отвергнуто',
        optionsRu: ['было отвергнуто', 'было подтверждено', 'было расширено', 'было перенесено'],
        hint: 'Reject = отвергать.',
        explanation: 'Фраза описывает статистическое решение по гипотезе нормальности.',
        keywords: ['rejected', 'отвергнуто'],
      },
      {
        contextEn: 'This does not affect the goodness of data for estimation.',
        promptEn: 'Translate "goodness of data".',
        correctRu: 'пригодность данных',
        optionsRu: ['пригодность данных', 'цена данных', 'объем данных', 'скорость данных'],
        hint: 'Goodness here means adequacy/fitness.',
        explanation: 'Автор подчеркивает, что данные остаются пригодными для анализа.',
        keywords: ['goodness', 'пригодность'],
      },
      {
        contextEn: 'Probability value is less than 0.05, so the model is significant.',
        promptEn: 'Best translation of "is less than"?',
        correctRu: 'меньше чем',
        optionsRu: ['меньше чем', 'равно', 'больше чем', 'не зависит от'],
        hint: 'Сравнительная конструкция.',
        explanation: 'Значимость модели определяется порогом p-value.',
        keywords: ['less than', 'меньше'],
      },
      {
        contextEn: 'The summary of findings includes three major conclusions.',
        promptEn: 'Choose best translation for "includes".',
        correctRu: 'включает',
        optionsRu: ['включает', 'исключает', 'ограничивает', 'размывает'],
        hint: 'Includes = содержит.',
        explanation: 'Summary перечисляет ключевые подтвержденные результаты.',
        keywords: ['includes', 'включает'],
      },
      {
        contextEn: 'Recommendations were made for auditor ratios, regulatory action, and compulsory cash flow policy.',
        promptEn: 'Best translation for "were made".',
        correctRu: 'были предложены',
        optionsRu: ['были предложены', 'были отменены', 'были скрыты', 'были распределены'],
        hint: 'Формула академического стиля для рекомендаций.',
        explanation: 'Recommendations в выводах подаются как предложенные меры.',
        keywords: ['recommendations', 'предложены'],
      },
    ],
    boss: [
      {
        promptEn:
          'Since the p-value is below 0.05 and F-statistic is above 2, the regression model is statistically significant.',
        canonicalRu:
          'Поскольку p-value ниже 0.05, а F-статистика выше 2, регрессионная модель является статистически значимой.',
        acceptableAnswers: [
          'Так как значение p меньше 0.05 и F-статистика превышает 2, модель регрессии статистически значима.',
          'При p-value < 0.05 и F-статистике > 2 регрессионная модель признается статистически значимой.',
        ],
        requiredKeywords: ['p-value', '0.05', 'F-статист', 'значим'],
        keywordSynonyms: {
          'p-value': ['p-value', 'p value'],
          '0.05': ['0.05'],
          'F-статист': ['f-статист', 'f statistic'],
          значим: ['значим'],
        },
        hint: 'Нужно сохранить оба статистических порога.',
        explanation: 'Это формальное обоснование значимости модели.',
        keywords: ['p-value', 'F-statistic'],
      },
      {
        promptEn:
          'The R2 of 0.733796 implies that about 73 percent of changes in profit are explained by independent variables.',
        canonicalRu:
          'Значение R2, близкое к 0.97, означает, что около 97 процентов изменений корпоративной результативности объясняются независимыми переменными.',
        acceptableAnswers: [
          'R2 около 0.97 показывает, что примерно 97% вариации корпоративной результативности объясняется независимыми переменными.',
          'Коэффициент R2, близкий к 0.97, указывает на объяснение около 97% изменений ROTA независимыми факторами.',
        ],
        requiredKeywords: ['R2', '97', 'измен', 'независ'],
        keywordSynonyms: {
          R2: ['r2'],
          '97': ['97', '0.97'],
          измен: ['измен', 'вариац'],
          независ: ['независ'],
        },
        hint: 'Сфокусируйся на интерпретации доли объясненной вариации.',
        explanation: 'R² отражает качество подгонки модели.',
        keywords: ['R2', 'independent variables'],
      },
      {
        promptEn:
          'The study concludes that operating, financing and investing cash flows all have significant effects on corporate performance (ROTA).',
        canonicalRu:
          'Исследование делает вывод, что операционные, финансовые и инвестиционные денежные потоки все имеют значимое влияние на корпоративную результативность (ROTA).',
        acceptableAnswers: [
          'В работе сделан вывод о значимом влиянии всех трех потоков - операционного, финансового и инвестиционного - на ROTA.',
          'Авторы заключают, что operating, financing и investing cash flows значимо воздействуют на корпоративную результативность.',
        ],
        requiredKeywords: ['операц', 'финансов', 'инвестиц', 'ROTA'],
        keywordSynonyms: {
          операц: ['операц'],
          финансов: ['финансов'],
          инвестиц: ['инвестиц'],
          ROTA: ['rota', 'результатив'],
        },
        hint: 'Обязательно передай «all have significant effects».',
        explanation: 'Это синтетический итог всей эмпирической части.',
        keywords: ['concludes', 'significant effects'],
      },
      {
        promptEn:
          'The study recommends auditor use of cash flow ratios, regulatory enforcement, and compulsory cash flow policy.',
        canonicalRu:
          'Исследование рекомендует применение аудиторами коэффициентов денежных потоков, усиление регуляторного контроля и введение обязательной cash flow политики.',
        acceptableAnswers: [
          'В рекомендациях указаны три шага: использовать cash flow ratios в аудите, усилить роль регуляторов и ввести обязательную политику по денежным потокам.',
          'Работа предлагает аудиторам опираться на коэффициенты потоков, регуляторам усиливать контроль, а государству вводить обязательные cash flow политики.',
        ],
        requiredKeywords: ['аудитор', 'коэффици', 'регулятор', 'полит'],
        keywordSynonyms: {
          аудитор: ['аудитор', 'внешн'],
          коэффици: ['коэффици', 'ratio'],
          регулятор: ['регулятор', 'ifrs', 'frcn', 'cbn', 'nse', 'sec', 'ndic'],
          полит: ['полит', 'policy'],
        },
        hint: 'Сохрани все три пункта рекомендаций.',
        explanation: 'Финальный практический блок статьи.',
        keywords: ['recommendations', 'cash flow ratios', 'regulatory'],
      },
    ],
  },
};

const zoneIds: ZoneId[] = [
  'cfs_abstract_delta',
  'cfs_liquidity_corridor',
  'cfs_financing_spine',
  'cfs_investment_atrium',
  'cfs_regulator_forum',
];

export const challenges: Challenge[] = zoneIds.flatMap((zoneId) => {
  const seeds = zoneSeeds[zoneId];
  return [
    ...buildTermChallenges(zoneId, seeds.term),
    ...buildSentenceChallenges(zoneId, seeds.sentence),
    ...buildContextChallenges(zoneId, seeds.context),
    ...buildBossChallenges(zoneId, seeds.boss),
  ];
});

export const challengeById: Record<string, Challenge> = challenges.reduce(
  (accumulator, challenge) => {
    accumulator[challenge.id] = challenge;
    return accumulator;
  },
  {} as Record<string, Challenge>,
);

export const totalChallengeCount = challenges.length;
