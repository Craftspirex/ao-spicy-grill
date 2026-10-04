const fs = require('fs');
const path = require('path');

const raw = \$data\;
const lines = raw.split('\n');
const menuItems = [];
let currentCategory = '';
let idCounter = 1;

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.endsWith(':')) {
        currentCategory = trimmed.slice(0, -1);
    } else if (trimmed.includes('—')) {
        let [name, priceStr] = trimmed.split('—').map(s => s.trim());
        
        let price = 0;
        if (priceStr.includes('/')) {
            const matches = [...priceStr.matchAll(/(\d+)/g)];
            if (matches.length > 0) {
                const prices = matches.map(m => parseInt(m[0], 10));
                price = Math.min(...prices);
            }
        } else {
            price = parseInt(priceStr, 10);
        }

        menuItems.push({
            id: String(idCounter++),
            name: { en: name, ur: name, ru: name },
            description: { en: currentCategory + ' special', ur: currentCategory + ' special', ru: currentCategory + ' special' },
            price: price,
            category: currentCategory,
            image: ''
        });
    }
}

const outStr = \import { MenuItem } from '@/types';\n\nexport const menuItems: MenuItem[] = \;\n\;
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'menu.ts'), outStr, 'utf8');
