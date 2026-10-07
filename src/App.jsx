import { useEffect, useRef } from 'react'
import OceanCanvas from './components/OceanCanvas.jsx'
import Hud from './components/Hud.jsx'
import Intro from './components/Intro.jsx'
import World from './components/World.jsx'
import { PX_PER_M, MAX_DEPTH } from './data.js'

export default function App() {
  const canvasRef = useRef(null)
  const hudRef = useRef(null)
  const spacerRef = useRef(null)

  /* 页面总高度 = 深度 × 比例尺 + 余量 */
  useEffect(() => {
    const setH = () => {
      if (spacerRef.current) spacerRef.current.style.height = MAX_DEPTH * PX_PER_M + 700 + 'px'
    }
    setH()
    window.addEventListener('resize', setH)
    return () => window.removeEventListener('resize', setH)
  }, [])

  /* 唯一 rAF 主循环：滚动深度驱动画布与仪表盘（经命令式 ref，避免 60fps 重渲染） */
  useEffect(() => {
    let raf
    const loop = (t) => {
      const scrollY = window.scrollY
      const depth = Math.min(MAX_DEPTH, Math.max(0, scrollY / PX_PER_M))
      canvasRef.current?.draw(depth, scrollY, t)
      hudRef.current?.update(depth)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <OceanCanvas ref={canvasRef} />
      <div id="vignette" />
      <header id="brand">潜入深渊 <span>· 10,935 m</span></header>
      <Hud ref={hudRef} />
      <Intro />
      <World />
      <div id="spacer" ref={spacerRef} />
    </>
  )
}
