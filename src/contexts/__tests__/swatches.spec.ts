import { Accessor, createRoot } from 'solid-js';
import {
  createGradients,
  createHSL,
  createSwatchesStore,
  hslToRawString,
  hslToString,
  SwatchesContextValue,
} from '../swatches';

const nextTick = (ms = 0) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

it('should return hsl with known restriction', () => {
  const res = createHSL();

  expect(res.h).toBeLessThanOrEqual(360);
  expect(res.s).toBeLessThanOrEqual(90);
  expect(res.l).toBeLessThanOrEqual(60);
  expect(res.s).toBeGreaterThanOrEqual(30);
  expect(res.l).toBeGreaterThanOrEqual(40);
});

it('should return 0 for every property', () => {
  const res = createHSL(0, 0, 0);

  expect(Object.values(res).every((v) => v === 0)).toBeTruthy();
});

it('should return correct string', () => {
  const res = hslToString({ h: 1, s: 1, l: 1 });

  expect(res).toBe('hsl(1 1% 1%)');
});

it('should return correct string without hsl()', () => {
  const res = hslToRawString({ h: 1, s: 1, l: 1 });

  expect(res).toBe('1 1% 1%');
});

describe('hsl store', () => {
  type Root = { dispose: () => void; context: SwatchesContextValue };

  let root: Root;

  beforeEach(() => {
    root = createRoot((dispose) => {
      return { dispose, context: createSwatchesStore() };
    });
  });

  afterEach(() => {
    root.dispose();
  });

  it('should update current and session', async () => {
    const { context } = root;
    const [state, { boot }] = context;

    boot({ h: 1, s: 0, l: 0 });
    await nextTick();

    expect(state.current.h).toBe(1);
    expect(state.session.h).toBe(1);
  });

  it('should update current only', async () => {
    const { context } = root;
    const [state, { boot, updateCurrent }] = context;

    boot({ h: 1, s: 0, l: 0 });
    await nextTick();
    updateCurrent({ h: 2 });
    await nextTick();

    expect(state.current.h).toBe(2);
    expect(state.session.h).toBe(1);
  });

  it('should update current only', async () => {
    const { context } = root;
    const [state, { boot, updateCurrent, resumeFromLargeScreen }] =
      context;

    boot({ h: 1, s: 0, l: 0 });
    await nextTick();
    updateCurrent({ h: 2 });
    await nextTick();
    resumeFromLargeScreen();
    await nextTick();

    expect(state.current.h).toBe(2);
    expect(state.session.h).toBe(2);
  });
});

