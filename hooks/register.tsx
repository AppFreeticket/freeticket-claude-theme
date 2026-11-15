import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// FreeTicket: cartel ink + poster paper, yellow/teal/purple brand roles.
const { theme, problems } = makeColors({
  label: 'FreeTicket',
  roles: { accent: '#ffd102', danger: '#e5484d', success: '#1ebbb2', warning: '#f08c00', pro: '#8505dc' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#efebe0',
        'surface-1': '#f5f2ea',
        'surface-2': '#fbf9f4',
        'text-primary': '#070707',
        'text-secondary': '#33312b',
        'text-muted': '#5c5a52',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#070707',
        'surface-1': '#111110',
        'surface-2': '#191917',
        'surface-3': '#1f1f1c',
        'text-primary': '#f5f2ea',
        'text-secondary': '#cfcbc0',
        'text-muted': '#a8a498',
      },
    },
  },
})

// Pixel art: a little orange critter typing on a laptop open on FreeTicket, tickets popping out,
// a marquee sign top-left and twinkling stars. Subjects hug the sides; the middle stays clear for words.
const PAL: Record<string, string> = {
  o: '#e07a4f', d: '#b85c36', k: '#070707', w: '#f5f2ea', y: '#ffd102', t: '#1ebbb2', p: '#8505dc', g: '#3a3a36',
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

const CRITTER = [
  '...oooooooooo...',
  '...oooooooooo...',
  '...ookooookoo...',
  'oooooooooooooooo',
  'oooooooooooooooo',
  '...oooooooooo...',
  '...dddddddddd...',
  '...o.o....o.o...',
  '...o.o....o.o...',
]
const LIDS = ['......o....o....']
const LAPTOP = [
  '.wwwwwwwwwwwwww.',
  '.wyyyyyyyyyyyyw.',
  '.wykkkykkkkkyyw.',
  '.wykyyyyykyyyyw.',
  '.wykkyyyykyyyyw.',
  '.wykyyyyykyyyyw.',
  '.wyyyyyyyyyyyyw.',
  '.wwwwwwwwwwwwww.',
  'gggggggggggggggg',
]
const TICKET = ['yyyyyyy', 'ykkyyyy', '.yyyyy.', 'ykkkyyy', 'yyyyyyy']
const TICKET_T = ['ttttttt', 'tkktttt', '.ttttt.', 'tkkkttt', 'ttttttt']
const TICKET_P = ['ppppppp', 'pwwpppp', '.ppppp.', 'pwwwppp', 'ppppppp']

// Deterministic stars.
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
let stars = ''
for (let i = 0; i < 70; i++) {
  const x = Math.floor(rnd() * 400) * 4
  const y = Math.floor(rnd() * 160) * 4
  const s = rnd() > 0.8 ? 8 : 4
  stars += `<rect class="st" style="animation-delay:-${(rnd() * 4).toFixed(1)}s" x="${x}" y="${y}" width="${s}" height="${s}" fill="#f5f2ea"/>`
}

let bulbs = ''
for (let i = 0; i < 14; i++) {
  bulbs += `<rect class="${i % 2 ? 'b1' : 'b2'}" x="${22 + i * 12}" y="22" width="4" height="4" fill="#ffd102"/>`
  bulbs += `<rect class="${i % 2 ? 'b2' : 'b1'}" x="${22 + i * 12}" y="78" width="4" height="4" fill="#ffd102"/>`
}

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">
<style>
.st{animation:tw 4s steps(2) infinite}
.b1{animation:bl 1.2s steps(1) infinite}.b2{animation:bl 1.2s steps(1) infinite -.6s}
.bob{animation:bob 1s steps(1) infinite}
.lid{opacity:0;animation:blink 5s steps(1) infinite}
.tk{animation:up 6s linear infinite;opacity:0}
.tk2{animation-delay:-2s}.tk3{animation-delay:-4s}
@keyframes tw{0%,100%{opacity:.25}50%{opacity:.8}}
@keyframes bl{0%{opacity:1}50%{opacity:.15}}
@keyframes bob{0%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes blink{0%,94%{opacity:0}95%,100%{opacity:1}}
@keyframes up{0%{transform:translate(0,0);opacity:0}10%{opacity:1}80%{opacity:1}100%{transform:translate(-24px,-120px);opacity:0}}
@media (prefers-reduced-motion:reduce){.st,.b1,.b2,.bob,.lid,.tk{animation:none}.tk{opacity:1}}
</style>
<g opacity=".55">${stars}</g>
<svg width="1600" height="1000" viewBox="0 0 400 300" preserveAspectRatio="xMinYMin meet">
<rect x="14" y="14" width="180" height="76" fill="#070707" stroke="#ffd102" stroke-width="4"/>
${bulbs}
<text x="104" y="62" text-anchor="middle" font-family="Courier New,monospace" font-weight="900" font-size="20" fill="#ffd102" letter-spacing="1">FREETICKET</text>
<text x="104" y="76" text-anchor="middle" font-family="Courier New,monospace" font-weight="700" font-size="8" fill="#1ebbb2">★ ENTRADAS ★</text>
<rect x="44" y="90" width="4" height="40" fill="#3a3a36"/><rect x="160" y="90" width="4" height="40" fill="#3a3a36"/>
</svg>
<svg width="1600" height="1000" viewBox="0 0 400 300" preserveAspectRatio="xMaxYMid meet">
<g class="tk">${px(TICKET, 344, 150, 3)}</g>
<g class="tk tk2">${px(TICKET_T, 352, 150, 3)}</g>
<g class="tk tk3">${px(TICKET_P, 336, 150, 3)}</g>
${px(LAPTOP, 318, 162, 4)}
<g class="bob">${px(CRITTER, 250, 170, 4)}<g class="lid">${px(LIDS, 250, 178, 4)}</g></g>
<rect x="240" y="206" width="160" height="4" fill="#3a3a36"/>
</svg>
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'freeticket-pixel', glass: false },
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

    return <Svg source={SCENE} alt="Pixel art: a little critter typing on a laptop open on FreeTicket, tickets popping out under a marquee sign" isInteractive />
  })
}
