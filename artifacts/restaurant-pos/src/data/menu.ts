export interface PageSect {
  title?:          string;   // undefined only when paginator has no title yet
  isContinuation?: boolean;  // true → same section, overflowed to next page
  items:           MnItem[];
}

export interface MnItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export const ARBC: MnItem[] = [
  { id: 1,  name: "Chicken Shawarma",  description: "Marinated chicken, thinly sliced & wrapped with garlic sauce.", price: "Rs. 12.99" },
  { id: 2,  name: "Beef Shawarma",     description: "Tender beef slices with pickles & tahini sauce.",              price: "Rs. 14.99" },
  { id: 3,  name: "Mandi",             description: "Aromatic rice cooked with tender meat & traditional spices.",  price: "Rs. 18.99" },
  { id: 4,  name: "Chicken Mandi",     description: "Slow-cooked tender chicken & spices.",                        price: "Rs. 16.99" },
  { id: 5,  name: "Lamb Mandi",        description: "Fragrant rice with slow-cooked lamb.",                        price: "Rs. 21.99" },
  { id: 6,  name: "Kabsa",             description: "Spiced rice with meat, raisins & nuts.",                      price: "Rs. 19.99" },
  { id: 7,  name: "Chicken Kabsa",     description: "A classic Kabsa with juicy chicken.",                         price: "Rs. 17.99" },
  { id: 8,  name: "Mixed Grill",       description: "Selection of kebabs, chicken, lamb & grilled veggies.",       price: "Rs. 24.99" },
  { id: 9,  name: "Lamb Ouzi",         description: "Slow-cooked lamb with rice, nuts & spices.",                  price: "Rs. 22.99" },
  { id: 10, name: "Falafel",           description: "Crispy chickpea fritters served with tahini.",                price: "Rs. 8.99"  },
  { id: 11, name: "Hummus Platter",    description: "Creamy hummus with olive oil & paprika.",                     price: "Rs. 9.99"  },
  { id: 12, name: "Mutabbal",          description: "Smoky roasted eggplant dip with tahini.",                     price: "Rs. 10.99" },
  { id: 13, name: "Baba Ganoush",      description: "Roasted eggplant dip with olive oil.",                        price: "Rs. 10.99" },
  { id: 14, name: "Fattoush",          description: "Fresh salad with crispy bread, tomato & veggies.",            price: "Rs. 11.99" },
  { id: 15, name: "Tabbouleh",         description: "Parsley salad with tomato, lemon & olive oil.",               price: "Rs. 11.99" },
];

export const TURK: MnItem[] = [
  { id: 16, name: "Iskender Kebab",            description: "Sliced doner meat on pita, tomato sauce & yogurt.",    price: "Rs. 21.99" },
  { id: 17, name: "Adana Kebab",               description: "Spicy minced lamb kebab grilled to perfection.",        price: "Rs. 19.99" },
  { id: 18, name: "Doner Kebab",               description: "Classic Turkish doner served with salad or rice.",      price: "Rs. 18.99" },
  { id: 19, name: "Chicken Doner",             description: "Seasoned chicken doner with salad & sauce.",            price: "Rs. 16.99" },
  { id: 20, name: "Turkish Pide",              description: "Turkish flatbread with various toppings.",              price: "Rs. 15.99" },
  { id: 21, name: "Lahmacun",                  description: "Thin crispy flatbread with spiced minced meat.",        price: "Rs. 13.99" },
  { id: 22, name: "Beyti Kebab",               description: "Grilled kebab rolls with tomato sauce & yogurt.",       price: "Rs. 22.99" },
  { id: 23, name: "Turkish Meatballs (Köfte)", description: "Juicy grilled meatballs served with rice.",             price: "Rs. 17.99" },
  { id: 24, name: "Testi Kebab",               description: "Meat & vegetables slow-cooked in a sealed pot.",        price: "Rs. 26.99" },
  { id: 25, name: "Ali Nazik Kebab",           description: "Smoked meat puree with grilled meat.",                  price: "Rs. 23.99" },
  { id: 26, name: "Hunkar Begendi",            description: "Sautéed meat on creamy eggplant puree.",                price: "Rs. 24.99" },
  { id: 27, name: "Sis Kebab",                 description: "Tender cubes of beef grilled on skewers.",              price: "Rs. 20.99" },
  { id: 28, name: "Etli Ekmek",                description: "Turkish flatbread with minced meat topping.",           price: "Rs. 16.99" },
  { id: 29, name: "Karniyarik",                description: "Stuffed eggplant with spiced minced meat.",             price: "Rs. 18.99" },
  { id: 30, name: "Imam Bayildi",              description: "Stuffed eggplant with olive oil & herbs.",              price: "Rs. 17.99" },
];
