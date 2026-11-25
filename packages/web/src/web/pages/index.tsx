import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Award, BookOpen, GraduationCap, Landmark, Mail, MapPin, Menu, Mic, Network, Trophy, X } from 'lucide-react';
import { articles, email, scholar } from './profile-data';
import { copy, sectionIds, type Language, type ProfileCopy } from './profile-copy';

const awardIcons = [Award, Trophy, Landmark];
const preference = 'asja-profile-language';

function External({href, children, className, label}: {href: string; children: ReactNode; className?: string; label?: string}) {
  return <a href={href} className={className} aria-label={label} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight aria-hidden="true" size={15} /></a>;
}

function Portrait({ alt }: { alt: string }) {
  return <figure className="portrait">
    <img className="portrait-photo" src={`${import.meta.env.BASE_URL}images/profile.jpg`} alt={alt} width={1060} height={992} fetchPriority="high" />
  </figure>;
}

function Books({ t }: { t: ProfileCopy }) {
  return <section className="section research-section" id="research" aria-labelledby="research-title"><div className="container">
    <div className="kicker">{t.researchKicker}</div><h2 id="research-title">{t.research}</h2>
    <div className="research theme-topics"><h3>{t.focus}</h3><ol>{t.topics.map(([title,text],i) => <li key={i}><span>{String(i+1).padStart(2,'0')}</span><div><h4>{title}</h4><p>{text}</p></div></li>)}</ol></div>
    <h3 className="subhead"><BookOpen size={19} aria-hidden="true"/> {t.books}</h3>
    <div className="books">
      <article className="book">
        <div className="book-art"><img src={`${import.meta.env.BASE_URL}images/miniimplantati.jpg`} alt="" width={228} height={314} loading="lazy" /></div>
        <div className="book-content"><span className="micro">Naklada Slap · 2022</span><h4 lang="hr">Miniimplantati u kliničkoj praksi</h4><p>{t.bookOne}</p><External className="text-link" href="https://bibliografija.nsk.hr/a/A2022_06-07_v3/index.html">{t.catalog}</External></div>
      </article>
      <article className="book">
        <div className="book-art"><img src={`${import.meta.env.BASE_URL}images/prosthodontic.jpg`} alt="" width={233} height={310} loading="lazy" /></div>
        <div className="book-content"><span className="micro">Mosby · 2013</span><h4 lang="en">Prosthodontic Treatment for Edentulous Patients: Complete Dentures and Implant-Supported Prostheses</h4><p>{t.bookTwo}</p><External className="text-link" href="https://educate.elsevier.com/book/details/9780323078443">{t.publisher}</External></div>
      </article>
    </div>
  </div></section>;
}

function Publications({ t, language }: { t: ProfileCopy; language: Language }) {
  return <section className="section" id="publications" aria-labelledby="publications-title"><div className="container">
    <div className="kicker">{t.scholarly}</div><h2 id="publications-title">{t.publications}</h2>
    <p className="section-intro">{t.publicationIntro}</p>
    <ul className="articles journal-cards" aria-label={t.listLabel}>
      {articles.map(article => {
        const title = language === 'hr' ? article.hr : article.title;
        return <li key={article.doi}><span className="article-year">{article.year}</span><div><h3>{title}</h3><p>{article.journal}</p></div><External href={`https://doi.org/${article.doi}`} className="doi" label={`${t.doi} ${title}`}>DOI</External></li>;
      })}
    </ul>
    <External href={scholar} className="button button-navy publication-button">{t.archive}</External>
  </div></section>;
}

