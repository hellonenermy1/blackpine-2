# Blackpine media register

The production corporate site treats imagery, provenance, and runtime privacy as part of the security and design system.

## Production assets

### Blackpine infrastructure artwork

- File: `public/assets/visuals/infrastructure.svg`
- Type: original Blackpine vector artwork
- Role: Labs / infrastructure environment
- Runtime source: self-hosted on `blackpinecybersecurity.com`
- Rights: created for the Blackpine website; no third-party runtime dependency

### Blackpine social preview set

- Directory: `public/assets/og/`
- Files: `home.png`, `capabilities.png`, `research.png`, `labs.png`, `trust.png`, `company.png`, `contact.png`, `legal.png`
- Type: original Blackpine raster artwork
- Role: Open Graph / social preview imagery
- Runtime source: self-hosted on `blackpinecybersecurity.com`
- Rights: created for the Blackpine website; no third-party runtime dependency

### Licensed editorial photography

- Production directory: `public/assets/editorial/`
- Source library: `media-library/blackpine-shortlist/`
- Production provenance: `media-library/blackpine-shortlist/PRODUCTION-PROVENANCE.tsv`
- Source index: `media-library/blackpine-shortlist/SOURCES.tsv`
- Current source provider: Pexels
- Licence basis reviewed: 2026-10-25
- Runtime source: self-hosted on `blackpinecybersecurity.com`; the site does not hotlink Pexels images

The production provenance register maps each served editorial original back to the exact shortlisted source file and Pexels photo page, records responsive derivatives, and keeps creator verification explicit. A creator field marked `UNVERIFIED` is an unresolved metadata item, not an inferred credit.

The current Pexels licence permits free commercial use and modification without mandatory attribution. Pexels also states that separate rights can apply to identifiable people, logos, brands, buildings, property, and other depicted material. Blackpine therefore does not treat the Pexels licence itself as proof that every possible third-party right has been independently cleared.

## Production policy

The corporate site does not hotlink photography or brand imagery. This keeps the browser policy simple and avoids sending page-image requests to unrelated third parties.

Photography should follow this priority:

1. Real Blackpine material: systems, hardware, workspaces, diagrams, project interfaces, team/process material when available
2. Purpose-selected licensed photography with a clear informational or environmental role
3. Stock photography used sparingly
4. Generated cyber imagery should generally be avoided

## Photography direction

Preferred subject groups:

- technical infrastructure — server hardware, switching, cabling, storage, datacenter detail, controlled physical systems;
- electronics and engineering — PCBs, connectors, silicon, test equipment, close component detail;
- real technical work — hands, workspaces, hardware interaction, whiteboards, engineering process;
- industrial architecture — secure facilities, concrete, steel, technical corridors, structural geometry;
- Canada / northern environment — restrained geographic context, forest, rock, cold water, winter materiality;
- Blackpine projects — Cipher UI, diagrams, test output, verification states, architecture, and release material.

Forest imagery is a brand atmosphere, not a substitute for technical content.

## Reject list

Do not use hooded hackers, glowing padlocks, Matrix-style code rain, anonymous blue server-room people, neon cyber grids, fake SOC dashboards, generic network globes, stock handshakes, or search-engine images without a verified rights record.

## Third-party asset procedure

Before adding a third-party image, record:

- source URL;
- creator, or an explicit unresolved creator-verification state until the creator can be independently confirmed;
- license or usage terms;
- date selected or licence-review date;
- intended use;
- whether attribution is required;
- production derivative names and dimensions;
- any material third-party-rights consideration created by identifiable people, brands, buildings, property, or other protected subject matter.

Self-host the approved production derivative unless there is a documented reason not to. Production provenance is incomplete while a required rights or creator field remains unresolved; unknown values must not be guessed.
