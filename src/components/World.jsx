import { useEffect, useRef } from 'react'
import { ZONES, MARKS, BOTTOM_CARD, PX_PER_M } from '../data.js'
import Silhouette from './Silhouette.jsx'

function ZoneBanner({ zone }) {
  return (
    <section className="zone-banner" style={{ top: (zone.from + 30) * PX_PER_M + 'px' }}>
      <p className="en">{zone.en}</p>
      <h2 className="name">{zone.name}</h2>
      <p className="desc">{zone.desc}</p>
    </section>
  )
}

function MarkCard({ mark, index }) {
  const side = index % 2 ? 'right' : 'left'
  return (
    <article className={`card ${side}`} style={{ top: mark.d * PX_PER_M + 'px' }}>
      <span className="dot" />
      <span className="line" />
      <div className="card-body">
        <h3 className="title">{mark.t}</h3>
        <p className="note">{mark.n}</p>
      </div>
      {mark.svg && <div className={`silhouette ${side === 'right' ? '' : 'right-svg'}`}><Silhouette kind={mark.svg} /></div>}
    </article>
  )
}

/* 深度标尺（每 500 米一小格、1000 米标注） */
function Ruler() {
  const ticks = []
  for (let m = 1000; m <= 10935; m += 500) {
    const major = m % 1000 === 0
    if (!major && m > 10000) continue
    ticks.push(
      <div key={m} className="ruler-tick" style={{ top: m * PX_PER_M + 'px', opacity: major ? 1 : 0.45 }}>
        {major ? `${m.toLocaleString('en-US')} m` : ''}
      </div>
    )
  }
  return <>{ticks}</>
}

function BottomCards() {
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return (
    <>
      <section className="bottom-card" style={{ top: BOTTOM_CARD.d * PX_PER_M + 'px' }}>
        <h2>{BOTTOM_CARD.t}</h2>
        {BOTTOM_CARD.rows.map(([year, who, what]) => (
          <div className="row" key={year}>
            <span className="year">{year}</span>
            <span className="who">{who}</span>
            <span className="what">{what}</span>
          </div>
        ))}
      </section>
      <section className="final-card" style={{ top: 10935 * PX_PER_M + 'px' }}>
        <p className="depth">10,935</p>
        <p className="name">挑战者深渊</p>
        <p className="note">
          你已抵达地球最深处。这里压着约 1,100 个大气压——相当于每平方厘米扛住超过一吨的重量。
          而讽刺的是，人类绘制火星地表的分辨率，仍高于这片离我们最近的海底。
        </p>
        <button onClick={backToTop}>↑ 浮回海面</button>
        <p className="hint">DEEPEST POINT ON EARTH · MARIANA TRENCH</p>
      </section>
    </>
  )
}

export default function World() {
  const worldRef = useRef(null)

  /* 卡片进入视口时淡入 */
  useEffect(() => {
    const els = worldRef.current.querySelectorAll('.card, .zone-banner, .bottom-card, .final-card')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { rootMargin: '0px 0px -10% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div id="world" ref={worldRef}>
      <Ruler />
      {ZONES.map((z) => <ZoneBanner key={z.name} zone={z} />)}
      {MARKS.map((m, i) => <MarkCard key={m.d} mark={m} index={i} />)}
      <BottomCards />
    </div>
  )
}
