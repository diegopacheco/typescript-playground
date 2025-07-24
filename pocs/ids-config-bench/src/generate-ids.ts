import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

function generateIds(count: number): string[] {
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
        ids.push(randomUUID());
    }
    return ids;
}

const ids = generateIds(10000);
const configPath = path.join(__dirname, '..', 'config', 'ids.json');
fs.writeFileSync(configPath, JSON.stringify(ids, null, 2));

console.log(`Generated ${ids.length} UUIDs and saved to ${configPath}`);