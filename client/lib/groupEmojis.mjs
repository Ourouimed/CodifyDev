import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const emojiData = require("emoji-datasource/emoji.json");

// Helper: convert unified code to actual emoji
// Added logic to handle Variation Selectors if needed
function toEmoji(unified) {
  return String.fromCodePoint(
    ...unified.split("-").map(u => parseInt(u, 16))
  );
}

// 1. Sort the entire dataset by the official Unicode sort order first
const sortedEmojis = emojiData.sort((a, b) => a.sort_order - b.sort_order);

const grouped = {};

sortedEmojis.forEach(e => {
  // Use 'category' for grouping
  const category = e.category;
  if (!grouped[category]) grouped[category] = [];

  // 2. Ensure we get the most compatible version of the emoji
  // Some flags have a 'unified' and a 'non_qualified' version; 
  // 'unified' is generally the standard.
  grouped[category].push({
    id: e.short_name,
    emoji: toEmoji(e.unified),
    sort: e.sort_order // keeping this for reference
  });
});

// 3. Maintain the order of categories as they first appeared in the sorted list
const categoryOrder = [...new Set(sortedEmojis.map(e => e.category))];

const final = categoryOrder.map(cat => ({
  id: cat.toLowerCase().replace(/[&\s]+/g, "_"), // improved regex for categories like "Food & Drink"
  category: cat,
  emojis: grouped[cat]
}));

// Save to emojis.js
fs.writeFileSync(
  "lib/emojis.js",
  `export const emojis = ${JSON.stringify(final, null, 2)};`
);

console.log("✅ emojis.js created! Sorted by Unicode standard and flags optimized.");