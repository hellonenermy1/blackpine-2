import fs from 'node:fs/promises';
import path from 'node:path';
import { site, services, research, trustPages } from './src/content.mjs';
import { layout, topologyGraphic, serviceRows, researchRows } from './src/templates.mjs';

const out = new URL('./dist/', import.meta.url);
const src = new URL('./src/', import.meta.url);
const pub = new URL('./public/', import.meta.url);
const routes = [];

const esc = (v='') => String(v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const slugify = s => s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const sectionId = s => slugify(s);

async function writeRoute(route, html, indexable = true) {
  const clean = route === '/' ? '' : route.replace(/^\//,'').replace(/\/$/,'');
  const dir = new URL(`./${clean ? clean + '/' : ''}`, out);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(new URL('./index.html', dir), html);
  if (indexable) routes.push(route);
}

function pageHero({eyebrow, title, lead, meta=''}) {
  return `<section class="page-hero"><div class="shell page-hero-grid"><div><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p></div>${meta ? `<aside class="page-meta">${meta}</aside>` : topologyGraphic('page-topology')}</div></section>`;
}

function home() {
  const body = `
  <section class="hero"><div class="hero-inner"><div class="hero-copy"><span class="eyebrow">Canada / Security Engineering</span><h1>Security engineering for systems that matter.</h1><p class="lead">Blackpine helps organizations assess exposure, strengthen identity and cloud controls, prepare for incidents, and respond to security failures with clear evidence and defined scope.</p><div class="actions"><a class="button" href="/contact/">Discuss a security requirement</a><a class="button secondary" href="/services/">Explore capabilities</a></div></div><div class="hero-visual">${topologyGraphic()}<span class="visual-caption">BLACKPINE / CONTROL SURFACE 02</span></div></div></section>
  <div class="authority"><div class="authority-inner"><div class="authority-item">Canada-based</div><div class="authority-item">Security assessment</div><div class="authority-item">Incident response</div><div class="authority-item">Research & engineering</div></div></div>
  <section class="section" data-reveal><div class="shell"><div class="section-head"><div class="section-label">Capabilities</div><div><h2>Work organized around the systems attackers actually use.</h2><p>Identity, email, administrative access, cloud services, websites, incident readiness, and recovery are treated as connected controls rather than isolated checklist items.</p></div></div>${serviceRows()}</div></section>
  <section class="section" data-reveal><div class="shell method-grid"><div class="method-copy"><span class="eyebrow">Method</span><h2>Evidence before theatre.</h2><p>Blackpine engagements start by defining the decision, scope, authority, and evidence available. Findings are separated from assumptions, prioritized by consequence, and written for the people who need to act.</p><ul class="method-list"><li><span>01</span><div>Scope the systems, authority, priorities, and constraints.</div></li><li><span>02</span><div>Observe agreed controls and preserve relevant evidence.</div></li><li><span>03</span><div>Analyze the path from weakness to business consequence.</div></li><li><span>04</span><div>Prioritize actions, ownership, and verification.</div></li></ul></div><div>${topologyGraphic()}</div></div></section>
  <section class="photo-band" data-reveal><img src="${site.infrastructureImage}" alt="A dark server environment representing business-critical digital infrastructure" width="1600" height="1067" loading="lazy" decoding="async"><div class="photo-band-content"><div class="shell"><span class="eyebrow">Blackpine Labs</span><h2>Build security technology. Document the model. State the limits.</h2><p>Blackpine Cipher is developed as a separate security application and documented independently from the corporate marketing site.</p><div class="actions"><a class="button" href="/labs/cipher/">Explore Cipher</a><a class="button secondary" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a></div></div></div></section>
  <section class="section" data-reveal><div class="shell"><div class="section-head"><div class="section-label">Research</div><div><h2>Technical material with a reason to exist.</h2><p>Research, advisories, engineering notes, and practical guides focus on specific security decisions rather than publishing generic cybersecurity content for volume.</p></div></div>${researchRows(research.slice(0,4))}<div class="actions"><a class="button secondary" href="/research/">View all research</a></div></div></section>
  <section class="section compact" data-reveal><div class="shell callout"><div><span class="eyebrow">Trust</span><h2>Security claims should be inspectable.</h2><p>Review Blackpine's public security practices, data-handling principles, responsible disclosure process, and website-security baseline.</p></div><a class="button secondary" href="/trust/">Open Trust Center</a></div></section>
  <section class="section" data-reveal><div class="shell"><div class="callout"><div><span class="eyebrow">Contact</span><h2>Bring the problem. We’ll define the scope.</h2><p>Use the public intake for an initial conversation. Do not submit passwords, private keys, regulated records, or sensitive incident evidence.</p></div><a class="button" href="/contact/">Contact Blackpine</a></div></div></section>`;
  return layout({ title: 'Blackpine Cybersecurity | Security Engineering in Canada', description: site.description, path: '/', body });
}

function servicesIndex() {
  const body = pageHero({eyebrow:'Services', title:'Security work with defined scope and useful outputs.', lead:'Blackpine organizes services around the systems, identities, and response decisions that create practical business risk — not around a catalogue of fashionable security terms.'}) +
  `<section class="section"><div class="shell">${serviceRows(services)}</div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Need a defined starting point?</h2><p>Engagement models explain how focused reviews, broader assessments, incident support, and advisory work can be scoped without forcing every organization into a preset package.</p></div><a class="button secondary" href="/engagements/">Engagement models</a></div></section>`;
  return layout({ title:'Cybersecurity Services in Canada | Blackpine Cybersecurity', description:'Security assessments, identity and email security, cloud and SaaS security, website administrative security, incident response, readiness, and advisory services.', path:'/services/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Services',href:'/services/'}] });
}

