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

// Tickets drift in the corners, a cartel ribbon crosses the top; the middle and foot stay clear for words.
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.d1{animation:f 18s ease-in-out infinite}
.d2{animation:f 23s ease-in-out infinite reverse}
.d3{animation:f 29s ease-in-out infinite}
.r{animation:s 40s linear infinite}
@keyframes f{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-24px) rotate(2deg)}}
@keyframes s{from{transform:translateX(0)}to{transform:translateX(-400px)}}
@media (prefers-reduced-motion:reduce){.d1,.d2,.d3,.r{animation:none}}
</style>
<defs>
<g id="t">
<path d="M0 0h220v44a16 16 0 0 0 0 32v44H0V76a16 16 0 0 0 0-32z" fill="currentColor" stroke="#070707" stroke-width="4"/>
<path d="M160 8v104" stroke="#070707" stroke-width="3" stroke-dasharray="8 8"/>
<rect x="22" y="26" width="110" height="14" fill="#070707" opacity=".85"/>
<rect x="22" y="52" width="80" height="10" fill="#070707" opacity=".55"/>
<rect x="22" y="72" width="96" height="10" fill="#070707" opacity=".55"/>
</g>
</defs>
<g opacity=".22">
<g transform="rotate(-8 1600 0)">
<rect x="-200" y="40" width="2400" height="70" fill="#ffd102" stroke="#070707" stroke-width="4"/>
<g class="r" font-family="Arial Narrow,Arial,sans-serif" font-weight="900" font-size="40" fill="#070707">
<text x="0" y="90">FREETICKET ★ ENTRADAS ★ FREETICKET ★ ENTRADAS ★ FREETICKET ★ ENTRADAS ★ FREETICKET ★ ENTRADAS ★ FREETICKET ★ ENTRADAS ★</text>
</g>
</g>
<g class="d1" style="color:#ffd102"><use href="#t" transform="translate(60 230) rotate(-14)"/></g>
<g class="d2" style="color:#1ebbb2"><use href="#t" transform="translate(1330 300) rotate(12)"/></g>
<g class="d3" style="color:#8505dc"><use href="#t" transform="translate(110 640) rotate(9)"/></g>
<g class="d1" style="color:#ffd102"><use href="#t" transform="translate(1300 700) rotate(-10)"/></g>
</g>
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'freeticket', glass: { blur: 2, tint: '#070707', opacity: 0.08 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="FreeTicket tickets drifting under a cartel ribbon" isInteractive />
  })
}
