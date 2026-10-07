import fs from 'fs';
import path from 'path';

const cache = new Map<string, string>();

export function prompt(name: string, vars: Record<string, string> = {}) {
  let raw = cache.get(name);
  if (!raw) {
    raw = fs.readFileSync(path.join(process.cwd(), 'prompts', `${name}.md`), 'utf8').trim();
    cache.set(name, raw);
  }
  return raw.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => vars[key] ?? '');
}