function servicePage(s) {
  const navLinks = ['When to involve Blackpine','What we review','How the engagement works','What you receive','Illustrative finding','Boundaries'];
  const body = pageHero({eyebrow:'Services', title:s.title, lead:s.intro, meta:`<strong>Service area</strong>${esc(s.short)}<br><br><a href="/contact/?service=${encodeURIComponent(s.slug)}">Discuss this service →</a>`}) +
  `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${navLinks.map(t=>`<a href="#${sectionId(t)}">${esc(t)}</a>`).join('')}</aside><article class="prose">
    <h2 id="${sectionId(navLinks[0])}">${navLinks[0]}</h2><ul>${s.when.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[1])}">${navLinks[1]}</h2><ul>${s.review.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[2])}">${navLinks[2]}</h2><div class="spec-list">${s.method.map((x,i)=>`<div class="spec-item"><strong>${String(i+1).padStart(2,'0')}</strong><span>${esc(x)}</span></div>`).join('')}</div>
    <h2 id="${sectionId(navLinks[3])}">${navLinks[3]}</h2><ul>${s.deliverables.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    <div class="sample-finding" id="${sectionId(navLinks[4])}"><span class="sample-label">Illustrative finding — not client data</span><div class="sample-grid"><div><small>Area</small><p>${esc(s.sample.area)}</p></div><div><small>Observation</small><p>${esc(s.sample.finding)}</p></div><div><small>Why it matters</small><p>${esc(s.sample.consequence)}</p></div><div><small>Example action</small><p>${esc(s.sample.action)}</p></div></div></div>
    <h2 id="${sectionId(navLinks[5])}">${navLinks[5]}</h2><div class="notice"><strong>Scope matters.</strong><p>${esc(s.boundary)}</p></div>
    <h2>Related research</h2>${researchRows(research.filter(r=> r.topic.toLowerCase().includes('incident') === s.slug.includes('incident') || r.topic.toLowerCase().includes('identity') === s.slug.includes('identity')).slice(0,3).length ? research.filter(r=> r.topic.toLowerCase().includes('incident') === s.slug.includes('incident') || r.topic.toLowerCase().includes('identity') === s.slug.includes('identity')).slice(0,3) : research.slice(0,3))}
  </article></div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Discuss ${esc(s.title.toLowerCase())}.</h2><p>Start with the system, concern, and business context. Scope and authorization are confirmed before review work begins.</p></div><a class="button" href="/contact/?service=${encodeURIComponent(s.slug)}">Contact Blackpine</a></div></section>`;
  return layout({ title:`${s.title} | Blackpine Cybersecurity Canada`, description:s.short, path:`/services/${s.slug}/`, body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Services',href:'/services/'},{label:s.title,href:`/services/${s.slug}/`}] });
}

function engagements() {
  const models = [
    ['Focused Review','A narrowly scoped review of a defined system, control family, or security question.'],
    ['Security Assessment','A broader evidence-based review across agreed systems, controls, and business processes.'],
    ['Incident Engagement','Time-sensitive support for triage, containment, evidence, recovery, and post-incident priorities within an agreed scope.'],
    ['Advisory Engagement','Decision support for roadmaps, vendors, policies, remediation, and security priorities.'],
    ['Ongoing Review','Periodic review can be scoped when there is a real recurring need; it is not positioned as a generic subscription by default.']
  ];
  const body = pageHero({eyebrow:'Engagements', title:'Scope the work around the problem — not a package name.', lead:'Blackpine uses engagement models as starting points. Exact scope, access, timing, deliverables, responsibilities, and fees belong in the written engagement terms.'}) +
  `<section class="section"><div class="shell"><div class="service-rows">${models.map((m,i)=>`<div class="service-row"><span class="service-index">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(m[0])}</strong><small>${esc(m[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>No one-size-fits-all promises.</strong><p>An inquiry does not create a client relationship. The correct engagement depends on the environment, authorization, data sensitivity, urgency, and the outcome required.</p></div></div></section>`;
  return layout({title:'Cybersecurity Engagement Models | Blackpine Cybersecurity', description:'How Blackpine scopes focused reviews, security assessments, incident support, advisory work, and recurring reviews.', path:'/engagements/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Engagements',href:'/engagements/'}]});
}

function researchIndex() {
  const types = [...new Set(research.map(r=>r.type))];
  const topics = [...new Set(research.map(r=>r.topic))];
  const body = pageHero({eyebrow:'Research', title:'Specific security questions. Useful answers.', lead:'Blackpine Research publishes technical guides and engineering notes where the subject is specific enough to be useful. We do not publish generic cybersecurity content simply to fill a calendar.'}) +
  `<section class="section"><div class="shell"><div class="filter-bar"><div class="filter-field"><label for="type-filter">Type</label><select id="type-filter" data-filter-type><option value="all">All types</option>${types.map(x=>`<option>${esc(x)}</option>`).join('')}</select></div><div class="filter-field"><label for="topic-filter">Topic</label><select id="topic-filter" data-filter-topic><option value="all">All topics</option>${topics.map(x=>`<option>${esc(x)}</option>`).join('')}</select></div></div>${researchRows(research)}</div></section>`;
  return layout({title:'Cybersecurity Research & Technical Guides | Blackpine', description:'Blackpine cybersecurity research, engineering notes, incident response guidance, identity security analysis, and practical technical guides.', path:'/research/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Research',href:'/research/'}]});
}

function researchPage(r) {
  const onPage = r.sections.map(s=>s.heading);
  const body = `<article itemprop="mainEntityOfPage">${pageHero({eyebrow:`${r.type} / ${r.topic}`, title:r.title, lead:r.dek, meta:`<strong itemprop="author">Blackpine Research</strong><time itemprop="datePublished" datetime="${r.date}">${r.date}</time><br>${esc(r.readTime)} read<meta itemprop="dateModified" content="${r.updated}"><meta itemprop="headline" content="${esc(r.title)}"><meta itemprop="image" content="${esc(site.ogImage)}">`})}
  <section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${onPage.map(t=>`<a href="#${sectionId(t)}">${esc(t)}</a>`).join('')}<a href="#sources">Sources</a></aside><div class="prose" itemprop="articleBody">
  ${r.sections.map(s=>`<h2 id="${sectionId(s.heading)}">${esc(s.heading)}</h2>${(s.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('')}${s.bullets ? `<ul>${s.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>`:''}`).join('')}
  <h2 id="sources">Sources and further reading</h2><ul>${r.sources.map(([label,url])=>`<li><a href="${esc(url)}" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>
  <div class="notice"><strong>Scope note.</strong><p>This publication is general technical information, not incident-specific advice and not a substitute for an authorized investigation of your environment.</p></div>
  </div></div></section></article>`;
  return layout({title:`${r.title} | Blackpine Research`, description:r.dek, path:`/research/${r.slug}/`, body, type:'article', breadcrumbItems:[{label:'Home',href:'/'},{label:'Research',href:'/research/'},{label:r.title,href:`/research/${r.slug}/`}], articleMeta:r});
}

function labsIndex() {
  const body = pageHero({eyebrow:'Labs', title:'Security work should include building and testing ideas — not only describing them.', lead:'Blackpine Labs is the home for genuine technical projects. It stays intentionally small: a project appears here only when there is something real to document.'}) +
  `<section class="photo-band"><img src="${site.infrastructureImage}" alt="Dark server hardware representing engineered digital infrastructure" width="1600" height="1067" loading="eager" decoding="async"><div class="photo-band-content"><div class="shell"><span class="eyebrow">Project 01</span><h2>Blackpine Cipher</h2><p>A separate encryption application with its own threat model, verification surfaces, and technical documentation.</p><div class="actions"><a class="button" href="/labs/cipher/">Project overview</a><a class="button secondary" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a></div></div></div></section>`;
  return layout({title:'Blackpine Labs | Security Engineering Projects', description:'Blackpine Labs documents genuine security engineering projects including Blackpine Cipher.', path:'/labs/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Labs',href:'/labs/'}]});
}

function cipherPage() {
  const body = pageHero({eyebrow:'Labs / Cipher', title:'Blackpine Cipher', lead:'A separate Blackpine security application for file encryption. The corporate site introduces the project; technical claims belong in the project’s security model and application documentation.'}) +
  `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Project</span><a href="#separation">Separation</a><a href="#principles">Principles</a><a href="#model">Security model</a><a href="#application">Application</a></aside><div class="prose"><h2 id="separation">Separated by design</h2><p>Cipher is hosted separately from the Blackpine corporate site. Marketing analytics, advertising scripts, and unrelated third-party JavaScript must not be inherited by the cryptographic application.</p><h2 id="principles">Project principles</h2><ul><li>Threat-model language should remain precise and avoid absolute claims such as “unbreakable”.</li><li>Security-sensitive behavior should be documented and testable.</li><li>Cryptographic design and implementation claims should be supported by the repository, tests, or independent review — not marketing copy.</li><li>Verification and support surfaces remain separate from the corporate site and from the Cipher application.</li></ul><h2 id="model">Security model</h2><p>The project security model is maintained as its own documentation because it changes with the application architecture. The corporate website should not duplicate rapidly changing cryptographic details that could become inconsistent.</p><div class="actions"><a class="button secondary" href="/labs/cipher/security-model/">Security model overview</a></div><h2 id="application">Application</h2><p>Use the dedicated Cipher hostname for the application itself.</p><div class="actions"><a class="button" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a><a class="button secondary" href="https://verify.blackpinecybersecurity.com">Verify ↗</a></div></div></div></section>`;
  return layout({title:'Blackpine Cipher | Blackpine Labs', description:'Project overview for Blackpine Cipher and its separation from the corporate website, verification, and support surfaces.', path:'/labs/cipher/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Labs',href:'/labs/'},{label:'Cipher',href:'/labs/cipher/'}]});
}

function cipherSecurityModel() {
  const body = pageHero({eyebrow:'Labs / Cipher', title:'Cipher security model — public overview', lead:'This page intentionally describes boundaries and documentation principles rather than making cryptographic claims that belong to the application repository and verified technical documentation.'}) +
  `<section class="section"><div class="shell prose"><h2>Public boundary</h2><p>The corporate website does not act as the authoritative specification for Cipher cryptography. Cipher’s implementation, threat model, test vectors, verification workflow, and release-specific security claims must be derived from the current project repository and release documentation.</p><h2>What this site can state safely</h2><ul><li>Cipher is separated from the main marketing site.</li><li>The Cipher surface should not load advertising, marketing analytics, or unrelated third-party JavaScript.</li><li>Verification and support operate on separate hostnames.</li><li>Security claims must avoid absolute language and must remain traceable to tested implementation details.</li></ul><h2>Why the distinction matters</h2><p>Cryptographic systems change. A marketing page that copies implementation details can silently become wrong after an engineering change. Blackpine therefore treats the current application documentation as the authoritative source.</p></div></section>`;
  return layout({title:'Blackpine Cipher Security Model | Public Overview', description:'Public overview of the documentation and trust boundaries for Blackpine Cipher.', path:'/labs/cipher/security-model/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Labs',href:'/labs/'},{label:'Cipher',href:'/labs/cipher/'},{label:'Security Model',href:'/labs/cipher/security-model/'}]});
}

function trustIndex() {
  const body = pageHero({eyebrow:'Trust', title:'Trust should be documented, not decorated.', lead:'Blackpine publishes public information about website security, client-data handling, responsible disclosure, and the boundaries between corporate, support, verification, and Cipher systems.'}) +
  `<section class="section"><div class="shell"><div class="service-rows">${trustPages.map((p,i)=>`<a class="service-row" href="/trust/${p.slug}/"><span class="service-index">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(p.title)}</strong><small>${esc(p.intro)}</small></span><span class="row-arrow">↗</span></a>`).join('')}</div><div class="notice"><strong>No borrowed trust badges.</strong><p>Blackpine does not display SOC 2, ISO, audit, partner, insurance, award, or certification claims unless they are actually held and publishable.</p></div></div></section>`;
  return layout({title:'Blackpine Trust Center | Security, Data & Disclosure', description:'Public Blackpine security practices, data-handling principles, responsible disclosure guidance, and website security information.', path:'/trust/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Trust',href:'/trust/'}]});
}

