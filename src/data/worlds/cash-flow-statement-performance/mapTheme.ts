import { WorldMapTheme } from '../../../types/game';

export const mapTheme: WorldMapTheme = {
  title: 'Карта мира: Cash Flow Statement Frontier',
  subtitle:
    'Исследовательская карта статьи 2007-2011: ROTA, OPCF, INVCF, FINCF и блок регуляторных рекомендаций.',
  layoutByZoneId: {
    cfs_abstract_delta: {
      x: 13,
      y: 72,
      landmark: 'Delta Abstract',
      icon: 'harbor',
      elevation: 2,
      districtTone: '#7ebfd0',
    },
    cfs_liquidity_corridor: {
      x: 34,
      y: 55,
      landmark: 'Liquidity Corridor',
      icon: 'factory',
      elevation: 5,
      districtTone: '#6fb49b',
    },
    cfs_financing_spine: {
      x: 54,
      y: 37,
      landmark: 'Financing Spine',
      icon: 'bank',
      elevation: 7,
      districtTone: '#8ac0d7',
    },
    cfs_investment_atrium: {
      x: 74,
      y: 57,
      landmark: 'Investment Atrium',
      icon: 'tower',
      elevation: 6,
      districtTone: '#9eb3d6',
    },
    cfs_regulator_forum: {
      x: 90,
      y: 27,
      landmark: 'Regulator Forum',
      icon: 'hall',
      elevation: 8,
      districtTone: '#b4b6d0',
    },
  },
  environment: {
    landmasses: [
      'M52 422 C126 352 248 346 323 401 C367 434 372 496 338 556 C298 618 200 640 117 611 C38 585 15 498 52 422 Z',
      'M296 262 C378 196 503 182 594 239 C662 281 690 365 652 436 C609 515 506 553 404 532 C316 514 254 444 258 352 C261 309 274 282 296 262 Z',
      'M610 146 C704 92 826 109 906 183 C958 231 970 313 931 383 C886 462 792 493 692 474 C594 454 529 385 532 298 C535 235 566 177 610 146 Z',
    ],
    river:
      'M0 274 C112 233 236 274 336 246 C456 212 527 122 633 138 C754 157 842 265 1000 240',
    coastline:
      'M28 572 C130 552 210 587 287 566 C374 542 442 587 515 568 C594 548 676 586 751 566 C829 544 892 578 972 558',
    routeShadow:
      'M122 488 C198 451 261 403 329 352 C405 295 475 242 548 214 C632 181 709 221 772 298 C838 377 873 304 904 176',
    routeMain:
      'M122 488 C198 451 261 403 329 352 C405 295 475 242 548 214 C632 181 709 221 772 298 C838 377 873 304 904 176',
    routeHighlight:
      'M112 515 C206 484 278 431 350 383 C431 330 506 292 575 279 C657 262 728 298 787 346 C849 396 886 342 914 236',
  },
};
