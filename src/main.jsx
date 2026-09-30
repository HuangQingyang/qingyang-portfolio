import React, { lazy, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Cpu,
  Languages,
  Mail,
  MapPin,
  MonitorPlay,
  Phone,
  Scissors,
} from 'lucide-react';
import Magnet from './Magnet';
import DeferredEffect from './DeferredEffect';
import HeroReel from './HeroReel';
import StarBorder from './StarBorder';
import WarpText from './WarpText';
import { ProjectDialog } from './ProjectGallery';
import CircularGallery from './CircularGallery';
import './styles.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const MagicRings = lazy(() => import('./MagicRings'));
const PixelBlast = lazy(() => import('./PixelBlast'));
const PrismaticBurst = lazy(() => import('./PrismaticBurst'));
const DotGrid = lazy(() => import('./DotGrid'));
const prismColors = ['#76d6c4', '#627be8', '#b2a0e9'];

const copy = {
  zh: {
    nav: ['首页', '经历', '项目', '优势', '联系'],
    contact: '联系我',
    lang: 'EN',
    heroKicker: 'PORTFOLIO',
    heroTitle: '黄庆阳',
    heroSubtitle:
      '以影像叙事、后期流程与生成式创作为核心，创作电影、动画、真人纪实与跨媒介影像。',
    heroMeta: ['上海，中国', '南加州大学电影与电视制作', '2026'],
    reel: '查看作品',
    aboutLabel: '个人经历',
    aboutTitle: '在片场、剪辑室与生成式影像之间工作。',
    aboutBody:
      '我是一名电影制作人、后期剪辑师和 AIGC 创作者。我的创作跨越叙事短片、动画、真人拍摄、剪辑与后期协作，关注数字身份、混合媒介与新影像语言。',
    educationTitle: '教育背景',
    education: [
      '南加州大学 · 电影与电视制作文学学士 · 2026',
    ],
    details: [
      { label: '所在地', value: ['洛杉矶，美国', '上海，中国'] },
      { label: '邮箱', value: 'huangqingyang33@gmail.com' },
      { label: '电话', value: ['+1 (725) 275-8768', '+86 180 1868 2238'] },
    ],
    stats: [
      { value: '5+', label: '叙事与动画项目' },
      { value: '3', label: '核心后期软件' },
      { value: '2024+', label: '洛杉矶剧组经验' },
      { value: '2D/3D/AI', label: '混合媒介实践' },
    ],
    projectsLabel: '精选项目',
    projects: [
      {
        title: '熊猫计划2',
        role: '后期制片助理',
        year: '2025',
        image: './assets/panda-poster.jpg',
        description:
          '参与中国院线长片后期制作，担任约三周后期制片助理。汇总主创反馈，协调剪辑、调色、视效与作曲；发现版本偏差后，推动团队核对最新剪辑，恢复声画同步。',
      },
      {
        title: '奥里与奇多',
        role: '预告片剪辑师',
        year: '2026',
        image: 'assets/project-ori-cover.jpg',
        video: './assets/ori-trailer.mp4',
        description:
          '为一部二十分钟混合媒介动画短片独立剪辑社交媒体宣传预告。围绕二维动画主体组织素材，按导演反馈调整镜头选择、节奏与高潮衔接；另完成正片约二十秒真人蒙太奇，整理三十余份家庭影像及五十余条素材库影像。',
      },
      {
        title: '台球宝贝',
        role: '剪辑师',
        year: '2025',
        image: './assets/billiard-poster.jpg',
        description: '担任剪辑师，负责影片剪辑与叙事节奏。',
      },
      {
        title: '人格面具',
        role: '导演／编剧',
        year: '2025',
        image: 'assets/project-persona-cover.png',
        video: './assets/persona-film.mp4',
        description:
          '南加州大学课程短片。担任导演与编剧，统筹约十人团队完成选角、场地、搭景与拍摄；通过审片反馈参与后期，并使用剪辑与调色软件制作基础视觉特效。',
      },
      {
        title: '聚焦',
        role: '导演／编剧',
        year: '2024',
        image: './assets/focus-poster.jpg',
        video: './assets/focus-film.mp4',
        description:
          '五分钟独立剧情短片。担任导演与编剧，协调约十五人团队完成前期、拍摄及后期，以双线交叉叙事推进危机。作品用于南加州大学电影制作本科申请。',
      },
      {
        title: '对峙', role: '独立创作／剪辑／声音制作', year: '2026',
        image: './assets/standoff-poster.png', video: './assets/standoff-film.mp4',
        description: '约五分钟写实三维科幻短片。独立完成创意、分镜、人工智能图像与视频生成、剪辑、声音及社交媒体包装。为呈现怪物的速度、力量和动物式移动，制作多个动作版本，并通过剪辑重组形成连贯的人怪打斗。',
      },
    ],
    strengthsLabel: '个人优势',
    strengthsTitle: '从创作判断到交付流程，形成完整影像工作链路。',
    strengths: [
      {
        icon: 'edit',
        title: '后期剪辑与流程',
        body: 'Premiere Pro、AVID Media Composer、DaVinci Resolve 与 Pro Tools，熟悉剪辑排期、版本反馈和交付协作。',
      },
      {
        icon: 'film',
        title: '叙事导演能力',
        body: '在短片中承担导演、编剧与剪辑，能把主题、表演、镜头和节奏收束成完整叙事。',
      },
      {
        icon: 'camera',
        title: '现场拍摄经验',
        body: '具备摄影操作、灯光、摄影助理与器械协助等片场经验，适应快节奏与非剧本环境。',
      },
      {
        icon: 'ai',
        title: 'AIGC 与混合媒介',
        body: '将生成式 AI、2D/3D、真人与定格影像放入同一创作系统，探索新的视觉语言。',
      },
    ],
    contactTitle: '让下一支影像，从一个清晰的想法开始。',
    contactBody:
      '欢迎联系我讨论短片、MV、品牌影像、后期剪辑、AIGC 视觉实验或跨媒介项目。',
    footerLinks: ['Email', 'Phone', 'Los Angeles'],
  },
  en: {
    nav: ['Home', 'About', 'Work', 'Strengths', 'Contact'],
    contact: 'Contact',
    lang: '中文',
    heroKicker: 'PORTFOLIO',
    heroTitle: 'QINGYANG\nHUANG',
    heroSubtitle:
      'I work across cinematic storytelling, post-production workflows, and generative media for films, animation, documentary scenes, and hybrid moving images.',
    heroMeta: ['Shanghai, CN', 'USC Film & Television Production', '2026'],
    reel: 'View Work',
    aboutLabel: 'Profile',
    aboutTitle: 'Working between the set, the edit room, and generative image systems.',
    aboutBody:
      'I am a filmmaker, post-production editor, and AIGC creator. My work spans narrative shorts, animation, live-action production, editorial collaboration, and hybrid-media experiments around digital identity and new image languages.',
    educationTitle: 'Education',
    education: [
      'University of Southern California - B.A. Film & Television Production, 2026',
    ],
    details: [
      { label: 'Based in', value: ['Los Angeles, USA', 'Shanghai, CN'] },
      { label: 'Email', value: 'huangqingyang33@gmail.com' },
      { label: 'Phone', value: ['+1 (725) 275-8768', '+86 180 1868 2238'] },
    ],
    stats: [
      { value: '5+', label: 'Film and animation projects' },
      { value: '3', label: 'Core post tools' },
      { value: '2024+', label: 'LA production crew work' },
      { value: '2D/3D/AI', label: 'Hybrid media practice' },
    ],
    projectsLabel: 'Selected Work',
    projects: [
      {
        title: 'Panda Plan 2',
        role: 'Post-Production Producer Assistant',
        year: '2025',
        image: './assets/panda-poster.jpg',
        description:
          'Supported post-production on a Chinese theatrical feature for approximately three weeks. Consolidated creative feedback and coordinated editorial, color, VFX, and music teams. Helped resolve a version mismatch by checking the latest cut and restoring picture–sound synchronization.',
      },
      {
        title: 'Ori & Kiddo',
        role: 'Trailer Editor',
        year: '2026',
        image: 'assets/project-ori-cover.jpg',
        video: './assets/ori-trailer.mp4',
        description:
          'Independently edited a social-media trailer for a 20-minute mixed-media animated short, refining shot selection, pacing, and the climax in response to director feedback. Also edited around 20 seconds of live-action montage for the film and organized more than 30 home-video files and 50 stock-footage clips.',
      },
      {
        title: 'Billiard Baby',
        role: 'Editor',
        year: '2025',
        image: './assets/billiard-poster.jpg',
        description: 'Film editing and narrative rhythm.',
      },
      {
        title: 'Persona',
        role: 'Director / Writer',
        year: '2025',
        image: 'assets/project-persona-cover.png',
        video: './assets/persona-film.mp4',
        description:
          'A USC course short. Directed and wrote the film, coordinating a team of around ten across casting, locations, set construction, and production. Contributed to post-production through review sessions and created basic VFX in Premiere Pro and DaVinci Resolve.',
      },
      {
        title: 'Focus',
        role: 'Director / Writer',
        year: '2024',
        image: './assets/focus-poster.jpg',
        video: './assets/focus-film.mp4',
        description:
          'A five-minute independent narrative short. Directed and wrote the film, coordinating a team of around fifteen from pre-production through post-production. Used parallel storylines to build tension. Created for the USC undergraduate film-production application.',
      },
      {
        title: 'STANDOFF', role: 'Independent Creator / Editor / Sound', year: '2026',
        image: './assets/standoff-poster.png', video: './assets/standoff-film.mp4',
        description: 'An approximately five-minute photorealistic 3D science-fiction short. Independently developed the concept, storyboards, AI-generated imagery and video, editing, sound, and social-media presentation using Midjourney, Higgsfield, and Premiere Pro. Iterated creature-action shots and restructured them in the edit to create a coherent human–creature fight.',
      },
    ],
    strengthsLabel: 'Strengths',
    strengthsTitle: 'A complete moving-image workflow from creative judgment to delivery.',
    strengths: [
      {
        icon: 'edit',
        title: 'Editorial Workflow',
        body: 'Premiere Pro, AVID Media Composer, DaVinci Resolve, and Pro Tools, with experience around edit schedules, review notes, and delivery communication.',
      },
      {
        icon: 'film',
        title: 'Narrative Direction',
        body: 'Directing, writing, and editing short films with attention to theme, performance, image design, and rhythm.',
      },
      {
        icon: 'camera',
        title: 'Production Set Practice',
        body: 'Camera operation, lighting, assistant camera, grip, and fast unscripted environments.',
      },
      {
        icon: 'ai',
        title: 'AIGC Hybrid Media',
        body: 'Combining generative AI, 2D/3D animation, live action, and stop motion into cohesive visual systems.',
      },
    ],
    contactTitle: 'Let the next moving image begin with a clear idea.',
    contactBody:
      'Available for short films, music videos, branded moving images, post-production editing, AIGC visual experiments, and hybrid-media projects.',
    footerLinks: ['Email', 'Phone', 'Los Angeles'],
  },
};