function trustPage(p) {
  const body = pageHero({eyebrow:'Trust', title:p.title, lead:p.intro}) +
  `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${p.sections.map(([h])=>`<a href="#${sectionId(h)}">${esc(h)}</a>`).join('')}</aside><div class="prose">${p.sections.map(([h,paras])=>`<h2 id="${sectionId(h)}">${esc(h)}</h2>${paras.map(x=>`<p>${esc(x)}</p>`).join('')}`).join('')}</div></div></section>`;
  return layout({title:`${p.title} | Blackpine Trust`, description:p.intro, path:`/trust/${p.slug}/`, body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Trust',href:'/trust/'},{label:p.title,href:`/trust/${p.slug}/`}]});
}

function about() {
  const body = pageHero({eyebrow:'Company', title:'Blackpine Cybersecurity', lead:'A Canada-based cybersecurity firm focused on clear scope, technically defensible work, and security decisions that can be acted on.'}) +
  `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Company</span><a href="#position">Position</a><a href="#principles">Principles</a><a href="#services-labs">Services & Labs</a><a href="#claims">Claims</a></aside><div class="prose"><h2 id="position">Security engineering rather than security theatre</h2><p>Blackpine is being built around a simple idea: competence should be demonstrated through scope, evidence, engineering, documentation, and useful outputs instead of exaggerated security language. The corporate site is designed to communicate with business owners, enterprise IT teams, and security professionals at different depths without pretending those audiences need the same amount of detail.</p><h2 id="principles">Operating principles</h2><ul><li>Confirm scope and authorization before security work begins.</li><li>Use evidence and stated assumptions instead of fear-based claims.</li><li>Minimize collection of sensitive information during public intake.</li><li>Write findings so technical teams and decision-makers can act on them.</li><li>State limitations directly. No assessment guarantees future security.</li><li>Keep security-sensitive products separated from marketing dependencies.</li></ul><h2 id="services-labs">Services and Labs</h2><p>Services address client security requirements such as assessment, identity and cloud controls, incident response, readiness, and advisory work. Blackpine Labs exists for genuine technical projects such as Cipher. Labs material is not used to inflate the scope of consulting services that Blackpine does not actually provide.</p><h2 id="claims">A strict rule for claims</h2><p>Blackpine does not invent client logos, office locations, awards, certifications, response commitments, partnerships, team scale, or research credentials to look larger. Any such claim must be verified before publication.</p><div class="actions"><a class="button secondary" href="/trust/">Review Trust Center</a><a class="button" href="/contact/">Contact Blackpine</a></div></div></div></section>`;
  return layout({title:'About Blackpine Cybersecurity | Canada', description:'About Blackpine Cybersecurity, its security engineering approach, operating principles, services, labs, and public trust standards.', path:'/company/about/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Company',href:'/company/about/'},{label:'About',href:'/company/about/'}]});
}

