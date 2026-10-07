/* 手绘风格的生物/沉船剪影（深色填充 + 微光描边），v1 可后续替换为更精细素材 */
const SVGS = {
  whale: (
    <svg viewBox="0 0 320 140" aria-hidden="true">
      <path d="M14 70 C24 46 66 32 118 32 C176 32 226 40 254 52 L282 36 L276 58 L298 70 L276 76 L282 96 L252 68 C216 80 158 86 108 82 C58 78 22 86 14 70 Z" />
    </svg>
  ),
  squid: (
    <svg viewBox="0 0 200 270" aria-hidden="true">
      <path d="M100 6 C132 28 141 70 134 108 L66 108 C59 70 68 28 100 6 Z" />
      <path d="M100 4 C84 20 77 38 80 52 L120 52 C123 38 116 20 100 4 Z" opacity=".9" />
      <path d="M74 106 C64 118 62 134 70 148 C86 156 114 156 130 148 C138 134 136 118 126 106 Z" />
      <g fill="none" stroke="#06121f" strokeLinecap="round">
        <path d="M72 146 C58 176 66 204 50 240" strokeWidth="10" />
        <path d="M88 152 C80 186 88 214 76 248" strokeWidth="9" />
        <path d="M100 154 C100 190 106 218 98 252" strokeWidth="9" />
        <path d="M112 152 C120 186 112 214 124 248" strokeWidth="9" />
        <path d="M128 146 C142 176 134 204 150 240" strokeWidth="10" />
      </g>
      <g fill="none" stroke="#06121f" strokeLinecap="round" strokeWidth="5">
        <path d="M64 142 C40 190 52 230 30 262" />
        <path d="M136 142 C160 190 148 230 170 262" />
      </g>
      <circle cx="88" cy="128" r="7" fill="rgba(159,220,255,.5)" stroke="none" />
    </svg>
  ),
  titanic: (
    <svg viewBox="0 0 340 150" aria-hidden="true">
      <path d="M6 118 C48 100 96 92 150 92 L306 98 L318 124 L6 124 Z" />
      <path d="M96 92 L98 76 L232 80 L230 94 Z" />
      <path d="M118 74 L122 40 L140 42 L136 76 Z" />
      <path d="M164 78 L168 44 L186 46 L182 80 Z" />
      <path d="M210 82 L214 50 L230 52 L226 84 Z" />
      <path d="M52 104 L64 78 L72 80 L60 106 Z" opacity=".85" />
    </svg>
  )
}

export default function Silhouette({ kind }) {
  return SVGS[kind] ?? null
}