function Contact({ t, language }: { t: ProfileCopy; language: Language }) {
  const [opened, setOpened] = useState(false);
  function compose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get('subject')).trim();
    const body = `${String(data.get('message')).trim()}\n\n${String(data.get('name')).trim()}\n${String(data.get('email')).trim()}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }
  return <section id="contact" className="section contact" aria-labelledby="contact-title"><div className="container contact-layout">
    <div><div className="kicker">{t.correspondence}</div><h2 id="contact-title">{t.contact}</h2><p className="section-intro">{t.contactIntro}</p>
      <address>
        <div><Mail size={20} aria-hidden="true"/><div><span className="micro">{t.email}</span><a href={`mailto:${email}`}>{email}</a></div></div>
        <div><MapPin size={20} aria-hidden="true"/><div><span className="micro">{t.address}</span><p>{t.dept}<br/>{t.affiliation}<br/>Gundulićeva 5, 10000 Zagreb, {t.country}</p><External className="text-link" href={language === 'hr' ? 'https://www.sfzg.unizg.hr/' : 'https://www.sfzg.unizg.hr/en'}>{t.school}</External></div></div>
      </address>
    </div>
    <form className="contact-form" onSubmit={compose}><h3>{t.write}</h3><div className="form-pair"><label>{t.name}<input name="name" autoComplete="name" maxLength={120} required /></label><label>{t.emailField}<input name="email" type="email" autoComplete="email" maxLength={180} required /></label></div><label>{t.subject}<input name="subject" maxLength={160} required /></label><label>{t.message}<textarea name="message" rows={4} maxLength={1600} required /></label><button className="button button-navy" type="submit">{t.submit} <ArrowRight size={16} aria-hidden="true"/></button><p className="form-note" role="status">{opened ? t.fallback : t.note}</p></form>
  </div></section>;
}

export default function Index() {
  const [menu, setMenu] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem(preference) === 'hr' ? 'hr' : 'en'; } catch { return 'en'; }
  });
  const t = copy[language];
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${t.namePrefix} Asja Čelebić | ${t.university}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
    try { localStorage.setItem(preference, language); } catch { /* Leave the in-memory choice intact. */ }
  }, [language, t]);
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'honors') document.getElementById('editorial')?.scrollIntoView({ behavior: 'instant' });
    else if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' });
  }, []);
  return <>
    <a href="#main" className="skip">{t.skip}</a>
    <header className="site-header" onKeyDown={event => { if (event.key === 'Escape' && menu) { setMenu(false); document.getElementById('menu-toggle')?.focus(); } }}>
      <div className="container header-inner">
        <a href="#top" className="brand" onClick={() => setMenu(false)}><span><strong>Asja Čelebić</strong><small>{t.university}</small></span></a>
        <div className="header-actions">
          <nav className={menu ? 'main-nav open' : 'main-nav'} id="main-nav" aria-label={t.navLabel}>{sectionIds.map((id, i) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{t.nav[i]}</a>)}</nav>
          <div className="language-switch" role="group" aria-label={t.language}>
            <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button><span aria-hidden="true">|</span><button type="button" lang="hr" aria-label="Hrvatski" aria-pressed={language === 'hr'} onClick={() => setLanguage('hr')}>HR</button>
          </div>
          <button id="menu-toggle" className="menu-toggle" type="button" aria-expanded={menu} aria-controls="main-nav" aria-label={menu ? t.close : t.open} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>
    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title"><div className="container hero-layout">
        <div className="hero-copy"><div className="kicker hero-kicker">{t.profile} <span /> {t.location}</div><h1 id="hero-title"><span className="prefix">{t.namePrefix}</span>{' '}Asja Čelebić</h1><p className="credentials">{t.role}</p><div className="affiliation"><span className="affiliation-icon"><Landmark size={21} strokeWidth={1.45} aria-hidden="true"/></span><p>{t.dept}<br/>{t.affiliation}</p></div>
          <p className="hero-tagline">{t.tagline}</p>
          <div className="profile-links"><External className="button button-gold" href="https://google.com"><GraduationCap size={18} aria-hidden="true"/> Google Scholar</External><External className="button button-outline" href="https://researchgate.net"><Network size={16} aria-hidden="true"/> ResearchGate</External><External className="button button-outline" href="https://sciencedirect.com"><BookOpen size={16} aria-hidden="true"/> Scopus</External></div>
        </div>
        <Portrait alt={t.portrait} />
      </div><div className="container hero-bottom"><a href="#about" className="discover"><ArrowDown size={14} aria-hidden="true"/> {t.explore}</a><span>{t.school}</span></div></section>
      <div className="impact"><div className="container impact-layout"><div className="impact-heading kicker">{t.impact}</div><dl>{['300+',t.citations,'31+','41+'].map((value,i) => <div key={i}><dt>{t.metrics[i]}</dt><dd>{value}</dd></div>)}</dl></div></div>
      <section id="about" className="section about" aria-labelledby="about-title"><div className="container about-layout">
        <div><div className="kicker">{t.bio}</div><h2 id="about-title">{t.about}</h2><p className="lead">{t.lead}</p></div><p className="bio-copy">{t.aboutText}</p>
      </div></section>
      <Books t={t} />
      <Publications t={t} language={language} />
      <section className="section honors" id="editorial" aria-labelledby="honors-title"><div className="container"><div className="kicker">{t.recognition}</div><h2 id="honors-title">{t.honors}</h2>
        <div className="award-grid">{t.awards.map(([category,title,detail], i) => { const Icon = awardIcons[i]; return <article key={i} className="award"><span className="award-icon"><Icon size={25} strokeWidth={1.45} aria-hidden="true"/></span><span className="micro">{category}</span><h3>{title}</h3><p>{detail}</p></article>; })}</div>
        <div className="editorial-layout awards-editorial">
          <div className="roles"><h3 className="subhead"><BookOpen size={19} aria-hidden="true"/> {t.editorial}</h3><div><span className="micro">{t.editor}</span><p><i>Medicina</i> {t.and} <i>Case Reports in Dentistry</i></p></div><div><span className="micro">{t.board}</span><p><i>Acta Stomatologica Croatica</i> {t.and} <i>Stoma Edu Journal</i></p></div></div>
          <article className="lecture"><h3 className="subhead"><Mic size={19} aria-hidden="true"/> {t.lectures}</h3><span className="micro">{t.association} · 2023</span><h4>{t.lectureTitle}</h4><p>{t.lectureDetail}</p><External href="https://webinars.edu.gr/en/webinar-epa-23/" className="text-link">{t.webinar}</External></article>
        </div>
      </div></section>
      <Contact t={t} language={language} />
    </main>
    <footer className="footer"><div className="container footer-inner"><div className="brand"><span><strong>Asja Čelebić</strong><small>{t.role} · {t.university}</small></span></div><a href="#top" className="back-top">{t.back} <ArrowUp size={15} aria-hidden="true"/></a></div></footer>
  </>;
}