function whoWeWorkWith() {
  const groups = [
    ['Enterprise & internal IT teams','Independent assessment, identity and cloud review, incident readiness, and security decisions that need clear technical documentation.'],
    ['Growing technology companies','Security foundations, administrative-access review, cloud/SaaS risk, customer diligence preparation, and incident readiness.'],
    ['Professional services','Email, identity, client-data workflows, vendor access, administrative systems, and business continuity.'],
    ['Legal and confidentiality-sensitive teams','Account security, email compromise exposure, remote access, vendor dependencies, and incident preparation.'],
    ['Healthcare and private clinics','Identity, cloud services, staff access, operational resilience, and sensitive information workflows — with scope defined around applicable obligations.'],
    ['Commerce and transaction-driven teams','Email impersonation, payment-change workflows, cloud and SaaS access, administrative accounts, and recovery readiness.']
  ];
  const body = pageHero({eyebrow:'Company', title:'Who we work with', lead:'Blackpine does not create an “industry practice” page simply because a sector name is useful for SEO. This page describes environments where the current service model can be relevant without pretending to hold experience that has not been verified.'}) +
  `<section class="section"><div class="shell"><div class="service-rows">${groups.map((g,i)=>`<div class="service-row"><span class="service-index">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(g[0])}</strong><small>${esc(g[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>Sector claims require evidence.</strong><p>Dedicated industry pages should be created only when Blackpine has enough unique experience, regulatory context, case material, or research to make the page genuinely useful.</p></div></div></section>`;
  return layout({title:'Who Blackpine Works With | Cybersecurity Services', description:'Business and technology environments where Blackpine cybersecurity assessment, identity, cloud, incident response, and advisory services may be relevant.', path:'/company/who-we-work-with/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Company',href:'/company/about/'},{label:'Who we work with',href:'/company/who-we-work-with/'}]});
}

function careers() {
  const body = pageHero({eyebrow:'Company', title:'Careers', lead:'Blackpine does not publish placeholder vacancies. Current openings will appear here only when there is a real role, scope, location model, and application process.'}) +
  `<section class="section"><div class="shell"><div class="callout"><div><h2>No public openings listed.</h2><p>If Blackpine begins recruiting, this page will describe the actual role and working arrangement rather than collecting speculative applications indefinitely.</p></div><a class="button secondary" href="mailto:${site.careersEmail}">Careers contact</a></div></div></section>`;
  return layout({title:'Careers | Blackpine Cybersecurity', description:'Current career opportunities and recruiting information for Blackpine Cybersecurity.', path:'/company/careers/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Company',href:'/company/about/'},{label:'Careers',href:'/company/careers/'}]});
}

function contact() {
  const body = pageHero({eyebrow:'Contact', title:'Start with the problem, not a package.', lead:'Tell Blackpine what system, concern, or security decision you need help with. The public form is for initial intake only; scope, authorization, sensitive evidence exchange, timing, and engagement terms are handled separately.'}) +
  `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Contact</span><a href="#inquiry">Inquiry</a><a href="#active-incident">Active incident</a><a href="#sensitive-data">Sensitive data</a></aside><div class="prose"><h2 id="inquiry">General security inquiry</h2><form name="contact" method="POST" data-netlify="true" netlify-honeypot="company-website" action="/contact/thanks/"><input type="hidden" name="form-name" value="contact"><p class="hidden-field"><label>Do not fill this out: <input name="company-website"></label></p><div class="form-grid"><div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required></div><div class="form-field"><label for="email">Work email</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="form-field"><label for="organization">Organization</label><input id="organization" name="organization" autocomplete="organization"></div><div class="form-field"><label for="intent">Reason for inquiry</label><select id="intent" name="intent" required><option value="">Select one</option><option>Security assessment</option><option>Identity / email security</option><option>Cloud / SaaS security</option><option>Website / administrative security</option><option>Incident response</option><option>Incident readiness</option><option>Security advisory</option><option>Other</option></select></div><div class="form-field full"><label for="message">What do you need help with?</label><textarea id="message" name="message" required></textarea><span class="form-note">Do not include passwords, private keys, regulated records, full log exports, confidential client files, or sensitive incident evidence.</span></div><div class="form-field full"><label class="checkbox"><input type="checkbox" name="consent" required><span>I agree to be contacted by Blackpine about this inquiry.</span></label></div><div class="form-field full"><button class="button" type="submit">Submit inquiry</button></div></div></form><h2 id="active-incident">Active incident</h2><p>The website is not a 24/7 emergency hotline and submitting the form does not guarantee immediate response. Preserve relevant evidence where safe, avoid unnecessary destructive changes, and indicate “Incident response” in the form so the inquiry is triaged correctly.</p><h2 id="sensitive-data">Sensitive data</h2><p>Public intake is deliberately minimal. A suitable exchange method can be established after the scope and authorized participants are confirmed.</p></div></div></section>`;
  return layout({title:'Contact Blackpine Cybersecurity | Canada', description:'Contact Blackpine about security assessment, identity and cloud security, incident response, readiness, or security advisory requirements.', path:'/contact/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Contact',href:'/contact/'}]});
}

function thanks() {
  const body = pageHero({eyebrow:'Contact', title:'Inquiry received.', lead:'Thank you. Submission confirms receipt only; it does not create a client engagement or confirm response timing.'}) + `<section class="section compact"><div class="shell callout"><div><h2>Do not send sensitive evidence by reply unless an appropriate exchange method has been agreed.</h2></div><a class="button secondary" href="/">Return home</a></div></section>`;
  return layout({title:'Inquiry Received | Blackpine Cybersecurity', description:'Blackpine inquiry confirmation.', path:'/contact/thanks/', body, noindex:true, breadcrumbItems:[{label:'Home',href:'/'},{label:'Contact',href:'/contact/'},{label:'Thanks',href:'/contact/thanks/'}]});
}

function privacy() {
  const body = pageHero({eyebrow:'Legal', title:'Privacy', lead:'Blackpine aims to collect only the personal information necessary to respond to inquiries and operate the website. This page must remain aligned with the actual production services used.'}) +
  `<!-- REVIEW BEFORE PRODUCTION: qualified legal review required. --><section class="section"><div class="shell prose"><h2>Website inquiries</h2><p>Information submitted through the contact form may be used to review the inquiry, communicate with the sender, and arrange next steps. The public form is not intended for sensitive incident evidence, passwords, private keys, regulated records, or confidential client documents.</p><h2>Service providers</h2><p>The deployed privacy notice must name or accurately describe the real hosting, form-processing, email, analytics, and other providers used by the production site. The V2 baseline intentionally avoids advertising networks, marketing trackers, tag managers, and remote web fonts.</p><h2>Analytics</h2><p>No third-party analytics are included in the V2 baseline. If analytics are added later, this notice must be updated before collection begins and the implementation must be reviewed for consent and legal requirements that apply to the deployment.</p><h2>Retention and access</h2><p>Retention periods and access procedures must reflect the actual operational process rather than a generic policy template. Blackpine will not publish an invented retention period for the appearance of completeness.</p><h2>Contact</h2><p>Privacy questions can be directed to <a href="mailto:${site.email}">${site.email}</a>.</p></div></section>`;
  return layout({title:'Privacy | Blackpine Cybersecurity', description:'Blackpine Cybersecurity website privacy information and public intake principles.', path:'/legal/privacy/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Legal',href:'/legal/privacy/'},{label:'Privacy',href:'/legal/privacy/'}]});
}

function terms() {
  const body = pageHero({eyebrow:'Legal', title:'Website Terms', lead:'General terms for the Blackpine corporate website. Professional security work requires a separate written engagement defining scope, authorization, responsibilities, limitations, fees, and communications.'}) +
  `<!-- REVIEW BEFORE PRODUCTION: qualified legal review required. --><section class="section"><div class="shell prose"><h2>Website information</h2><p>Website material is general information and does not create a client relationship, professional engagement, or authorization to access systems. Security advice depends on specific facts and agreed scope.</p><h2>Professional services</h2><p>Any professional services should be governed by written terms that define the engagement, systems and actions authorized, responsibilities, communication channels, and applicable limitations.</p><h2>No guarantee of security</h2><p>No website content, assessment, recommendation, or technical control should be interpreted as a guarantee that compromise, loss, fraud, disruption, or future security incidents can be fully prevented.</p><h2>Research content</h2><p>Blackpine Research is general technical information unless a separate engagement states otherwise. Readers are responsible for evaluating applicability to their environment and authorization.</p><h2>Contact</h2><p>Questions can be directed to <a href="mailto:${site.email}">${site.email}</a>.</p></div></section>`;
  return layout({title:'Website Terms | Blackpine Cybersecurity', description:'General website terms for Blackpine Cybersecurity. Professional services require separate written engagement terms.', path:'/legal/terms/', body, breadcrumbItems:[{label:'Home',href:'/'},{label:'Legal',href:'/legal/terms/'},{label:'Terms',href:'/legal/terms/'}]});
}

function notFound() {
  const body = pageHero({eyebrow:'404', title:'This route does not exist.', lead:'The address may have changed or the link may be incorrect.'}) + `<section class="section compact"><div class="shell"><div class="actions"><a class="button" href="/">Home</a><a class="button secondary" href="/services/">Services</a><a class="button secondary" href="/research/">Research</a></div></div></section>`;
  return layout({title:'404 | Blackpine Cybersecurity', description:'The requested page could not be found.', path:'/404/', body, noindex:true});
}

await fs.rm(out, {recursive:true, force:true});
await fs.mkdir(out, {recursive:true});
await fs.cp(pub, out, {recursive:true});
await fs.copyFile(new URL('./styles.css', src), new URL('./styles.css', out));
await fs.copyFile(new URL('./site.js', src), new URL('./site.js', out));

await writeRoute('/', home());
await writeRoute('/services/', servicesIndex());
for (const s of services) await writeRoute(`/services/${s.slug}/`, servicePage(s));
await writeRoute('/engagements/', engagements());
await writeRoute('/research/', researchIndex());
for (const r of research) await writeRoute(`/research/${r.slug}/`, researchPage(r));
await writeRoute('/labs/', labsIndex());
await writeRoute('/labs/cipher/', cipherPage());
await writeRoute('/labs/cipher/security-model/', cipherSecurityModel());
await writeRoute('/trust/', trustIndex());
for (const p of trustPages) await writeRoute(`/trust/${p.slug}/`, trustPage(p));
await writeRoute('/company/about/', about());
await writeRoute('/company/who-we-work-with/', whoWeWorkWith());
await writeRoute('/company/careers/', careers());
await writeRoute('/contact/', contact());
await writeRoute('/contact/thanks/', thanks(), false);
await writeRoute('/legal/privacy/', privacy());
await writeRoute('/legal/terms/', terms());

await fs.writeFile(new URL('./404.html', out), notFound());
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(r=>`  <url><loc>${new URL(r, site.url)}</loc><lastmod>2026-10-22</lastmod></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(new URL('./sitemap.xml', out), sitemap);
await fs.writeFile(new URL('./robots.txt', out), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`Built ${routes.length} indexable routes + 404/confirmation pages.`);
