import DATABASE from './database.json';

function assert(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || 'Assertion failed.');
  }
}

type RawDatabaseEntry =
  | RawGithubDatabaseEntry
  | RawURLDatabaseEntry
  | RawESMDatabaseEntry;

interface RawGithubDatabaseEntry {
  type: 'github';
  owner: string;
  repo: string;
  path?: string;
  desc: string;
}

interface RawESMDatabaseEntry {
  type: 'esm';
  owner: string;
  repo: string;
  url: string;
  desc: string;
}

interface RawURLDatabaseEntry {
  type: 'url';
  owner: string;
  repo: string;
  url: string;
  desc: string;
}

type DatabaseEntry = GithubDatabaseEntry | ESMDatabaseEntry | URLDatabaseEntry;

interface GithubDatabaseEntry {
  type: 'github';
  name: string;
  branch: string;
  url: string;
  repo: string;
  raw: RawGithubDatabaseEntry;
}

interface ESMDatabaseEntry {
  type: 'esm';
  name: string;
  branch: string;
  url: string;
  repo: string;
  raw: RawESMDatabaseEntry;
}

interface URLDatabaseEntry {
  type: 'url';
  name: string;
  branch: string;
  url: string;
  repo: string;
  raw: RawURLDatabaseEntry;
}

export function proxy(
  pathname: string
): { entry: DatabaseEntry; path: string } | null {
  if (pathname.startsWith('/std')) {
    return proxy('/x' + pathname);
  }
  if (!pathname.startsWith('/x/')) {
    return null;
  }
  const nameBranchRest = pathname.replace(/^\/x\//, '');
  const [nameBranch, ...rest] = nameBranchRest.split('/');
  const [name, branch] = nameBranch.split('@', 2);
  const path = rest.join('/');
  const entry = getEntry(name, branch);
  if (!entry || !entry.url) {
    return null;
  }
  assert(entry.url.endsWith('/'));
  assert(!path.startsWith('/'));
  return { entry, path };
}

/**
 * Pull an entry from the database
 * @param  {string} name
 * @param  {string}                branch
 * @return {import('./types').Entry}
 */
export function getEntry(name: string, branch = 'master'): DatabaseEntry {
  // denoland/deno_std was merged into denoland/deno. For a while we will try
  // to maintain old links for backwards compatibility with denoland/deno_std
  // but eventually tags before v0.20.0 will break.
  if (
    name === 'std' &&
    (branch === 'v0.7.0' ||
      branch === 'v0.8.0' ||
      branch === 'v0.9.0' ||
      branch === 'v0.10.0' ||
      branch === 'v0.11.0' ||
      branch === 'v0.12.0' ||
      branch === 'v0.13.0' ||
      branch === 'v0.14.0' ||
      branch === 'v0.15.0' ||
      branch === 'v0.16.0' ||
      branch === 'v0.17.0' ||
      branch === 'v0.18.0' ||
      branch === 'v0.19.0' ||
      branch === 'v0.20.0' ||
      branch.startsWith('8c90bd') ||
      branch.startsWith('17a214') ||
      branch.startsWith('6958a4'))
  ) {
    name = 'std_old';
  }

  const rawEntry = (DATABASE as { [name: string]: RawDatabaseEntry })[name];
  if (!rawEntry) {
    return null;
  } else if (rawEntry.type === 'url') {
    return {
      name,
      branch,
      raw: rawEntry,
      type: 'url',
      url: rawEntry.url.replace(/\$\{b}/, branch),
      repo: rawEntry.repo.replace(/\$\{b}/, branch),
    };
  } else if (rawEntry.type === 'esm') {
    const version = branch === 'master' ? 'latest' : branch;
    return {
      name,
      branch,
      raw: rawEntry,
      type: 'esm',
      url: rawEntry.url.replace(/\$\{v}/, version),
      repo: rawEntry.repo.replace(/\$\{v}/, version),
    };
  } else if (rawEntry.type === 'github') {
    const path = rawEntry.path || '';
    const url = `https://raw.githubusercontent.com/${rawEntry.owner}/${rawEntry.repo}/${branch}/${path}`;
    const repo = `https://github.com/${rawEntry.owner}/${rawEntry.repo}/tree/${branch}/${path}`;
    return {
      name,
      branch,
      raw: rawEntry,
      type: 'github',
      url,
      repo,
    };
  }
  return null;
}
