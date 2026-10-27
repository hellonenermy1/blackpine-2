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

The production provenance register maps each served editorial original back to the exact shortlisted source file and Pexels photo page, pins both source and production Git-blob fingerprints, records whether the production original is byte-identical or was metadata-stripped/recompressed, and lists responsive derivatives. CI checks the registered fingerprints, the allowed processing relationship, derivative coverage, and the pixel width encoded in each responsive filename. Creator verification remains explicit: a creator field marked `UNVERIFIED` is an unresolved metadata item, not an inferred credit.

Some production originals intentionally differ byte-for-byte from the downloaded shortlist source because the production image phase stripped unnecessary metadata and recompressed selected JPEGs conservatively. Provenance is therefore established through the pinned source and production fingerprints plus the recorded processing mode rather than by incorrectly requiring every served original to equal the source download byte-for-byte.

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
- the exact shortlisted source file and immutable source fingerprint;
- the production original and immutable production fingerprint;
- any approved processing applied between source and production;
- production derivative names, with CI verifying the dimensions encoded by responsive filenames against the JPEG metadata;
- any material third-party-rights consideration created by identifiable people, brands, buildings, property, or other protected subject matter.

Self-host the approved production derivative unless there is a documented reason not to. Production provenance is incomplete while a required rights or creator field remains unresolved; unknown values must not be guessed.
