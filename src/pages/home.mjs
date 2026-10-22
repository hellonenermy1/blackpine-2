import { site, research } from '../data.mjs';
import { topologyGraphic, serviceRows, researchRows } from '../components.mjs';

const homeResearchSlugs = [
  'preserve-evidence-after-suspicious-admin-login',
  'designing-account-recovery-for-privileged-accounts',
  'common-cloud-administrative-access-mistakes'
];

export function homePage() {
  const selectedResearch = homeResearchSlugs.map(slug => research.find(item => item.slug === slug)).filter(Boolean);
  const body = `
  <section class="hero"><div class="hero-inner"><div class="hero-copy"><span class="eyebrow">Blackpine / Canada</span><h1>Security engineering for exposed systems and critical decisions.</h1><p class="lead">Blackpine examines privileged identity, cloud control planes, public infrastructure, and incident paths — the places where a small weakness can become an operational problem.</p><div class="actions"><a class="button" href="/contact/">Discuss a requirement</a><a class="button secondary" href="/services/">View capabilities</a></div></div><div class="hero-visual">${topologyGraphic()}<span class="visual-caption">BLACKPINE / SYSTEM MAP 02</span></div></div></section>
  <div class="authority"><div class="authority-inner"><div class="authority-item">Security assessment</div><div class="authority-item">Identity & cloud</div><div class="authority-item">Incident response</div><div class="authority-item">Research & engineering</div></div></div>
  <section class="section home-statement"><div class="shell statement-grid"><div class="section-label">Position</div><p>Good security work reduces uncertainty. It shows where control is concentrated, what evidence supports the finding, and what should change first.</p></div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Capabilities</div><div><h2>Where control concentrates.</h2><p>Identity, administrative access, cloud services, public infrastructure, and recovery paths are reviewed as connected systems — because attackers and outages do not respect organizational boundaries.</p></div></div>${serviceRows()}</div></section>
  <section class="section"><div class="shell method-grid"><div class="method-copy"><span class="eyebrow">Method</span><h2>From uncertainty to an ordered response.</h2><p>Every engagement begins with authority, objective, and evidence. Findings are tied to consequence, ownership, and a verifiable next action.</p><ul class="method-list"><li><span>01</span><div>Define authority, systems, objective, and constraints.</div></li><li><span>02</span><div>Inspect agreed evidence and control paths.</div></li><li><span>03</span><div>Trace technical weakness to operational consequence.</div></li><li><span>04</span><div>Sequence remediation, ownership, and verification.</div></li></ul></div><div>${topologyGraphic()}</div></div></section>
  <section class="photo-band"><img src="${site.infrastructureImage}" alt="Dark server hardware representing engineered digital infrastructure" width="1600" height="1067" loading="lazy" decoding="async"><div class="photo-band-content"><div class="shell"><span class="eyebrow">Blackpine Labs</span><h2>Engineering work should survive inspection.</h2><p>Blackpine Cipher is developed on a separate application surface with its own threat model, verification workflow, and technical documentation.</p><div class="actions"><a class="button" href="/labs/cipher/">Review the project</a><a class="button secondary" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a></div></div></div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Research</div><div><h2>Notes for people making security decisions.</h2><p>Blackpine Research focuses on specific questions around identity, cloud access, incident response, recovery, and administrative control. Sources are linked so the reasoning can be checked.</p></div></div>${researchRows(selectedResearch.length ? selectedResearch : research.slice(0, 3))}<div class="actions"><a class="button secondary" href="/research/">Open research library</a></div></div></section>
  <section class="section compact"><div class="shell callout"><div><span class="eyebrow">Trust</span><h2>Publish the boundary.</h2><p>Security claims are useful only when their scope is clear. Blackpine documents website security, data handling, responsible disclosure, and the separation between corporate, support, verification, and Cipher systems.</p></div><a class="button secondary" href="/trust/">Review trust documentation</a></div></section>
  <section class="section"><div class="shell"><div class="callout"><div><span class="eyebrow">Contact</span><h2>Start with the system.</h2><p>Tell us what matters, what changed, or what decision you need to make. Sensitive evidence is handled separately after scope and authorization are confirmed.</p></div><a class="button" href="/contact/">Contact Blackpine</a></div></div></section>`;

  return {
    title: 'Blackpine Cybersecurity | Security Engineering in Canada',
    description: site.description,
    body
  };
}
