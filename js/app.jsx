const { useState, useEffect, useRef, useMemo } = React;

/* ───────── inline SVG marks ───────── */

const Logo = ({ size = 44 }) => (
  <img src="assets/svg/logo-mark.png" alt="" aria-hidden="true"
       style={{width: size, height: 'auto', objectFit: 'contain', display: 'block'}}/>
);

const LeafSeparator = ({ w = 200 }) => (
  <img src="assets/svg/separator.png" alt="" aria-hidden="true"
       style={{width: w, height: 'auto', display: 'block'}} />
);

const IconSprout    = ({ s = 56 }) => <img src="assets/svg/icon-sprout.png"    alt="" aria-hidden="true" style={{width: s, height: s, objectFit: 'contain'}}/>;
const IconClipboard = ({ s = 56 }) => <img src="assets/svg/icon-clipboard.png" alt="" aria-hidden="true" style={{width: s, height: s, objectFit: 'contain'}}/>;
const IconHeart     = ({ s = 56 }) => <img src="assets/svg/icon-heart.png"     alt="" aria-hidden="true" style={{width: s, height: s, objectFit: 'contain'}}/>;
const IconFamily    = ({ s = 56 }) => <img src="assets/svg/icon-family.png"    alt="" aria-hidden="true" style={{width: s, height: s, objectFit: 'contain'}}/>;

/* Lucide-style icons */
const Chev = ({ d, s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d === 'right' && <polyline points="9 18 15 12 9 6"/>}
    {d === 'left' && <polyline points="15 18 9 12 15 6"/>}
    {d === 'down' && <polyline points="6 9 12 15 18 9"/>}
  </svg>
);
const PhoneIcon = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.57 2.8.7A2 2 0 0 1 22 16.92Z"/>
  </svg>
);
const PinIcon = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const DownloadIcon = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const MenuIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="7" x2="21" y2="7"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="17" x2="21" y2="17"/>
  </svg>
);
const CloseIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18"/>
    <line x1="18" y1="6" x2="6" y2="18"/>
  </svg>
);

/* ───────── Reveal helper ───────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); }});
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
const Reveal = ({ children, className = '', as: As = 'div' }) => {
  const ref = useReveal();
  return <As ref={ref} className={`reveal ${className}`}>{children}</As>;
};

/* ───────── Brand wordmark ───────── */
const Wordmark = () => (
  <a href="#" className="flex items-center gap-3 group" aria-label="花山認定こども園 ホーム">
    <Logo size={44}/>
    <span className="flex flex-col leading-tight">
      <span className="text-[10px] tracking-[0.18em] text-muted">認定こども園</span>
      <span className="font-serif text-[16px] md:text-[17px] font-medium tracking-[0.04em] text-ink whitespace-nowrap">花山認定こども園</span>
    </span>
  </a>
);

