export interface UnicornFeatures {
  colorPalette: {
    body: string;
    mane: string;
    tail: string;
    horn: string;
  };
  accessories: {
    hat?: string;
    glasses?: string;
    jewelry?: string;
  };
  hairStyle: string;
  size: number;
}

const BODY_COLORS = [
  "#FF6B9D", // Pink
  "#C77DFF", // Purple
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#FF8C42", // Orange
  "#95E1D3", // Mint
  "#F38181", // Coral
  "#AA96DA", // Lavender
];

const MANE_COLORS = [
  "#FF1493", // Deep pink
  "#8A2BE2", // Blue violet
  "#00CED1", // Dark turquoise
  "#FFD700", // Gold
  "#FF6347", // Tomato
  "#20B2AA", // Light sea green
  "#FF69B4", // Hot pink
  "#9370DB", // Medium purple
];

const TAIL_COLORS = [
  "#FF69B4", // Hot pink
  "#BA55D3", // Medium orchid
  "#00FA9A", // Medium spring green
  "#FFD700", // Gold
  "#FF4500", // Orange red
  "#48D1CC", // Medium turquoise
  "#FF1493", // Deep pink
  "#DA70D6", // Orchid
];

const HORN_COLORS = [
  "#FFD700", // Gold
  "#C0C0C0", // Silver
  "#FF69B4", // Hot pink
  "#00CED1", // Dark turquoise
  "#FF6347", // Tomato
];

const HAIR_STYLES = [
  "curly",
  "straight",
  "wavy",
  "spiky",
  "braided",
  "flowing",
];

const ACCESSORIES = {
  hats: ["wizard", "crown", "beret", "top-hat", "none"],
  glasses: ["sunglasses", "reading-glasses", "star-shaped", "none"],
  jewelry: ["necklace", "bracelet", "earrings", "none"],
};

export function generateRandomFeatures(): UnicornFeatures {
  const getRandomItem = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const getRandomAccessory = (items: string[]): string | undefined => {
    const item = getRandomItem(items);
    return item === "none" ? undefined : item;
  };

  return {
    colorPalette: {
      body: getRandomItem(BODY_COLORS),
      mane: getRandomItem(MANE_COLORS),
      tail: getRandomItem(TAIL_COLORS),
      horn: getRandomItem(HORN_COLORS),
    },
    accessories: {
      hat: getRandomAccessory(ACCESSORIES.hats),
      glasses: getRandomAccessory(ACCESSORIES.glasses),
      jewelry: getRandomAccessory(ACCESSORIES.jewelry),
    },
    hairStyle: getRandomItem(HAIR_STYLES),
    size: 0.8 + Math.random() * 0.4, // Random size between 0.8 and 1.2
  };
}
