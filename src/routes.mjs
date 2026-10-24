import { services, research, trustPages, capabilityFamilies } from './data.mjs';
import { homePage } from './pages/home.mjs';
import { servicesIndexPage, servicePage, engagementsPage } from './pages/services.mjs';
import { capabilityFamilyPage } from './pages/capability-families.mjs';
import { researchIndexPage, researchPage } from './pages/research.mjs';
import { labsIndexPage, cipherPage, cipherSecurityModelPage, trustIndexPage, trustPage } from './pages/labs-trust.mjs';
import { aboutPage, whoWeWorkWithPage, careersPage } from './pages/company.mjs';
import { contactPage, thanksPage, privacyPage, termsPage, notFoundPage } from './pages/contact-legal.mjs';
import { companyInformationPage, acceptableUsePage, responsibleDisclosurePage } from './pages/phase1-trust.mjs';
import {
  methodologyPage,
  workPage,
  teamPage,
  advisoriesPage,
  reportsPage,
  resourcesPage,
  guidesPage,
  securityBaselinePage,
  glossaryPage,
  toolsPage,
  securityHeadersToolPage,
  emailSecurityToolPage,
  domainDnsToolPage,
  assessmentPage,
  incidentPage,
  searchPage
} from './pages/v3.mjs';

export const routes = [
  { path: '/', indexable: true, page: homePage() },
  { path: '/services/', indexable: true, page: servicesIndexPage() },
  ...capabilityFamilies.map(family => ({ path: family.path, indexable: true, page: capabilityFamilyPage(family) })),
  ...services.map(service => ({ path: `/services/${service.slug}/`, indexable: true, page: servicePage(service) })),
  { path: '/engagements/', indexable: true, page: engagementsPage() },
  { path: '/methodology/', indexable: true, page: methodologyPage() },
  { path: '/work/', indexable: true, page: workPage() },
  { path: '/research/', indexable: true, page: researchIndexPage() },
  ...research.map(item => ({ path: `/research/${item.slug}/`, indexable: true, page: researchPage(item) })),
  { path: '/advisories/', indexable: true, page: advisoriesPage() },
  { path: '/reports/', indexable: true, page: reportsPage() },
  { path: '/resources/', indexable: true, page: resourcesPage() },
  { path: '/resources/guides/', indexable: true, page: guidesPage() },
  { path: '/security-baseline/', indexable: true, page: securityBaselinePage() },
  { path: '/glossary/', indexable: true, page: glossaryPage() },
  { path: '/labs/', indexable: true, page: labsIndexPage() },
  { path: '/labs/cipher/', indexable: true, page: cipherPage() },
  { path: '/labs/cipher/security-model/', indexable: true, page: cipherSecurityModelPage() },
  { path: '/tools/', indexable: true, page: toolsPage() },
  { path: '/tools/security-headers/', indexable: true, page: securityHeadersToolPage() },
  { path: '/tools/email-security/', indexable: true, page: emailSecurityToolPage() },
  { path: '/tools/domain-dns/', indexable: true, page: domainDnsToolPage() },
  { path: '/assessment/', indexable: true, page: assessmentPage() },
  { path: '/incident/', indexable: true, page: incidentPage() },
  { path: '/trust/', indexable: true, page: trustIndexPage() },
  ...trustPages.filter(page => page.slug !== 'responsible-disclosure').map(page => ({ path: `/trust/${page.slug}/`, indexable: true, page: trustPage(page) })),
  { path: '/trust/responsible-disclosure/', indexable: true, page: responsibleDisclosurePage() },
  { path: '/company/about/', indexable: true, page: aboutPage() },
  { path: '/company/team/', indexable: true, page: teamPage() },
  { path: '/company/who-we-work-with/', indexable: true, page: whoWeWorkWithPage() },
  { path: '/company/careers/', indexable: true, page: careersPage() },
  { path: '/contact/', indexable: true, page: contactPage() },
  { path: '/contact/thanks/', indexable: false, page: thanksPage() },
  { path: '/search/', indexable: false, page: searchPage() },
  { path: '/legal/company-information/', indexable: true, page: companyInformationPage() },
  { path: '/legal/privacy/', indexable: true, page: privacyPage() },
  { path: '/legal/terms/', indexable: true, page: termsPage() },
  { path: '/legal/acceptable-use/', indexable: true, page: acceptableUsePage() }
];

export const errorPage = notFoundPage();