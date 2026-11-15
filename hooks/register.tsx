import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// FreeTicket at night: navy-violet ink surfaces, yellow/teal/purple brand roles. A dark scene, so dark only.
const { theme, problems } = makeColors({
  label: 'FreeTicket',
  only: 'dark',
  roles: { accent: '#ffd102', danger: '#e5484d', success: '#1ebbb2', warning: '#f08c00', pro: '#8505dc' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0e0c1c',
        'surface-1': '#16142a',
        'surface-2': '#1d1a33',
        'surface-3': '#221f3a',
        'text-primary': '#f3f1fa',
        'text-secondary': '#cdc8de',
        'text-muted': '#a39dba',
      },
    },
  },
})

// Pixel art, snowy night: a quiet sky over a band of hills and pines at the foot, a little ticket booth
// with its light on and the orange critter selling tickets beside it. The sky is plain gradient with
// a few dim stars and slow snow, so nothing busy sits behind the words.
const PAL: Record<string, string> = {
  o: '#e07a4f', d: '#b85c36', k: '#0e0c1c', w: '#e9e6f5', y: '#ffd102', t: '#1ebbb2', p: '#8505dc',
  g: '#2a2545', b: '#3b335e', r: '#6b4a8a',
}

function px(map: string[], x0: number, y0: number, s: number): string {
  let out = ''
  map.forEach((row, j) => {
    ;[...row].forEach((c, i) => {
      const fill = PAL[c]
      if (fill !== undefined) {
        out += `<rect x="${x0 + i * s}" y="${y0 + j * s}" width="${s}" height="${s}" fill="${fill}"/>`
      }
    })
  })
  return out
}

let seed = 11
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

// A stepped pixel pine: three tiers, a snow cap on each, a lit left edge.
function pine(cx: number, by: number, s: number, dark: string, lit: string, cap: string): string {
  const tierH = 5
  const tiers = 3
  const top = by - (tiers * tierH + 2) * s
  let out = ''
  for (let t = 0; t < tiers; t++) {
    for (let j = 0; j < tierH; j++) {
      const half = j + t
      const y = top + (t * tierH + j) * s
      const x = cx - half * s - s / 2
      const w = (half * 2 + 1) * s
      out += `<rect x="${x}" y="${y}" width="${w}" height="${s}" fill="${dark}"/>`
      out += `<rect x="${x}" y="${y}" width="${Math.max(s, Math.floor(half / 2) * s)}" height="${s}" fill="${lit}"/>`
      if (j === 0) {
        out += `<rect x="${x}" y="${y}" width="${w}" height="${s}" fill="${cap}"/>`
      }
    }
  }
  out += `<rect x="${cx - s / 2}" y="${top + tiers * tierH * s}" width="${s}" height="${2 * s}" fill="#1a1530"/>`
  return out
}

let farPines = ''
for (let i = 0; i < 30; i++) {
  const x = i < 15 ? 20 + rnd() * 600 : 980 + rnd() * 620
  farPines += pine(Math.round(x / 4) * 4, 752 + Math.round(rnd() * 3) * 4, 4, '#3d3666', '#4a4378', '#8f88b8')
}
const T = ['#145c5a', '#1b7a74', '#cfe9e6'] as const
const T2 = ['#11504e', '#187069', '#cfe9e6'] as const
const nearPines = [
  pine(250, 930, 6, ...T2), pine(150, 990, 9, ...T), pine(330, 1000, 8, ...T), pine(40, 1040, 11, ...T2),
  pine(1340, 930, 6, ...T2), pine(1440, 1000, 9, ...T), pine(1270, 1010, 8, ...T2), pine(1560, 1040, 11, ...T),
].join('')

let stars = ''
for (let i = 0; i < 45; i++) {
  const x = Math.floor(rnd() * 400) * 4
  const y = Math.floor(rnd() * 140) * 4
  stars += `<rect class="st" style="animation-delay:-${(rnd() * 5).toFixed(1)}s" x="${x}" y="${y}" width="3" height="3" fill="#cdc8de"/>`
}

