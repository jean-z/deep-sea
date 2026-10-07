import { useEffect, useImperativeHandle, useRef } from 'react'
import { WATER_STOPS, PX_PER_M, lerpStops } from '../data.js'

/* 画布水体背景：颜色渐变 + 光柱 + 海雪 + 鱼群 + 发光水母 */
export default function OceanCanvas({ ref }) {
  const canvasRef = useRef(null)
  const s = useRef(null)

  /* 初始化粒子与尺寸（仅一次） */
  useEffect(() => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    const st = {
      c, ctx, W: 0, H: 0,
      prevScroll: window.scrollY,
      snow: Array.from({ length: 130 }, () => ({
        x: Math.random(), y: Math.random() * 2000, s: 1 + Math.random() * 2,
        a: 0.08 + Math.random() * 0.3, par: 0.35 + Math.random() * 0.6,
        fall: 0.08 + Math.random() * 0.22, tw: 0.5 + Math.random() * 1.5, ph: Math.random() * 6.28, wf: 0.4 + Math.random()
      })),
      fish: Array.from({ length: 24 }, () => ({
        d: 8 + Math.random() * 180, x0: 0.08 + Math.random() * 0.84,
        s: 0.6 + Math.random() * 0.8, sp: 0.5 + Math.random(), ph: Math.random() * 6.28
      })),
      jellies: Array.from({ length: 7 }, (_, i) => ({
        d: 480 + Math.random() * 2100, x: 0.1 + Math.random() * 0.8,
        s: 0.7 + Math.random() * 0.8, ph: Math.random() * 6.28
      }))
    }
    s.current = st

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      st.W = window.innerWidth
      st.H = window.innerHeight
      c.width = st.W * dpr
      c.height = st.H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useImperativeHandle(ref, () => ({
    draw(depth, scrollY, t) {
      const st = s.current
      if (!st) return
      const { ctx, W, H } = st

      /* 水体：顶部略亮、底部为本层本色 */
      const col = lerpStops(WATER_STOPS, depth)
      const lit = col.map((v) => Math.min(255, Math.round(v * 1.25)))
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, `rgb(${lit.join(',')})`)
      g.addColorStop(1, `rgb(${col.join(',')})`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      /* 光柱：随深度衰减，约 230 米后消失 */
      const rayA = Math.max(0, 1 - depth / 230)
      if (rayA > 0.01) {
        ctx.save()
        for (let i = 0; i < 6; i++) {
          const sway = Math.sin(t / 1800 + i * 1.7) * 30
          const x = W * (0.1 + i * 0.16) + sway
          ctx.globalAlpha = rayA * (0.05 + 0.04 * (i % 3))
          const rg = ctx.createLinearGradient(x, 0, x + 40, H * 0.85)
          rg.addColorStop(0, 'rgba(255,255,255,.9)')
          rg.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = rg
          ctx.beginPath()
          ctx.moveTo(x - 26, -10)
          ctx.lineTo(x + 26, -10)
          ctx.lineTo(x + 95, H * 0.85)
          ctx.lineTo(x - 95, H * 0.85)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      }

      /* 海雪：视差 + 深层生物荧光闪烁 */
      const ds = scrollY - st.prevScroll
      st.prevScroll = scrollY
      const deep = depth > 600
      for (const p of st.snow) {
        p.y -= ds * p.par
        p.y += p.fall
        p.x += Math.sin(t / 1400 * p.wf + p.ph) * 0.15
        if (p.y < -12) { p.y = H + 8; p.x = Math.random() * W }
        if (p.y > H + 12) { p.y = -8; p.x = Math.random() * W }
        const a = deep ? p.a * (0.35 + 0.65 * Math.abs(Math.sin(t / 900 * p.tw + p.ph))) : p.a * 0.8
        ctx.fillStyle = deep ? `rgba(170,235,255,${a})` : `rgba(255,255,255,${a})`
        ctx.fillRect(p.x, p.y, p.s, p.s)
      }

      /* 浅层鱼群剪影（阳光带） */
      if (depth < 460) {
        const a = 0.3 * (1 - depth / 460)
        ctx.fillStyle = `rgba(6,20,34,${a})`
        for (const f of st.fish) {
          const sy = f.d * PX_PER_M - scrollY
          if (sy < -40 || sy > H + 40) continue
          const x = W * f.x0 + Math.sin(t / 1600 * f.sp + f.ph) * (W * 0.06)
          const dir = Math.cos(t / 1600 * f.sp + f.ph) > 0 ? 1 : -1
          ctx.save()
          ctx.translate(x, sy)
          ctx.scale(dir * f.s, f.s)
          ctx.beginPath()
          ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2)
          ctx.moveTo(12, 0)
          ctx.lineTo(22, -5)
          ctx.lineTo(22, 5)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        }
      }

      /* 深层发光水母（暮光带—午夜带） */
      for (const j of st.jellies) {
        const sy = j.d * PX_PER_M - scrollY
        if (sy < -90 || sy > H + 90) continue
        const pulse = 1 + 0.08 * Math.sin(t / 700 + j.ph)
        const a = 0.35 + 0.25 * Math.sin(t / 900 + j.ph * 2)
        ctx.save()
        ctx.translate(j.x * W, sy)
        ctx.scale(j.s * pulse, j.s * pulse)
        ctx.shadowColor = `rgba(150,235,255,${a})`
        ctx.shadowBlur = 22
        ctx.strokeStyle = `rgba(190,240,255,${a})`
        ctx.lineWidth = 1.6
        ctx.fillStyle = `rgba(170,230,255,${a * 0.22})`
        ctx.beginPath()
        ctx.arc(0, 0, 20, Math.PI, 0)
        ctx.quadraticCurveTo(20, 8, 0, 9)
        ctx.quadraticCurveTo(-20, 8, -20, 0)
        ctx.fill()
        for (let k = -3; k <= 3; k++) {
          ctx.beginPath()
          ctx.moveTo(k * 5, 8)
          ctx.quadraticCurveTo(k * 5 + Math.sin(t / 600 + k) * 4, 26, k * 5 + Math.sin(t / 500 + k * 1.3) * 7, 44)
          ctx.stroke()
        }
        ctx.restore()
      }
    }
  }), [])

  return <canvas id="ocean" ref={canvasRef} aria-hidden="true" />
}