describe('gradients', () => {
  type Root = { dispose: () => void; context: SwatchesContextValue };

  let root: Root;

  beforeAll(() => {
    root = createRoot((dispose) => {
      const context = createSwatchesStore();
      return { context, dispose };
    });
  });

  afterAll(() => {
    root.dispose();
  });

  it('should return correct gradients', async () => {
    const [_, { updateCurrent }] = root.context;
    const { dispose, gradients } = createRoot((dispose) => {
      const gradients = createGradients('h', root.context);
      return { dispose, gradients };
    });

    updateCurrent({ h: 0, s: 1, l: 1 });
    await nextTick();
    const grad = gradients();
    expect(grad).toMatchInlineSnapshot(
      '"hsl(0 1% 1%), hsl(1 1% 1%), hsl(2 1% 1%), hsl(3 1% 1%), hsl(4 1% 1%), hsl(5 1% 1%), hsl(6 1% 1%), hsl(7 1% 1%), hsl(8 1% 1%), hsl(9 1% 1%), hsl(10 1% 1%), hsl(11 1% 1%), hsl(12 1% 1%), hsl(13 1% 1%), hsl(14 1% 1%), hsl(15 1% 1%), hsl(16 1% 1%), hsl(17 1% 1%), hsl(18 1% 1%), hsl(19 1% 1%), hsl(20 1% 1%), hsl(21 1% 1%), hsl(22 1% 1%), hsl(23 1% 1%), hsl(24 1% 1%), hsl(25 1% 1%), hsl(26 1% 1%), hsl(27 1% 1%), hsl(28 1% 1%), hsl(29 1% 1%), hsl(30 1% 1%), hsl(31 1% 1%), hsl(32 1% 1%), hsl(33 1% 1%), hsl(34 1% 1%), hsl(35 1% 1%), hsl(36 1% 1%), hsl(37 1% 1%), hsl(38 1% 1%), hsl(39 1% 1%), hsl(40 1% 1%), hsl(41 1% 1%), hsl(42 1% 1%), hsl(43 1% 1%), hsl(44 1% 1%), hsl(45 1% 1%), hsl(46 1% 1%), hsl(47 1% 1%), hsl(48 1% 1%), hsl(49 1% 1%), hsl(50 1% 1%), hsl(51 1% 1%), hsl(52 1% 1%), hsl(53 1% 1%), hsl(54 1% 1%), hsl(55 1% 1%), hsl(56 1% 1%), hsl(57 1% 1%), hsl(58 1% 1%), hsl(59 1% 1%), hsl(60 1% 1%), hsl(61 1% 1%), hsl(62 1% 1%), hsl(63 1% 1%), hsl(64 1% 1%), hsl(65 1% 1%), hsl(66 1% 1%), hsl(67 1% 1%), hsl(68 1% 1%), hsl(69 1% 1%), hsl(70 1% 1%), hsl(71 1% 1%), hsl(72 1% 1%), hsl(73 1% 1%), hsl(74 1% 1%), hsl(75 1% 1%), hsl(76 1% 1%), hsl(77 1% 1%), hsl(78 1% 1%), hsl(79 1% 1%), hsl(80 1% 1%), hsl(81 1% 1%), hsl(82 1% 1%), hsl(83 1% 1%), hsl(84 1% 1%), hsl(85 1% 1%), hsl(86 1% 1%), hsl(87 1% 1%), hsl(88 1% 1%), hsl(89 1% 1%), hsl(90 1% 1%), hsl(91 1% 1%), hsl(92 1% 1%), hsl(93 1% 1%), hsl(94 1% 1%), hsl(95 1% 1%), hsl(96 1% 1%), hsl(97 1% 1%), hsl(98 1% 1%), hsl(99 1% 1%), hsl(100 1% 1%), hsl(101 1% 1%), hsl(102 1% 1%), hsl(103 1% 1%), hsl(104 1% 1%), hsl(105 1% 1%), hsl(106 1% 1%), hsl(107 1% 1%), hsl(108 1% 1%), hsl(109 1% 1%), hsl(110 1% 1%), hsl(111 1% 1%), hsl(112 1% 1%), hsl(113 1% 1%), hsl(114 1% 1%), hsl(115 1% 1%), hsl(116 1% 1%), hsl(117 1% 1%), hsl(118 1% 1%), hsl(119 1% 1%), hsl(120 1% 1%), hsl(121 1% 1%), hsl(122 1% 1%), hsl(123 1% 1%), hsl(124 1% 1%), hsl(125 1% 1%), hsl(126 1% 1%), hsl(127 1% 1%), hsl(128 1% 1%), hsl(129 1% 1%), hsl(130 1% 1%), hsl(131 1% 1%), hsl(132 1% 1%), hsl(133 1% 1%), hsl(134 1% 1%), hsl(135 1% 1%), hsl(136 1% 1%), hsl(137 1% 1%), hsl(138 1% 1%), hsl(139 1% 1%), hsl(140 1% 1%), hsl(141 1% 1%), hsl(142 1% 1%), hsl(143 1% 1%), hsl(144 1% 1%), hsl(145 1% 1%), hsl(146 1% 1%), hsl(147 1% 1%), hsl(148 1% 1%), hsl(149 1% 1%), hsl(150 1% 1%), hsl(151 1% 1%), hsl(152 1% 1%), hsl(153 1% 1%), hsl(154 1% 1%), hsl(155 1% 1%), hsl(156 1% 1%), hsl(157 1% 1%), hsl(158 1% 1%), hsl(159 1% 1%), hsl(160 1% 1%), hsl(161 1% 1%), hsl(162 1% 1%), hsl(163 1% 1%), hsl(164 1% 1%), hsl(165 1% 1%), hsl(166 1% 1%), hsl(167 1% 1%), hsl(168 1% 1%), hsl(169 1% 1%), hsl(170 1% 1%), hsl(171 1% 1%), hsl(172 1% 1%), hsl(173 1% 1%), hsl(174 1% 1%), hsl(175 1% 1%), hsl(176 1% 1%), hsl(177 1% 1%), hsl(178 1% 1%), hsl(179 1% 1%), hsl(180 1% 1%), hsl(181 1% 1%), hsl(182 1% 1%), hsl(183 1% 1%), hsl(184 1% 1%), hsl(185 1% 1%), hsl(186 1% 1%), hsl(187 1% 1%), hsl(188 1% 1%), hsl(189 1% 1%), hsl(190 1% 1%), hsl(191 1% 1%), hsl(192 1% 1%), hsl(193 1% 1%), hsl(194 1% 1%), hsl(195 1% 1%), hsl(196 1% 1%), hsl(197 1% 1%), hsl(198 1% 1%), hsl(199 1% 1%), hsl(200 1% 1%), hsl(201 1% 1%), hsl(202 1% 1%), hsl(203 1% 1%), hsl(204 1% 1%), hsl(205 1% 1%), hsl(206 1% 1%), hsl(207 1% 1%), hsl(208 1% 1%), hsl(209 1% 1%), hsl(210 1% 1%), hsl(211 1% 1%), hsl(212 1% 1%), hsl(213 1% 1%), hsl(214 1% 1%), hsl(215 1% 1%), hsl(216 1% 1%), hsl(217 1% 1%), hsl(218 1% 1%), hsl(219 1% 1%), hsl(220 1% 1%), hsl(221 1% 1%), hsl(222 1% 1%), hsl(223 1% 1%), hsl(224 1% 1%), hsl(225 1% 1%), hsl(226 1% 1%), hsl(227 1% 1%), hsl(228 1% 1%), hsl(229 1% 1%), hsl(230 1% 1%), hsl(231 1% 1%), hsl(232 1% 1%), hsl(233 1% 1%), hsl(234 1% 1%), hsl(235 1% 1%), hsl(236 1% 1%), hsl(237 1% 1%), hsl(238 1% 1%), hsl(239 1% 1%), hsl(240 1% 1%), hsl(241 1% 1%), hsl(242 1% 1%), hsl(243 1% 1%), hsl(244 1% 1%), hsl(245 1% 1%), hsl(246 1% 1%), hsl(247 1% 1%), hsl(248 1% 1%), hsl(249 1% 1%), hsl(250 1% 1%), hsl(251 1% 1%), hsl(252 1% 1%), hsl(253 1% 1%), hsl(254 1% 1%), hsl(255 1% 1%), hsl(256 1% 1%), hsl(257 1% 1%), hsl(258 1% 1%), hsl(259 1% 1%), hsl(260 1% 1%), hsl(261 1% 1%), hsl(262 1% 1%), hsl(263 1% 1%), hsl(264 1% 1%), hsl(265 1% 1%), hsl(266 1% 1%), hsl(267 1% 1%), hsl(268 1% 1%), hsl(269 1% 1%), hsl(270 1% 1%), hsl(271 1% 1%), hsl(272 1% 1%), hsl(273 1% 1%), hsl(274 1% 1%), hsl(275 1% 1%), hsl(276 1% 1%), hsl(277 1% 1%), hsl(278 1% 1%), hsl(279 1% 1%), hsl(280 1% 1%), hsl(281 1% 1%), hsl(282 1% 1%), hsl(283 1% 1%), hsl(284 1% 1%), hsl(285 1% 1%), hsl(286 1% 1%), hsl(287 1% 1%), hsl(288 1% 1%), hsl(289 1% 1%), hsl(290 1% 1%), hsl(291 1% 1%), hsl(292 1% 1%), hsl(293 1% 1%), hsl(294 1% 1%), hsl(295 1% 1%), hsl(296 1% 1%), hsl(297 1% 1%), hsl(298 1% 1%), hsl(299 1% 1%), hsl(300 1% 1%), hsl(301 1% 1%), hsl(302 1% 1%), hsl(303 1% 1%), hsl(304 1% 1%), hsl(305 1% 1%), hsl(306 1% 1%), hsl(307 1% 1%), hsl(308 1% 1%), hsl(309 1% 1%), hsl(310 1% 1%), hsl(311 1% 1%), hsl(312 1% 1%), hsl(313 1% 1%), hsl(314 1% 1%), hsl(315 1% 1%), hsl(316 1% 1%), hsl(317 1% 1%), hsl(318 1% 1%), hsl(319 1% 1%), hsl(320 1% 1%), hsl(321 1% 1%), hsl(322 1% 1%), hsl(323 1% 1%), hsl(324 1% 1%), hsl(325 1% 1%), hsl(326 1% 1%), hsl(327 1% 1%), hsl(328 1% 1%), hsl(329 1% 1%), hsl(330 1% 1%), hsl(331 1% 1%), hsl(332 1% 1%), hsl(333 1% 1%), hsl(334 1% 1%), hsl(335 1% 1%), hsl(336 1% 1%), hsl(337 1% 1%), hsl(338 1% 1%), hsl(339 1% 1%), hsl(340 1% 1%), hsl(341 1% 1%), hsl(342 1% 1%), hsl(343 1% 1%), hsl(344 1% 1%), hsl(345 1% 1%), hsl(346 1% 1%), hsl(347 1% 1%), hsl(348 1% 1%), hsl(349 1% 1%), hsl(350 1% 1%), hsl(351 1% 1%), hsl(352 1% 1%), hsl(353 1% 1%), hsl(354 1% 1%), hsl(355 1% 1%), hsl(356 1% 1%), hsl(357 1% 1%), hsl(358 1% 1%), hsl(359 1% 1%), hsl(360 1% 1%)"'
    );
    dispose();
  });
});
