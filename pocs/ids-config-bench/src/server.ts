import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = 3000;
const idMap = new Map<string, boolean>();

function loadIds(): void {
    const startTime = performance.now();
    const configPath = path.join(__dirname, '..', 'config', 'ids.json');
    const data = fs.readFileSync(configPath, 'utf8');
    const ids: string[] = JSON.parse(data);
    
    ids.forEach(id => idMap.set(id, true));
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.log(`Loaded ${idMap.size} IDs into memory in ${loadTime.toFixed(2)} milliseconds`);
}

app.get('/check/:id', (req, res) => {
    const { id } = req.params;
    const startTime = performance.now();
    const found = idMap.has(id);
    const endTime = performance.now();
    const lookupTime = endTime - startTime;
    console.log(`HashMap lookup for ID ${id} took ${lookupTime.toFixed(4)} milliseconds - ${found ? 'FOUND' : 'NOT FOUND'}`);
    
    if (found) {
        res.send('good to go');
    } else {
        res.send('no dounuts for you');
    }
});

app.listen(port, () => {
    loadIds();
    console.log(`Server running on port ${port}`);
});