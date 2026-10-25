const source = 'https://www.blackpinecybersecurity.com/company/about/?phase6=canonical-check';
const expected = 'https://blackpinecybersecurity.com/company/about/?phase6=canonical-check';

let response;
try {
  response = await fetch(source, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
    headers: {
      'user-agent': 'Blackpine-Production-Audit/1.0 (+https://blackpinecybersecurity.com/trust/website-security/)'
    }
  });
} catch (error) {
  console.error(`ERROR: deep-path www canonical check failed: ${error.name || 'network error'}: ${error.message}`);
  process.exit(1);
}

if (![301, 302, 307, 308].includes(response.status)) {
  console.error(`ERROR: ${source} returned ${response.status}; expected a redirect.`);
  process.exit(1);
}

const location = response.headers.get('location');
if (!location) {
  console.error(`ERROR: ${source} has no Location header.`);
  process.exit(1);
}

let resolved;
try {
  resolved = new URL(location, source).toString();
} catch {
  console.error(`ERROR: ${source} returned an invalid Location header: ${location}`);
  process.exit(1);
}

if (resolved !== expected) {
  console.error(`ERROR: deep-path www redirect did not preserve path/query. Expected ${expected}; received ${resolved}.`);
  process.exit(1);
}

console.log('Phase 6 deep-path canonical-host check passed: www redirects to apex while preserving path and query string.');
