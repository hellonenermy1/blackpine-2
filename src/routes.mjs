import { services, research, trustPages } from './data.mjs';
import { homePage } from './pages/home.mjs';
import { servicesIndexPage, servicePage, engagementsPage } from './pages/services.mjs';
import { researchIndexPage, researchPage } from './pages/research.mjs';
import { labsIndexPage, cipherPage, cipherSecurityModelPage, trustIndexPage, trustPage } from './pages/labs-trust.mjs';
import { aboutPage, whoWeWorkWithPage, careersPage } from './pages/company.mjs';
import { contactPage, thanksPage, privacyPage, termsPage, notFoundPage } from './pages/contact-legal.mjs';

export const routes = [
  { path: '/', indexable: true, page: homePage() },
  { path: '/services/', indexable: true, page: servicesIndexPage() },
  ...services.map(service => ({ path: `/services/${service.slug}/`, indexable: true, page: servicePage(service) })),
  { path: '/engagements/', indexable: true, page: engagementsPage() },
  { path: '/research/', indexable: true, page: researchIndexPage() },
  ...research.map(item => ({ path: `/research/${item.slug}/`, indexable: true, page: researchPage(item) })),
  { path: '/labs/', indexable: true, page: labsIndexPage() },
  { path: '/labs/cipher/', indexable: true, page: cipherPage() },
  { path: '/labs/cipher/security-model/', indexable: true, page: cipherSecurityModelPage() },
  { path: '/trust/', indexable: true, page: trustIndexPage() },
  ...trustPages.map(page => ({ path: `/trust/${page.slug}/`, indexable: true, page: trustPage(page) })),
  { path: '/company/about/', indexable: true, page: aboutPage() },
  { path: '/company/who-we-work-with/', indexable: true, page: whoWeWorkWithPage() },
  { path: '/company/careers/', indexable: true, page: careersPage() },
  { path: '/contact/', indexable: true, page: contactPage() },
  { path: '/contact/thanks/', indexable: false, page: thanksPage() },
  { path: '/legal/privacy/', indexable: true, page: privacyPage() },
  { path: '/legal/terms/', indexable: true, page: termsPage() }
];

export const errorPage = notFoundPage();
