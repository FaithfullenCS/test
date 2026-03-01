import { WorldMapTheme } from '../../../types/game';

export const mapTheme: WorldMapTheme = {
  title: 'Карта мира: Cash Flow Quest Nigeria',
  subtitle:
    'Городская карта финансовых районов: cash flow, корпоративная результативность и практические рекомендации.',
  layoutByZoneId: {
    ng_gate_of_flow: {
      x: 10,
      y: 76,
      landmark: 'Бухта Истоков',
      icon: 'harbor',
      elevation: 2,
      districtTone: '#6fb1c0',
    },
    ng_operations_quarter: {
      x: 30,
      y: 57,
      landmark: 'Квартал Операций',
      icon: 'factory',
      elevation: 5,
      districtTone: '#75b78f',
    },
    ng_finance_harbor: {
      x: 50,
      y: 34,
      landmark: 'Финансовая Гавань',
      icon: 'bank',
      elevation: 7,
      districtTone: '#7ac2d9',
    },
    ng_investment_factory: {
      x: 72,
      y: 50,
      landmark: 'Инвест-Верфь',
      icon: 'tower',
      elevation: 6,
      districtTone: '#95b4d6',
    },
    ng_council_hall: {
      x: 89,
      y: 23,
      landmark: 'Мыс Совета',
      icon: 'hall',
      elevation: 8,
      districtTone: '#a9b6ce',
    },
  },
  environment: {
    landmasses: [
      'M38 388 C111 326 224 326 296 380 C336 410 350 468 315 522 C279 577 190 607 112 583 C38 560 6 474 38 388 Z',
      'M312 238 C383 178 503 164 590 218 C652 257 681 334 647 399 C608 475 514 513 418 498 C328 483 264 408 270 323 C274 284 287 257 312 238 Z',
      'M620 134 C704 88 818 104 893 170 C946 217 958 297 918 362 C874 432 781 464 686 443 C596 423 530 356 534 273 C536 210 571 157 620 134 Z',
    ],
    river:
      'M0 240 C120 215 220 247 320 232 C430 216 504 144 612 156 C730 170 811 255 1000 218',
    coastline:
      'M24 556 C126 534 193 565 268 544 C352 521 411 564 477 546 C560 524 628 562 707 546 C787 530 859 556 964 536',
    routeShadow:
      'M100 470 C172 439 240 404 298 356 C369 296 431 236 492 212 C580 185 651 230 720 309 C791 382 850 251 890 145',
    routeMain:
      'M100 470 C172 439 240 404 298 356 C369 296 431 236 492 212 C580 185 651 230 720 309 C791 382 850 251 890 145',
    routeHighlight:
      'M92 500 C178 475 246 425 306 374 C382 309 458 280 526 269 C610 256 668 299 726 343 C790 392 845 296 894 203',
  },
};
