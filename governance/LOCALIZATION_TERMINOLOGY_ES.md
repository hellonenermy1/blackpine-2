# Blackpine Spanish Localization Terminology — Phase 3

Locale: `es`

Audience: international Spanish-speaking business, technical, security, governance, and incident-response readers.

Register: professional, neutral international Spanish. Avoid regionalisms that unnecessarily anchor the site to Spain or one Latin American country when a broadly understood alternative exists.

## Editorial principles

- Translate meaning and intent, not English syntax.
- Prefer concise professional Spanish over stacked English noun phrases.
- Keep uncertainty, scope, authorization, contractual, evidence, timing, and operational qualifiers exactly as strong or weak as the source. Never strengthen a claim during translation.
- Prefer active, natural sentences where the English passive would sound mechanical in Spanish.
- Do not overuse `realizar`, `llevar a cabo`, `proceder a`, `con el fin de`, or `de cara a` when a direct verb is clearer.
- Avoid Spain-only choices such as `ordenador` when `equipo`, `dispositivo` or `sistema` works internationally. Avoid country-specific colloquialisms.
- Keep established acronyms and product names when they are standard internationally: MFA, IAM, EDR, SOC, DNS, DMARC, SaaS, API, CVE, ISO, SOC 2, Microsoft 365, Google Workspace, Blackpine product names.
- When an English technical term is internationally dominant and Spanish professional sources retain it, use the established form rather than inventing a forced translation.

## Preferred cybersecurity terminology

| English concept | Preferred Spanish | Notes |
| --- | --- | --- |
| cybersecurity | ciberseguridad | Standard public/professional term. |
| security engineering | ingeniería de seguridad | Use for discipline/work. |
| security assessment | evaluación de seguridad | Avoid implying certification. |
| security posture | postura de seguridad | Established technical usage. |
| incident response | respuesta a incidentes | Preferred recurring term. |
| incident response plan | plan de respuesta a incidentes | |
| incident readiness | preparación ante incidentes | Natural public-facing form. |
| containment | contención | Incident-response phase/context. |
| eradication | erradicación | Incident-response phase/context. |
| recovery | recuperación / restablecimiento | Choose by context; `recuperación` for phase/process, `restablecimiento` when service/access is restored. |
| digital forensics | análisis forense digital | Preferred public/professional term. `informática forense` is acceptable when naming the discipline. |
| forensic evidence | evidencias forenses / evidencias digitales | Choose by context. |
| penetration testing | pruebas de penetración | |
| threat intelligence | inteligencia de amenazas | |
| malware | malware / software malicioso | Keep `malware` in technical copy; use `software malicioso` where clearer for general readers. |
| ransomware | ransomware | Widely retained in professional Spanish cyber material. Explain only when audience/context benefits. |
| phishing | phishing / suplantación mediante phishing | Do not force a country-specific substitute. Use `mensaje de phishing`, `campaña de phishing`, etc. |
| business email compromise | compromiso del correo electrónico empresarial (BEC) | Use BEC where helpful after first expansion. |
| privileged access | acceso privilegiado | |
| privileged access management | gestión de accesos privilegiados | |
| identity and access management | gestión de identidades y accesos | IAM may follow. |
| multi-factor authentication | autenticación multifactor | MFA may follow. |
| least privilege | mínimo privilegio / principio de mínimo privilegio | |
| evidence | evidencia / evidencias | In incident/forensic context. For substantiation/assurance copy, `pruebas`, `documentación` or `evidencia` may be more natural depending on sentence. |
| finding | hallazgo | Assessment/report context. |
| remediation | corrección / medidas correctivas | Prefer concrete wording; use `remediación` only where the technical context genuinely benefits. |
| hardening | refuerzo de seguridad / endurecimiento | Prefer `refuerzo de seguridad` in general copy; `endurecimiento` is acceptable in technical contexts. |
| logging | registro / registro de eventos | `capacidad de registro` where needed. |
| monitoring | monitorización / supervisión | `monitorización` for technical security operations; `supervisión` for broader governance/business contexts. |
| Security Operations Center | centro de operaciones de seguridad (SOC) | Retain international acronym SOC. |
| cloud security | seguridad en la nube | |
| cloud service | servicio en la nube | |
| endpoint | dispositivo / equipo / endpoint | Prefer neutral Spanish nouns in public copy; retain `endpoint` when naming an established product/control category. |
| endpoint detection and response | detección y respuesta en endpoints (EDR) | Established acronym retained. |
| attack surface | superficie de ataque | |
| attack path | ruta de ataque / vía de ataque | Choose the natural form for the sentence. |
| blast radius | alcance del impacto | Avoid literal calques. |
| credentials | credenciales | |
| business continuity | continuidad del negocio / continuidad operativa | Choose by context. |
| disaster recovery | recuperación ante desastres | |
| due diligence | diligencia debida | |
| data retention | conservación de datos | |
| responsible disclosure | divulgación responsable | |
| vulnerability management | gestión de vulnerabilidades | |
| security assurance | aseguramiento de la seguridad | Use for confidence/evidence/control-assurance concept; never confuse with insurance. |
| insurance | seguro / cobertura de seguro | Separate explicitly from security assurance. |
| scope | alcance | Default. Use `ámbito` only where more natural in governance/legal-adjacent prose. |

## Product, company, and navigation conventions

- Blackpine Cybersecurity, Blackpine Labs, Cipher, Blackpine Managed Security, Blackpine Response Retainer, Blackpine On-Demand, Blackpine Security Desk and other deliberate product/service names remain protected names unless a reviewed display translation is explicitly defined.
- Navigation labels are localized for comprehension even where the underlying service/product name remains protected inside explanatory copy.
- `Capabilities` → `Servicios` or `Capacidades` only when the context genuinely describes capabilities; navigation should prefer the natural customer-facing label selected in the reviewed catalog.
- `Work` → `Experiencia` / `Trabajo realizado` / `Casos y evidencia` according to the actual destination, not a mechanical single-word mapping.
- `Trust Center` → `Centro de confianza`.

## Claim-preservation phrases

- `when agreed` → `cuando se acuerde` / `cuando se haya acordado`
- `where included in scope` → `cuando esté incluido en el alcance`
- `where applicable` → `cuando corresponda` / `cuando sea aplicable`
- `may` → preserve possibility; do not turn into `will`/certainty.
- `sample` / `illustrative` → `ejemplo`, `muestra`, `ilustrativo`, `ficticio` as appropriate; never make sample evidence sound like a real client record.
- `not independently verified` → `no verificado de forma independiente`.
- `OPEN` evidence state → preserve the defined state and explanation; do not translate it into a positive assurance claim.

## Legal boundary

Phase 3 does not publish Spanish versions of lawyer-controlled Terms or Privacy unless an approved Spanish legal source is supplied and integrity-protected. Ordinary technical translation must never be used to create an apparently authoritative Spanish legal document.

## Source references used for terminology review

The Phase 3 terminology review consulted current Spanish-language cybersecurity material from INCIBE/INCIBE-CERT and official Spanish incident-response material. INCIBE uses terms including `respuesta a incidentes`, `análisis forense digital`, `gestión de vulnerabilidades`, `mínimo privilegio`, `continuidad de negocio`, and retains `ransomware` in professional cybersecurity material. These references guide terminology; Blackpine copy is independently written for its own context and is not copied from source publications.