const iconMap = {
  edit: Scissors,
  film: Clapperboard,
  camera: Camera,
  ai: Cpu,
};

function App() {
  const [language, setLanguage] = useState('zh');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [navPill, setNavPill] = useState({ left: 0, width: 0, visible: false });
  const appRef = useRef(null);
  const navRef = useRef(null);
  const navItemRefs = useRef([]);
  const t = copy[language];
  const otherLanguage = language === 'zh' ? 'en' : 'zh';
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'; }, [language]);

  const navTargets = useMemo(
    () => ['hero', 'about', 'projects', 'strengths', 'contact'],
    []
  );

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const probe = window.innerHeight * 0.42;
      let next = 0;
      navTargets.forEach((id, index) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= probe) next = index;
      });
      setActiveSection(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [navTargets]);

  useEffect(() => {
    const nav = navRef.current;
    const link = navItemRefs.current[activeSection];
    if (!nav || !link) return undefined;
    const updatePill = () => {
      setNavPill({
        left: link.offsetLeft,
        width: link.offsetWidth,
        visible: true,
      });
    };
    updatePill();
    const observer = new ResizeObserver(updatePill);
    observer.observe(nav);
    window.addEventListener('resize', updatePill);
    document.fonts?.ready.then(updatePill);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePill);
    };
  }, [activeSection, language]);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 701px)',
      },
      (context) => {
        const { reduceMotion, desktop } = context.conditions;
        const sectionConfigs = [
          {
            section: '#about',
            lead: '.portrait-wrap',
            text: '.about-copy .section-label, .about-copy h2, .about-copy > p, .education',
            items: '.detail-list > div, .stat-card',
          },
          {
            section: '#projects',
            lead: '.projects-heading',
            text: null,
            items: '.gallery-reveal',
          },
          {
            section: '#strengths',
            lead: '.section-heading .section-label',
            text: '.section-heading h2',
            items: '.strength-card',
          },
          {
            section: '#contact',
            lead: '.contact-copy-glass .section-label',
            text: '.contact-copy-glass h2, .contact-copy-glass > p',
            items: '.contact-panel > *',
          },
        ];

        sectionConfigs.forEach((config, index) => {
          const section = appRef.current?.querySelector(config.section);
          if (!section) return;

          const lead = config.lead ? gsap.utils.toArray(config.lead, section) : [];
          const text = config.text ? gsap.utils.toArray(config.text, section) : [];
          const items = config.items ? gsap.utils.toArray(config.items, section) : [];
          const targets = [...lead, ...text, ...items];
          if (!targets.length) return;

          if (reduceMotion) {
            gsap.set(targets, { autoAlpha: 1, x: 0, y: 0, clearProps: 'transform,visibility,opacity' });
            return;
          }

          gsap.set(targets, {
            autoAlpha: 0,
            y: desktop ? 54 : 34,
            willChange: 'transform,opacity',
          });
          if (config.section === '#projects') {
            gsap.set(items, { x: desktop ? 42 : 20, y: desktop ? 48 : 28 });
          }

          const timeline = gsap.timeline({
            paused: true,
            defaults: { duration: 0.8, ease: 'power3.out', overwrite: 'auto' },
            onComplete: () => gsap.set(targets, { clearProps: 'willChange' }),
            onReverseComplete: () => gsap.set(targets, { willChange: 'transform,opacity' }),
          });

          if (lead.length) timeline.to(lead, { autoAlpha: 1, x: 0, y: 0 }, 0);
          if (text.length) {
            timeline.to(text, { autoAlpha: 1, y: 0, stagger: 0.11 }, lead.length ? 0.16 : 0);
          }
          if (items.length) {
            timeline.to(
              items,
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.72,
                stagger: { each: desktop ? 0.09 : 0.06, from: 'start' },
              },
              text.length ? 0.34 : 0.18
            );
          }

          ScrollTrigger.create({
            id: `section-reveal-${index}`,
            trigger: section,
            start: 'top 78%',
            end: 'bottom 18%',
            animation: timeline,
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
            refreshPriority: index,
          });
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    );

    return () => media.revert();
  }, { scope: appRef, dependencies: [language], revertOnUpdate: true });

  const magnetProps = {
    padding: 42,
    magnetStrength: 9,
    activeTransition: 'transform 180ms ease-out',
    inactiveTransition: 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
    wrapperClassName: 'magnet-wrap',
    innerClassName: 'magnet-inner',
  };

  const handleContactPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--contact-cursor-x',
      `${event.clientX - rect.left}px`
    );
    event.currentTarget.style.setProperty(
      '--contact-cursor-y',
      `${event.clientY - rect.top}px`
    );
    event.currentTarget.style.setProperty('--contact-cursor-opacity', '1');
  };

  const handleContactPointerLeave = (event) => {
    event.currentTarget.style.setProperty('--contact-cursor-opacity', '0');
  };

  return (
    <main ref={appRef} lang={language === 'zh' ? 'zh-CN' : 'en'} data-language={language}>
      <header className="topbar">
        <Magnet {...magnetProps} padding={34} magnetStrength={12}>
          <a className="brand" href="#hero" aria-label="Qingyang Huang home">
            <span className="brand-crop"><img src="./assets/qh-original.png" alt="QH" /></span>
          </a>
        </Magnet>
        <nav className="nav" ref={navRef} aria-label="Primary navigation">
          <span
            className={`nav-indicator${navPill.visible ? ' is-ready' : ''}`}
            style={{ transform: `translateX(${navPill.left}px)`, width: navPill.width }}
            aria-hidden="true"
          />
          {t.nav.map((item, index) => (
            <a
              key={navTargets[index]}
              ref={(node) => { navItemRefs.current[index] = node; }}
              href={`#${navTargets[index]}`}
              className={activeSection === index ? 'is-active' : ''}
              aria-current={activeSection === index ? 'location' : undefined}
              onClick={() => setActiveSection(index)}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="top-actions">
          <Magnet {...magnetProps}>
            <button
              className="icon-button"
              type="button"
              onClick={() => setLanguage(otherLanguage)}
              aria-label="Switch language"
              title="Switch language"
            >
              <Languages size={17} />
              <span>{t.lang}</span>
            </button>
          </Magnet>
          <Magnet {...magnetProps}>
            <a className="contact-button" href="mailto:huangqingyang33@gmail.com">
              <span>{t.contact}</span>
              <span className="button-orb">
                <ArrowUpRight size={17} />
              </span>
            </a>
          </Magnet>
        </div>
      </header>

      <section className="hero" id="hero">
        <HeroReel language={language} />

        <div className="hero-content page-shell">
          <div className="hero-copy">
            <p className="eyebrow">{t.heroKicker}</p>
            <h1 className={language === 'zh' ? 'hero-title zh-title' : 'hero-title en-title'}>
              <WarpText
                text={t.heroTitle}
                color="#fbfbf5"
                warpStrength={0.055}
                warpScale={1.65}
                speed={0.42}
                pointerInfluence={0.38}
                pointerStrength={0.33}
                refraction={0.012}
                ripple
                fontSize={language === 'zh' ? 'clamp(5.5rem, 9vw, 9rem)' : 'clamp(3rem, 5.5vw, 6rem)'}
                fontWeight={900}
                letterSpacing={language === 'zh' ? '-0.04em' : '-0.055em'}
                lineHeight={0.92}
                textAlign={language === 'en' ? 'left' : 'center'}
                className="hero-name-warp"
              />
            </h1>
            <p className="hero-subtitle">{t.heroSubtitle}</p>
            <div className="hero-actions">
              <Magnet {...magnetProps} padding={46} magnetStrength={8}>
                <a href="#projects" className="primary-link">
                  <span>{t.reel}</span>
                  <span className="button-orb">
                    <MonitorPlay size={17} />
                  </span>
                </a>
              </Magnet>
              <span className="action-divider" aria-hidden="true" />
              <Magnet {...magnetProps} padding={42} magnetStrength={9}>
                <a href="#contact" className="secondary-link">
                  {t.contact}
                  <ArrowUpRight size={17} />
                </a>
              </Magnet>
            </div>
          </div>
          <div className="hero-footer">
            <div className="hero-meta" aria-label="Profile highlights">
              {t.heroMeta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <Magnet {...magnetProps} padding={36} magnetStrength={10}>
              <a className="scroll-cue" href="#about" aria-label="Scroll to profile">
                <span />
              </a>
            </Magnet>
          </div>
        </div>
      </section>

      <section className="about section-band" id="about">
        <DeferredEffect className="about-prismatic"><PrismaticBurst animationType="rotate3d" intensity={1.7} speed={.28} distort={.65} rayCount={24} colors={prismColors} mixBlendMode="screen" /></DeferredEffect>
        <div className="page-shell about-grid">
          <div className="portrait-wrap">
            <img src="assets/about-portrait.jpg" alt="Qingyang Huang portrait" loading="lazy" decoding="async" />
          </div>
          <div className="about-copy">
            <p className="section-label">{t.aboutLabel}</p>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutBody}</p>
            <div className="education">
              <h3>{t.educationTitle}</h3>
              {t.education.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="detail-list">
              {t.details.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong className={Array.isArray(item.value) ? 'detail-value stacked' : 'detail-value'}>
                    {Array.isArray(item.value)
                      ? item.value.map((line) => <span key={line}>{line}</span>)
                      : item.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
          <div className="stats-grid">
            {t.stats.map((item) => (
              <div className="stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects section-band" id="projects">
        <DeferredEffect className="projects-rings">
          <MagicRings
            color="#76d6c4"
            colorTwo="#6f7df2"
            ringCount={7}
            speed={0.52}
            attenuation={8.6}
            lineThickness={1.45}
            baseRadius={0.18}
            radiusStep={0.085}
            scaleRate={0.18}
            opacity={0.82}
            blur={0}
            noiseAmount={0.05}
            rotation={-18}
            ringGap={1.38}
            fadeIn={0.64}
            fadeOut={0.52}
            followMouse={false}
            mouseInfluence={0.18}
            hoverScale={1.08}
            parallax={0.03}
            clickBurst={false}
          />
        </DeferredEffect>
        <div className="page-shell">
          <div className="projects-heading">
            <p className="section-label">[{t.projectsLabel}]</p>
          </div>
          <div className="gallery-reveal">
            <CircularGallery items={t.projects} language={language} onOpen={setSelectedProject} />
          </div>
        </div>
      </section>

      {selectedProject !== null && <ProjectDialog key={selectedProject} project={t.projects[selectedProject]} language={language} onClose={() => setSelectedProject(null)} />}

      <section className="strengths section-band" id="strengths">
        <DeferredEffect className="strengths-dots"><DotGrid dotSize={3} gap={24} baseColor="#345b50" activeColor="#91e8d3" proximity={140} shockRadius={220} shockStrength={4} /></DeferredEffect>
        <div className="page-shell">
          <div className="section-heading compact">
            <p className="section-label">{t.strengthsLabel}</p>
            <h2>{t.strengthsTitle}</h2>
          </div>
          <div className="strength-grid">
            {t.strengths.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <StarBorder as="article" className="strength-card" key={item.title} color="#76d6c4" speed="7s" thickness={1.5} backgroundColor="#111b18" borderColor="#ffffff20">
                  <div className="strength-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </StarBorder>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="contact-ending"
        id="contact"
        onPointerMove={handleContactPointerMove}
        onPointerLeave={handleContactPointerLeave}
      >
        <DeferredEffect className="contact-pixel-bg">
          <PixelBlast
            variant="circle"
            pixelSize={5}
            color="#34f5bc"
            patternScale={2.35}
            patternDensity={1.9}
            pixelSizeJitter={0.32}
            enableRipples
            rippleSpeed={0.48}
            rippleThickness={0.1}
            rippleIntensityScale={4.2}
            speed={0.62}
            edgeFade={0.1}
            transparent
          />
        </DeferredEffect>
        <div className="page-shell contact-grid">
          <div className="contact-copy-glass">
            <p className="section-label">{t.contact}</p>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactBody}</p>
          </div>
          <div className="contact-panel">
            <Magnet {...magnetProps} padding={34} magnetStrength={12}>
              <a href="mailto:huangqingyang33@gmail.com">
                <span className="contact-item-icon">
                  <Mail size={20} />
                </span>
                <span className="contact-item-text">huangqingyang33@gmail.com</span>
              </a>
            </Magnet>
            <Magnet {...magnetProps} padding={34} magnetStrength={12}>
              <a href="tel:+17252758768">
                <span className="contact-item-icon">
                  <Phone size={20} />
                </span>
                <span className="contact-item-text">+1 (725) 275-8768</span>
              </a>
            </Magnet>
            <Magnet {...magnetProps} padding={34} magnetStrength={12}>
              <a href="tel:+8618018682238">
                <span className="contact-item-icon">
                  <Phone size={20} />
                </span>
                <span className="contact-item-text">+86 180 1868 2238</span>
              </a>
            </Magnet>
            <span>
              <span className="contact-item-icon">
                <MapPin size={20} />
              </span>
              <span className="contact-item-text contact-location-lines">
                {(language === 'zh'
                  ? ['洛杉矶，美国', '上海，中国']
                  : ['Los Angeles, USA', 'Shanghai, CN']
                ).map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