/* ───────── Header ───────── */
const NAV_LINKS = [
  { label: '園について', href: '#about' },
  { label: 'モンテッソーリ', href: '#montessori' },
  { label: '給食', href: '#lunch' },
  { label: '特色', href: '#features' },
  { label: '入園案内', href: '#admission' },
  { label: 'アクセス', href: '#access' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-line transition-shadow ${scrolled ? 'shadow-softer' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Wordmark/>
        <nav className="hidden lg:flex items-center gap-7" aria-label="メインナビゲーション">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-[13.5px] text-ink hover:text-brand-primary transition-colors py-2">
              {l.label}
            </a>
          ))}
          <a href="tel:0118881234" className="flex items-center gap-1.5 text-brand-primary font-medium text-[13.5px] hover:text-brand-primary-dark transition-colors">
            <PhoneIcon s={15}/>
            <span className="tracking-wider">TEL 011-888-1234</span>
          </a>
        </nav>
        <button onClick={() => setOpen(true)} className="lg:hidden p-2 -mr-2 text-ink" aria-label="メニューを開く">
          <MenuIcon/>
        </button>
      </div>
      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}/>
        <div className={`drawer absolute top-0 right-0 h-full w-[80%] max-w-sm bg-card shadow-lift p-6 ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{transform: open ? 'translateX(0)' : 'translateX(100%)'}}>
          <div className="flex justify-between items-center mb-8">
            <Wordmark/>
            <button onClick={() => setOpen(false)} className="p-2" aria-label="メニューを閉じる"><CloseIcon/></button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 border-b border-line text-ink">{l.label}</a>
            ))}
            <a href="tel:0118881234" className="mt-6 flex items-center gap-2 text-brand-primary font-medium">
              <PhoneIcon s={16}/>TEL 011-888-1234
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ───────── Hero ───────── */
const HERO_IMG = { src: 'assets/photos/hero.png', alt: 'モンテッソーリ教具で遊ぶ園児' };
const HERO_DOTS = 5; // visual pagination only — single image

function Hero({ headline }) {
  const [idx, setIdx] = useState(0);
  const go = (n) => setIdx((n + HERO_DOTS) % HERO_DOTS);
  return (
    <section className="relative w-full overflow-hidden bg-[#1a1410]" style={{height: 'clamp(440px, 60vw, 600px)'}}>
      <div className="absolute inset-0">
        <img src={HERO_IMG.src} alt={HERO_IMG.alt} className="w-full h-full object-cover" loading="eager"/>
      </div>
      {/* warmth gradient for text readability */}
      <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(to right, rgba(20,15,10,0.55) 0%, rgba(20,15,10,0.25) 35%, rgba(0,0,0,0) 60%)'}}/>
      <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(to top, rgba(20,15,10,0.35), rgba(0,0,0,0) 30%)'}}/>

      {/* Headline */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-[1200px] mx-auto w-full px-5 md:px-8 pb-20 md:pb-24">
          <h1 className="font-serif text-white font-medium leading-[1.25] tracking-[0.02em] whitespace-pre-line"
              style={{fontSize: 'clamp(1.75rem, 4.2vw, 3.25rem)', textShadow: '0 2px 18px rgba(0,0,0,0.25)'}}>
            {headline}
          </h1>
          <p className="text-white/90 mt-5 text-[14px] md:text-[15px] leading-relaxed" style={{textShadow: '0 1px 10px rgba(0,0,0,0.35)'}}>
            モンテッソーリ教育を保育の柱に。<br/>
            札幌市清田区里塚緑ヶ丘の認定こども園。
          </p>
        </div>
      </div>

      {/* arrows */}
      <button onClick={() => go(idx - 1)} aria-label="前の写真"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/85 hover:bg-white text-ink flex items-center justify-center shadow-soft transition">
        <Chev d="left"/>
      </button>
      <button onClick={() => go(idx + 1)} aria-label="次の写真"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/85 hover:bg-white text-ink flex items-center justify-center shadow-soft transition">
        <Chev d="right"/>
      </button>

      {/* dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {Array.from({length: HERO_DOTS}).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`スライド ${i+1}`}
            className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-brand-primary' : 'w-2 bg-white/70 hover:bg-white'}`}/>
        ))}
      </div>
    </section>
  );
}

