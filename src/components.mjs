import { services, research } from './data.mjs';
import { esc } from './lib/html.mjs';

export function topologyGraphic(extraClass = '') {
  return `<svg class="topology ${extraClass}" viewBox="0 0 760 420" aria-hidden="true" focusable="false">
    <g class="topology-lines">
      <path d="M42 330 L180 250 L305 272 L426 178 L576 214 L715 92"/>
      <path d="M180 250 L146 116 L282 72"/>
      <path d="M305 272 L354 350 L510 328"/>
      <path d="M426 178 L405 76 L535 42"/>
      <path d="M576 214 L654 318"/>
    </g>
    <g class="topology-nodes">
      ${[[42,330],[180,250],[305,272],[426,178],[576,214],[715,92],[146,116],[282,72],[354,350],[510,328],[405,76],[535,42],[654,318]].map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="${index % 3 === 0 ? 5 : 3}"/>`).join('')}
    </g>
  </svg>`;
}

export function breadcrumb(items = []) {
  if (!items.length) return '';
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${items.map((item, index) => `${index === items.length - 1 ? `<span aria-current="page">${esc(item.label)}</span>` : `<a href="${esc(item.href)}">${esc(item.label)}</a>`}${index < items.length - 1 ? '<span aria-hidden="true">/</span>' : ''}`).join('')}</nav>`;
}

export function pageHero({ eyebrow, title, lead, meta = '' }) {
  return `<section class="page-hero"><div class="shell page-hero-grid"><div><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(title)}</h1><p class="lead">${esc(lead)}</p></div>${meta ? `<aside class="page-meta">${meta}</aside>` : topologyGraphic('page-topology')}</div></section>`;
}

export function serviceRows(items = services.slice(0, 6)) {
  return `<div class="service-rows">${items.map((service, index) => `<a class="service-row" href="/services/${service.slug}/"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(service.title)}</strong><small>${esc(service.short)}</small></span><span class="row-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;
}

export function researchRows(items = research.slice(0, 4)) {
  return `<div class="research-rows">${items.map(item => `<a class="research-row" href="/research/${item.slug}/" data-research-card data-type="${esc(item.type)}" data-topic="${esc(item.topic)}"><span class="research-meta">${esc(item.date)} · ${esc(item.type)}</span><strong>${esc(item.title)}</strong><span class="research-topic">${esc(item.topic)} · ${esc(item.readTime)}</span></a>`).join('')}</div>`;
}
