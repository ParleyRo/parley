import { cpSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
function copyViews(source, target) {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(target, entry.name);
    if (entry.isDirectory()) copyViews(from, to);
    else if (entry.name.endsWith('.eta')) {
      mkdirSync(target, { recursive: true });
      cpSync(from, to);
    }
  }
}
copyViews('src', 'dist/src');
