import { services, research, capabilityFamilies } from './data.mjs';
import { trustPages } from './trust-pages.mjs';
import { homePage } from './pages/home.mjs';
import { servicesIndexPage, servicePage, engagementsPage } from './pages/services.mjs';
import { capabilityFamilyPage } from './pages/capability-families.mjs';
import { researchIndexPage, researchPage } from './pages/research.mjs';
import { labsIndexPage, cipherPage, cipherSecurityModelPage, trustIndexPage, trustPage } from './pages/labs-trust.mjs';
import { aboutPage, whoWeWorkWithPage, careersPage } from './pages/company.mjs';
import { contactPage, thanksPage, notFoundPage } from './pages/contact-legal.mjs';
import { privacyPage, termsPage, privacyPageFr, termsPageFr } from './pages/legal.mjs';
import { companyInformationPage, acceptableUsePage, responsibleDisclosurePage } from './pages/phase1-trust.mjs';
import { phase3MethodologyPage, sampleAssessmentPage, researchProgramPage, advisoryStandardPage } from './pages/phase3-proof.mjs';
import { engineeringEvidencePage } from './pages/engineering-evidence.mjs';
import { coreSpecialtiesPage } from './pages/phase3-specialties.mjs';
import { phase4WorkPage, testimonialsPage, clientEvidencePage, externalReputationPage } from './pages/phase4-client-proof.mjs';
import { authorityEvidencePage, caseStudyStandardPage } from './pages/authority-evidence.mjs';
import { assuranceFrameworkPage, governanceSystemPage, clientPortalSecurityPage, serviceStandardsPage, insuranceAssurancePage } from './pages/phase5-enterprise.mjs';
import {
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
  { path: '/services/core-specialties/', indexable: true, page: coreSpecialtiesPage() },
  ...capabilityFamilies.map(family => ({ path: family.path, indexable: true, page: capabilityFamilyPage(family) })),
  ...services.map(service => ({ path: `/services/${service.slug}/`, indexable: true, page: servicePage(service) })),
  { path: '/engagements/', indexable: true, page: engagementsPage() },
  { path: '/methodology/', indexable: true, page: phase3MethodologyPage() },
  { path: '/work/', indexable: true, page: phase4WorkPage() },
  { path: '/work/testimonials/', indexable: true, page: testimonialsPage() },
  { path: '/work/client-evidence/', indexable: true, page: clientEvidencePage() },
  { path: '/work/case-study-standard/', indexable: true, page: caseStudyStandardPage() },
  { path: '/research/', indexable: true, page: researchIndexPage() },
  { path: '/research/program/', indexable: true, page: researchProgramPage() },
  { path: '/research/evidence/', indexable: true, page: authorityEvidencePage() },
  ...research.map(item => ({ path: `/research/${item.slug}/`, indexable: true, page: researchPage(item) })),
  { path: '/advisories/', indexable: true, page: advisoriesPage() },
  { path: '/advisories/publication-standard/', indexable: true, page: advisoryStandardPage() },
  { path: '/reports/', indexable: true, page: reportsPage() },
  { path: '/reports/sample-security-assessment/', indexable: true, page: sampleAssessmentPage() },
  { path: '/resources/', indexable: true, page: resourcesPage() },
  { path: '/resources/guides/', indexable: true, page: guidesPage() },
  { path: '/security-baseline/', indexable: true, page: securityBaselinePage() },
  { path: '/glossary/', indexable: true, page: glossaryPage() },
  { path: '/labs/', indexable: true, page: labsIndexPage() },
  { path: '/labs/engineering-evidence/', indexable: true, page: engineeringEvidencePage() },
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
  { path: '/trust/enterprise-assurance/', indexable: true, page: assuranceFrameworkPage() },
  { path: '/trust/governance-system/', indexable: true, page: governanceSystemPage() },
  { path: '/trust/client-portal-security/', indexable: true, page: clientPortalSecurityPage() },
  { path: '/trust/service-standards/', indexable: true, page: serviceStandardsPage() },
  { path: '/trust/insurance/', indexable: true, page: insuranceAssurancePage() },
  { path: '/company/about/', indexable: true, page: aboutPage() },
  { path: '/company/team/', indexable: true, page: teamPage() },
  { path: '/company/who-we-work-with/', indexable: true, page: whoWeWorkWithPage() },
  { path: '/company/external-verification/', indexable: true, page: externalReputationPage() },
  { path: '/company/careers/', indexable: true, page: careersPage() },
  { path: '/contact/', indexable: true, page: contactPage() },
  { path: '/contact/thanks/', indexable: false, page: thanksPage() },
  { path: '/search/', indexable: false, page: searchPage() },
  { path: '/legal/company-information/', indexable: true, page: companyInformationPage() },
  { path: '/legal/privacy/', indexable: true, page: privacyPage() },
  { path: '/legal/terms/', indexable: true, page: termsPage() },
  { path: '/fr/legal/privacy/', indexable: true, page: privacyPageFr() },
  { path: '/fr/legal/terms/', indexable: true, page: termsPageFr() },
  { path: '/legal/acceptable-use/', indexable: true, page: acceptableUsePage() }
];

export const errorPage = notFoundPage();
