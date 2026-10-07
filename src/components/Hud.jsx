import { useImperativeHandle, useRef } from 'react'
import { ZONES, TEMP_STOPS, lerpStops } from '../data.js'

const fmt = (n) => Math.round(n).toLocaleString('en-US')

function zoneAt(depth) {
  if (depth < 1) return '海面'
  const z = ZONES.find((z) => depth >= z.from && depth < z.to)
  return z ? z.name : '——'
}

function lightAt(depth) {
  const I = 100 * Math.exp(-0.035 * depth)
  if (I < 0.001) return '≈ 0'
  return I >= 1 ? I.toFixed(1) + '%' : I.toFixed(3) + '%'
}

/* 深度仪表盘：由父级 rAF 经 ref 命令式刷新，自身不触发 React 渲染 */
export default function Hud({ ref }) {
  const d = useRef(null), p = useRef(null), tp = useRef(null), li = useRef(null), zo = useRef(null)

  useImperativeHandle(ref, () => ({
    update(depth) {
      if (!d.current) return
      d.current.textContent = fmt(depth)
      p.current.textContent = fmt(1 + depth / 10)
      tp.current.textContent = lerpStops(TEMP_STOPS, depth).toFixed(1)
      li.current.textContent = lightAt(depth)
      zo.current.textContent = zoneAt(depth)
    }
  }), [])

  return (
    <aside id="hud" aria-hidden="true">
      <div className="hud-row big">
        <span className="hud-label">深度</span>
        <span id="hud-depth" ref={d}>0</span>
        <span className="hud-unit">m</span>
      </div>
      <div className="hud-row">
        <span className="hud-label">压力</span>
        <span ref={p}>1</span>
        <span className="hud-unit">atm</span>
      </div>
      <div className="hud-row">
        <span className="hud-label">水温</span>
        <span ref={tp}>22.0</span>
        <span className="hud-unit">°C</span>
      </div>
      <div className="hud-row">
        <span className="hud-label">光照</span>
        <span ref={li}>100.0%</span>
      </div>
      <div className="hud-row zone">
        <span className="hud-label">水层</span>
        <span ref={zo}>海面</span>
      </div>
    </aside>
  )
}