/* ───────── Intro ───────── */
const Intro = () => (
  <Reveal as="section" className="py-16 md:py-20">
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 text-center">
      <h2 className="font-serif font-medium text-ink tracking-[0.04em]" style={{fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)'}}>
        子どもが自ら育つ力を、あたたかく見守り援助します
      </h2>
      <div className="mt-5 flex justify-center"><LeafSeparator w={180}/></div>
    </div>
  </Reveal>
);

/* ───────── Strength cards ───────── */
const STRENGTHS = [
  { img: 'assets/photos/montessori.png', title: 'モンテッソーリ教育', desc: '子どもの自主性を尊重し、\n一人ひとりの発達を丁寧に支えます。', href: '#montessori' },
  { img: 'assets/photos/lunch.png',      title: '独自の献立の給食',     desc: '旬の食材を使い、栄養バランスと\nおいしさにこだわっています。', href: '#lunch' },
  { img: 'assets/photos/garden.png',     title: '広い園庭',           desc: '自然に囲まれた広い園庭で、\nのびのびと体を動かして遊びます。',     href: '#features' },
];

const StrengthCards = () => (
  <Reveal as="section" className="pb-12 md:pb-16">
    <div className="max-w-[1200px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
        {STRENGTHS.map((c, i) => (
          <article key={i} className="card-lift bg-card rounded-xl overflow-hidden shadow-soft">
            <div className="aspect-[4/3] overflow-hidden bg-line">
              <img src={c.img} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-7">
              <h3 className="font-serif text-[19px] md:text-[20px] font-medium text-center text-ink">{c.title}</h3>
              <p className="mt-3 text-[13.5px] text-muted leading-[1.85] text-center whitespace-pre-line">{c.desc}</p>
              <div className="mt-5 text-center">
                <a href={c.href} className="inline-flex items-center gap-1.5 text-brand-primary text-[13px] hover:text-brand-primary-dark transition-colors">
                  詳しく見る <span className="text-[14px]">→</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </Reveal>
);

/* ───────── Four goals ───────── */
const GOALS = [
  { Icon: IconSprout,    title: '自立を援助する',         desc: '自分で考え、行動する力を\n育てる環境を整えます。' },
  { Icon: IconClipboard, title: '基本的習慣を養う',       desc: '生活に必要な習慣を身につけ、\n自信と意欲を育みます。' },
  { Icon: IconHeart,     title: 'たくましい体と強い心',   desc: '心身の健康を育て、\n挑戦する気持ちを支えます。' },
  { Icon: IconFamily,    title: '子育て支援',             desc: '家庭と連携し、地域に開かれた\n子育て支援を行います。' },
];

const Goals = () => (
  <Reveal as="section" id="features" className="py-12 md:py-16">
    <div className="max-w-[1200px] mx-auto px-5 md:px-8">
      <h2 className="font-serif text-center font-medium text-ink" style={{fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)'}}>
        教育・保育の４つの目標
      </h2>
      <div className="mt-5 flex justify-center"><LeafSeparator w={180}/></div>

      <div className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-y-10">
        {GOALS.map(({Icon, title, desc}, i) => (
          <div key={i} className={`px-4 md:px-6 text-center flex flex-col items-center ${i > 0 && i % 2 !== 0 ? 'md:border-l border-dashed border-line' : ''} ${i > 0 ? 'md:border-l md:border-dashed md:border-line' : ''}`}>
            <Icon s={56}/>
            <h3 className="mt-4 font-serif font-medium text-ink text-[16px] md:text-[17px]">{title}</h3>
            <p className="mt-2 text-[12.5px] text-muted leading-[1.85] whitespace-pre-line">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Reveal>
);

/* ───────── Newsletter ───────── */
const NEWSLETTERS = [
  { month: '2026年4月号', img: 'assets/newsletter/2026_04.png', isNew: true,  label: '花山だより', sub: '4月号' },
  { month: '2026年5月号', img: 'assets/newsletter/2026_05.png', isNew: true,  label: '花山だより', sub: '5月号' },
  { month: '2026年6月号', img: 'assets/newsletter/2026_06.png', isNew: false, label: '花山だより', sub: '6月号' },
  { month: '2026年7月号', img: 'assets/newsletter/2026_07.png', isNew: false, label: '花山だより', sub: '7月号' },
];

const NewBadge = () => (
  <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-[#E58A7B] text-white flex items-center justify-center font-semibold text-[11px] tracking-wider shadow-soft" aria-label="新着">
    NEW
  </div>
);

const NewsletterCard = ({ n }) => (
  <article className="relative card-lift bg-card rounded-xl shadow-soft p-3 md:p-3.5">
    {n.isNew && <NewBadge/>}
    {/* Newsletter "page" preview */}
    <div className="rounded-md overflow-hidden bg-[#FBF8F1] border border-line">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <Logo size={14}/>
          <span className="font-serif text-[9.5px] text-ink truncate">{n.label}</span>
        </div>
        <span className="text-[9px] text-brand-primary font-medium whitespace-nowrap">{n.sub}</span>
      </div>
      <div className="px-3 pb-3">
        <div className="aspect-[16/10] rounded-sm overflow-hidden bg-line">
          <img src={n.img} alt="" loading="lazy" className="w-full h-full object-cover"/>
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-1 bg-line rounded-full w-full"/>
          <div className="h-1 bg-line rounded-full w-[85%]"/>
          <div className="h-1 bg-line rounded-full w-[70%]"/>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between px-1 pt-3 pb-1">
      <span className="text-[13px] font-medium text-ink">{n.month}</span>
      <button className="text-muted hover:text-brand-primary transition-colors" aria-label={`${n.month} をダウンロード`}>
        <DownloadIcon s={16}/>
      </button>
    </div>
  </article>
);

const Newsletter = () => (
  <Reveal as="section" className="py-12 md:py-16">
    <div className="max-w-[1200px] mx-auto px-5 md:px-8">
      <h2 className="font-serif text-center font-medium text-ink" style={{fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)'}}>
        おたより
      </h2>
      <div className="mt-5 flex justify-center"><LeafSeparator w={140}/></div>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {NEWSLETTERS.map((n, i) => <NewsletterCard key={i} n={n}/>)}
      </div>
    </div>
  </Reveal>
);

/* ───────── Pokapoka CTA ───────── */
const FloralDecor = () => (
  <img src="assets/svg/floral.png" alt="" aria-hidden="true"
       style={{width: 110, height: 'auto', objectFit: 'contain', opacity: 0.85}}/>
);

const PokapokaCTA = ({ ctaStyle, showFloral }) => (
  <Reveal as="section" className="pb-12 md:pb-16">
    <div className="max-w-[1200px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-soft bg-pokapoka">
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[280px]">
          <img src="assets/photos/pokapoka.png" alt="ふれあいルーム ぽかぽかの様子" className="w-full h-full object-cover" loading="lazy"/>
        </div>
        <div className="relative p-8 md:p-10 lg:p-12 flex flex-col justify-center">
          {showFloral && <div className="absolute right-5 bottom-5 hidden md:block"><FloralDecor/></div>}
          <h3 className="font-serif font-medium text-ink text-[20px] md:text-[24px]">
            ふれあいルーム <span className="ml-1">ぽかぽか</span>
          </h3>
          <a href="tel:0118885678" className="mt-3 flex items-center gap-2 text-[#D4685A] font-serif font-medium text-[28px] md:text-[34px] tracking-wider hover:opacity-80 transition">
            <PhoneIcon s={22}/>011-888-5678
          </a>
          <p className="mt-3 text-[13px] md:text-[14px] text-ink/80 leading-relaxed">
            子育て相談や親子の交流の場としてご利用いただけます。
          </p>
          <div className="mt-5">
            <a href="#contact"
               className={`inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white text-[13.5px] font-medium px-6 py-3 transition-colors ${ctaStyle === 'pill' ? 'rounded-full' : 'rounded-md'}`}>
              見学申込・お問い合わせ <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Reveal>
);

/* ───────── News + Access ───────── */
const NEWS = [
  { date: '2026.05.12', tag: '行事',      tagColor: 'bg-[#D9A89A]', title: '春の運動会を開催しました' },
  { date: '2026.05.01', tag: 'お知らせ',  tagColor: 'bg-brand-primary', title: '2027年度 入園説明会のお知らせ' },
  { date: '2026.04.15', tag: 'おたより',  tagColor: 'bg-[#D8A45C]', title: '園だより5月号を掲載しました' },
  { date: '2026.04.01', tag: 'お知らせ',  tagColor: 'bg-brand-primary', title: 'ホームページをリニューアルしました' },
];

/* simple stylised map */
const MapTile = () => (
  <svg viewBox="0 0 480 280" className="w-full h-full" aria-hidden="true">
    <rect width="480" height="280" fill="#F3EFE6"/>
    {/* parks */}
    <rect x="0" y="180" width="180" height="100" fill="#DDE7CC"/>
    <rect x="300" y="0" width="180" height="80" fill="#DDE7CC"/>
    <rect x="360" y="180" width="120" height="100" fill="#DDE7CC"/>
    {/* roads */}
    <rect x="0" y="120" width="480" height="14" fill="#fff"/>
    <rect x="0" y="200" width="480" height="10" fill="#fff"/>
    <rect x="180" y="0" width="14" height="280" fill="#fff"/>
    <rect x="340" y="0" width="10" height="280" fill="#fff"/>
    {/* blocks */}
    <rect x="200" y="20" width="120" height="90" fill="#EFE9DC"/>
    <rect x="210" y="140" width="120" height="50" fill="#EFE9DC"/>
    <rect x="20" y="20" width="140" height="90" fill="#EFE9DC"/>
    {/* river */}
    <path d="M0 60 Q120 80 240 60 T480 80" stroke="#C7DDE9" strokeWidth="8" fill="none"/>
    {/* labels */}
    <text x="80" y="240" fontSize="10" fill="#8B8474" fontFamily="Noto Sans JP">里塚緑ヶ丘公園</text>
    <text x="220" y="170" fontSize="10" fill="#8B8474" fontFamily="Noto Sans JP">里塚緑ヶ丘</text>
    {/* pin */}
    <g transform="translate(252 142)">
      <path d="M0 0 c0 -16 -22 -16 -22 -32 a11 11 0 0 1 22 0 c0 16 -22 16 -22 32 Z" fill="#D44A3A" transform="translate(11 32)"/>
      <path d="M0 -34 a11 11 0 0 1 22 0 a11 11 0 0 1 -22 0" fill="#D44A3A"/>
      <circle cx="11" cy="-34" r="4" fill="#fff"/>
    </g>
  </svg>
);

const NewsAccess = () => (
  <Reveal as="section" id="news" className="pb-12 md:pb-16">
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      {/* News */}
      <div>
        <div className="flex items-end justify-between">
          <h2 className="font-serif font-medium text-ink text-[20px] md:text-[22px] flex items-center gap-3">
            <span>お知らせ</span>
            <img src="assets/svg/separator-arrow.png" alt="" aria-hidden="true"
                 style={{height: 22, width: 'auto', objectFit: 'contain', opacity: 0.9}}/>
          </h2>
          <a href="#" className="text-muted hover:text-brand-primary text-[12.5px] inline-flex items-center gap-1 transition-colors">
            一覧を見る <span>→</span>
          </a>
        </div>
        <ul className="mt-4 bg-card rounded-xl shadow-softer divide-y divide-line">
          {NEWS.map((n, i) => (
            <li key={i}>
              <a href="#" className="news-row flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3.5 md:py-4 transition-colors">
                <time className="text-[12px] text-muted tabular-nums whitespace-nowrap">{n.date}</time>
                <span className={`${n.tagColor} text-white text-[10.5px] font-medium px-2.5 py-0.5 rounded-sm whitespace-nowrap`}>{n.tag}</span>
                <span className="text-[13px] text-ink flex-1 truncate">{n.title}</span>
                <Chev d="right" s={14}/>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Access */}
      <div id="access">
        <h2 className="font-serif font-medium text-ink text-[20px] md:text-[22px]">アクセス</h2>
        <div className="mt-4">
          <div className="map-wrapper">
            <iframe
              src="https://maps.google.com/maps?q=札幌市清田区里塚緑ヶ丘3-8-1&output=embed"
              width="100%"
              height="100%"
              style={{border: 0}}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="花山認定こども園 地図">
            </iframe>
          </div>
          <p className="mt-3 flex items-center gap-2" style={{fontSize: '14px', color: '#2A2A2A'}}>
            <svg width="16" height="20" viewBox="0 0 24 30" aria-hidden="true">
              <path d="M12 0 C5.4 0 0 5.2 0 11.6 C0 19.6 12 30 12 30 C12 30 24 19.6 24 11.6 C24 5.2 18.6 0 12 0 Z"
                    fill="#EA4335" stroke="#B31412" strokeWidth="0.5"/>
              <circle cx="12" cy="11.6" r="4.2" fill="#fff"/>
            </svg>
            <span>札幌市清田区里塚緑ヶ丘3-8-1</span>
          </p>
        </div>
      </div>
    </div>
  </Reveal>
);

/* ───────── Footer ───────── */
const Footer = () => (
  <footer className="bg-card border-t border-line mt-4">
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <Wordmark/>
      <div className="text-[12.5px] text-muted leading-[1.9]">
        <p>〒004-0805　札幌市清田区里塚緑ヶ丘</p>
        <p>TEL 011-888-1234</p>
      </div>
      <div className="text-[12.5px] text-muted">社会福祉法人 花山福祉会</div>
    </div>
    <div className="border-t border-line">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-4 text-center text-[11px] text-muted">
        © 2026 Hanayama Kodomoen. All Rights Reserved.
      </div>
    </div>
  </footer>
);

/* ───────── Tweaks ───────── */
const PALETTES = {
  sage:    { primary: '#7BA05B', primaryDark: '#6B8E4D', secondary: '#D9A89A', pokapoka: '#F9E7E0', bg: '#FAF7F2' },
  forest:  { primary: '#5C7F4B', primaryDark: '#4E6C40', secondary: '#C7906A', pokapoka: '#F5E2D4', bg: '#F8F5EE' },
  sky:     { primary: '#6E96B3', primaryDark: '#5E83A0', secondary: '#E5A6A1', pokapoka: '#FAE6E3', bg: '#F6F4F0' },
  apricot: { primary: '#C68A4E', primaryDark: '#B07840', secondary: '#9DB582', pokapoka: '#F7E2CF', bg: '#FBF6EE' },
};

function applyPalette(name) {
  const p = PALETTES[name] || PALETTES.sage;
  const r = document.documentElement.style;
  r.setProperty('--brand-primary', p.primary);
  r.setProperty('--brand-primary-dark', p.primaryDark);
  r.setProperty('--brand-secondary', p.secondary);
  r.setProperty('--pokapoka', p.pokapoka);
  r.setProperty('--bg', p.bg);
}

function MyTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="カラーパレット">
        <TweakColor
          label="園のメインカラー"
          value={tweaks.palette}
          onChange={v => setTweak('palette', v)}
          options={[
            ['#7BA05B', '#D9A89A', '#F9E7E0'],
            ['#5C7F4B', '#C7906A', '#F5E2D4'],
            ['#6E96B3', '#E5A6A1', '#FAE6E3'],
            ['#C68A4E', '#9DB582', '#F7E2CF'],
          ]}
        />
        <p className="text-[11px] text-neutral-500 mt-2">セージ / フォレスト / スカイ / アプリコット</p>
      </TweakSection>
      <TweakSection title="ヒーロー">
        <TweakText label="メインコピー" value={tweaks.heroHeadline} onChange={v => setTweak('heroHeadline', v)} placeholder="例：自分でできた、を、重ねていく。"/>
      </TweakSection>
      <TweakSection title="ぽかぽかCTA">
        <TweakRadio
          label="ボタン形状"
          value={tweaks.ctaStyle}
          onChange={v => setTweak('ctaStyle', v)}
          options={[
            { value: 'pill',   label: 'ピル型' },
            { value: 'square', label: '角丸' },
          ]}
        />
        <TweakToggle label="花柄装飾を表示" value={tweaks.showFloral} onChange={v => setTweak('showFloral', v)}/>
      </TweakSection>
    </TweaksPanel>
  );
}

/* ───────── App ───────── */
function App() {
  const defaults = window.__TWEAK_DEFAULTS__;
  const [tweaks, setTweak] = useTweaks(defaults);

  // Map first colour of selected palette to a named theme.
  useEffect(() => {
    const v = tweaks.palette;
    const first = Array.isArray(v) ? v[0] : v;
    const map = { '#7BA05B': 'sage', '#5C7F4B': 'forest', '#6E96B3': 'sky', '#C68A4E': 'apricot' };
    applyPalette(map[first] || 'sage');
  }, [tweaks.palette]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header/>
      <main className="flex-1">
        <Hero headline={tweaks.heroHeadline || '自分でできた、\nを重ねていく'}/>
        <Intro/>
        <StrengthCards/>
        <Goals/>
        <Newsletter/>
        <PokapokaCTA ctaStyle={tweaks.ctaStyle} showFloral={tweaks.showFloral}/>
        <NewsAccess/>
      </main>
      <Footer/>
      <MyTweaks tweaks={tweaks} setTweak={setTweak}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
