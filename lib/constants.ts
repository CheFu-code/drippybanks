export const PRESET_COLORS = [
    { name: 'Midnight Black', hex: '#0a0a0a' },
    { name: 'Bone White', hex: '#f5f5f7' },
    { name: 'Heather Grey', hex: '#4b5563' },
    { name: 'Royal Blue', hex: '#1e40af' },
    { name: 'Crimson Red', hex: '#b91c1c' },
    { name: 'Neon Volt', hex: '#84cc16' },
    { name: 'Cyber Pink', hex: '#db2777' },
    { name: 'Vintage Olive', hex: '#3f6212' },
];

export function getColorHex(colorName?: string): string {
    if (!colorName) return '#0a0a0a';
    const found = PRESET_COLORS.find(
        (c) => c.name.toLowerCase() === colorName.toLowerCase().trim()
    );
    if (found) return found.hex;

    // Fallback based on keywords
    const lower = colorName.toLowerCase();
    if (lower.includes('white') || lower.includes('bone') || lower.includes('cream')) return '#f5f5f7';
    if (lower.includes('black') || lower.includes('dark') || lower.includes('midnight')) return '#0a0a0a';
    if (lower.includes('blue') || lower.includes('azure') || lower.includes('navy')) return '#1e40af';
    if (lower.includes('red') || lower.includes('crimson') || lower.includes('ruby')) return '#b91c1c';
    if (lower.includes('grey') || lower.includes('gray') || lower.includes('slate')) return '#4b5563';
    if (lower.includes('pink') || lower.includes('rose') || lower.includes('magenta')) return '#db2777';
    if (lower.includes('green') || lower.includes('volt') || lower.includes('lime')) return '#84cc16';
    if (lower.includes('olive') || lower.includes('army') || lower.includes('khaki')) return '#3f6212';
    if (lower.includes('yellow') || lower.includes('gold') || lower.includes('amber')) return '#eab308';
    if (lower.includes('orange')) return '#ea580c';
    if (lower.includes('purple') || lower.includes('violet')) return '#9333ea';
    return '#64748b';
}