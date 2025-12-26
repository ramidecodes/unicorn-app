export interface LlamaFeatures {
  colorPalette: {
    body: string;
    neck: string;
    head: string;
    feet: string;
  };
  accessories: {
    hat?: string;
    scarf?: string;
    saddle?: string;
  };
  furPattern: string;
  size: number;
}

const BODY_COLORS = [
  "#8B4513", // Brown
  "#D2691E", // Chocolate
  "#CD853F", // Peru
  "#F4A460", // Sandy brown
  "#D2B48C", // Tan
  "#DEB887", // Burlywood
  "#BC8F8F", // Rosy brown
  "#A0522D", // Sienna
  "#F5DEB3", // Wheat
  "#E6E6FA", // Lavender
  "#FFE4E1", // Misty rose
  "#F0E68C", // Khaki
];

const NECK_COLORS = [
  "#654321", // Dark brown
  "#8B4513", // Brown
  "#A0522D", // Sienna
  "#CD853F", // Peru
  "#D2691E", // Chocolate
  "#F4A460", // Sandy brown
  "#DEB887", // Burlywood
  "#E6E6FA", // Lavender
  "#FFE4E1", // Misty rose
  "#FFF8DC", // Cornsilk
];

const HEAD_COLORS = [
  "#8B4513", // Brown
  "#654321", // Dark brown
  "#A0522D", // Sienna
  "#D2691E", // Chocolate
  "#CD853F", // Peru
  "#F4A460", // Sandy brown
  "#D2B48C", // Tan
  "#DEB887", // Burlywood
  "#F5DEB3", // Wheat
  "#FFF8DC", // Cornsilk
];

const FEET_COLORS = [
  "#654321", // Dark brown
  "#8B4513", // Brown
  "#3D2817", // Very dark brown
  "#2F1B14", // Almost black
  "#A0522D", // Sienna
  "#5C4033", // Darker brown
  "#6B4423", // Dark brown
];

const FUR_PATTERNS = [
  "solid",
  "spotted",
  "patched",
  "gradient",
  "two-tone",
  "freckled",
];

const ACCESSORIES = {
  hats: ["sombrero", "beanie", "wizard", "crown", "beret", "top-hat", "none"],
  scarves: ["striped", "polka-dot", "solid", "checkered", "none"],
  saddles: ["decorative", "western", "colorful", "none"],
};

export function generateRandomFeatures(): LlamaFeatures {
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
      neck: getRandomItem(NECK_COLORS),
      head: getRandomItem(HEAD_COLORS),
      feet: getRandomItem(FEET_COLORS),
    },
    accessories: {
      hat: getRandomAccessory(ACCESSORIES.hats),
      scarf: getRandomAccessory(ACCESSORIES.scarves),
      saddle: getRandomAccessory(ACCESSORIES.saddles),
    },
    furPattern: getRandomItem(FUR_PATTERNS),
    size: 0.8 + Math.random() * 0.4, // Random size between 0.8 and 1.2
  };
}

