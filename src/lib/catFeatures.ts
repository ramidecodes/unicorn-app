export interface CatFeatures {
  colorPalette: {
    body: string;
    ears: string;
    paws: string;
    eyes: string;
  };
  accessories: {
    collar?: string;
    bow?: string;
    bell?: string;
  };
  furPattern: string;
  size: number;
}

const BODY_COLORS = [
  "#F5F5F5", // White smoke
  "#1C1C1C", // Near black
  "#C0C0C0", // Silver
  "#FF8C69", // Salmon
  "#A67B5B", // Brown
  "#D2B48C", // Tan
  "#B0C4DE", // Light steel blue
  "#FFDAB9", // Peach
];

const EAR_COLORS = [
  "#FFB6C1", // Light pink
  "#FFC0CB", // Pink
  "#F4A7B9", // Rose pink
  "#FFCCCB", // Pastel red
];

const PAW_COLORS = [
  "#FFFFFF", // White
  "#EAEAEA", // Light gray
  "#DCDCDC", // Gainsboro
  "#FFE4E1", // Misty rose
];

const EYE_COLORS = [
  "#32CD32", // Lime green
  "#FFD700", // Gold
  "#00BFFF", // Deep sky blue
  "#8A2BE2", // Blue violet
];

const FUR_PATTERNS = [
  "solid",
  "striped",
  "spotted",
  "tuxedo",
  "calico",
  "tabby",
];

const ACCESSORIES = {
  collars: ["red", "blue", "purple", "rainbow", "none"],
  bows: ["pink", "yellow", "mint", "none"],
  bells: ["gold", "silver", "none"],
};

export function generateRandomFeatures(): CatFeatures {
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
      ears: getRandomItem(EAR_COLORS),
      paws: getRandomItem(PAW_COLORS),
      eyes: getRandomItem(EYE_COLORS),
    },
    accessories: {
      collar: getRandomAccessory(ACCESSORIES.collars),
      bow: getRandomAccessory(ACCESSORIES.bows),
      bell: getRandomAccessory(ACCESSORIES.bells),
    },
    furPattern: getRandomItem(FUR_PATTERNS),
    size: 0.8 + Math.random() * 0.4,
  };
}