let snow = ''
for (let i = 0; i < 55; i++) {
  const x = Math.floor(rnd() * 1600)
  const sz = rnd() > 0.75 ? 4 : 3
  const dur = (14 + rnd() * 12).toFixed(1)
  snow += `<rect class="sn" style="animation-duration:${dur}s;animation-delay:-${(rnd() * 26).toFixed(1)}s" x="${x}" y="-20" width="${sz}" height="${sz}" fill="#e9e6f5"/>`
}

// Ticket booth: striped awning, a yellow FREETICKET sign, a lit window.
const BOOTH = [
  '....yyyyyyyyyyyy....',
  '....ykkkykkykkyy....',
  '....yyyyyyyyyyyy....',
  '..wpwpwpwpwpwpwpwp..',
  '..pwpwpwpwpwpwpwpw..',
  '...gggggggggggggg...',
  '...gyyyyyyyyyyyyg...',
  '...gyyyyyyyyyyyyg...',
  '...gyyyyyyyyyyyyg...',
  '...ggggggggggggggg..',
  '...gbbbbbbbbbbbbg...',
  '...gbbbbbbbbbbbbg...',
  '...gbbbbbbbbbbbbg...',
  '...gggggggggggggg...',
]
const CRITTER = [
  '..oooooooo..',
  '..okooooko..',
  'oooooooooooo',
  '..oooooooo..',
  '..dddddddd..',
  '..o.o..o.o..',
]
const TICKET = ['yyyyy', 'ykkyy', 'yyyyy']

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#0e0c1c"/><stop offset=".45" stop-color="#16132e"/>
<stop offset=".7" stop-color="#2a1f45"/><stop offset=".78" stop-color="#3e2550"/>
</linearGradient>
<radialGradient id="glow" cx=".5" cy=".78" r=".45"><stop offset="0" stop-color="#8505dc" stop-opacity=".18"/><stop offset="1" stop-color="#8505dc" stop-opacity="0"/></radialGradient>
</defs>
<style>
.st{animation:tw 5s steps(2) infinite}
.sn{animation:fall 20s linear infinite;opacity:.45}
.bob{animation:bob 1.2s steps(1) infinite}
.win{animation:flick 7s steps(1) infinite}
.tk{animation:up 5s linear infinite;opacity:0}
@keyframes tw{0%,100%{opacity:.2}50%{opacity:.55}}
@keyframes fall{0%{transform:translate(0,0)}50%{transform:translate(18px,520px)}100%{transform:translate(0,1060px)}}
@keyframes bob{0%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes flick{0%,96%{opacity:1}97%,100%{opacity:.75}}
@keyframes up{0%{transform:translate(0,0);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translate(-10px,-60px);opacity:0}}
@media (prefers-reduced-motion:reduce){.st,.sn,.bob,.win,.tk{animation:none}.sn{display:none}}
</style>
<rect width="1600" height="1000" fill="url(#sky)"/>
<rect width="1600" height="1000" fill="url(#glow)"/>
<g>${stars}</g>
<g>${farPines}</g>
<path d="M0 770 Q 400 735 800 765 T 1600 760 V1000 H0Z" fill="#3b335e"/>
<path d="M0 820 Q 500 780 1000 815 T 1600 805 V1000 H0Z" fill="#453d6c"/>
<path d="M0 900 Q 600 860 1200 905 T 1600 890 V1000 H0Z" fill="#4c4475"/>
<g>${nearPines}</g>
<g>${px(BOOTH, 1110, 812, 4)}</g>
<g class="win"><rect x="1126" y="852" width="48" height="12" fill="#ffd102" opacity=".35"/></g>
<rect x="1110" y="868" width="88" height="6" fill="#ffd102" opacity=".08"/>
<g class="tk">${px(TICKET, 1110, 830, 3)}</g>
<g class="bob">${px(CRITTER, 1200, 846, 4)}</g>
<g>${snow}</g>
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'freeticket-snow', glass: false },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    await $.command.register({ name: 'freeticket-theme', description: 'Re-apply the FreeTicket look and say whether this app draws it' })
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('command.run', { command: 'freeticket-theme' }, async $ => {
    const set = await $.theme.set(LOOK)

    return { text: set.isDrawn ? 'FreeTicket look applied: this app draws it.' : `Not drawn here: ${set.reason}` }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Pixel art: a snowy night with pines and a lit FreeTicket booth, a little critter selling tickets beside it" isInteractive />
  })
}
