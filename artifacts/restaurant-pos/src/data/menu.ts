import { PRICE_SYMBOL } from "@/lib/currency";

export interface PageSect {
  title?:          string;   // undefined only when paginator has no title yet
  isContinuation?: boolean;  // true → same section, overflowed to next page
  items:           MnItem[];
}

export interface MnItem {
  id:           string;   // DB nanoid when loaded from API; "tmp-N" for locally created items
  name?:        string;   // optional — defaults defined in MnItm component
  description?: string;   // optional — defaults defined in MnItm component
  price?:       string;   // optional — defaults defined in MnItm component; stores number part only for new items
  image?:       string;
}

// Fallback data — only used when API is unavailable.
// Actual menu is loaded from the database at runtime.
export const ARBC: MnItem[] = [
  { id: '1',  name: "Chicken Shawarma",  description: "Marinated chicken, thinly sliced & wrapped with garlic sauce.", price: `${PRICE_SYMBOL} 12.99` },
  { id: '2',  name: "Beef Shawarma",     description: "Tender beef slices with pickles & tahini sauce.",              price: `${PRICE_SYMBOL} 14.99` },
  { id: '3',  name: "Mandi",             description: "Aromatic rice cooked with tender meat & traditional spices.",  price: `${PRICE_SYMBOL} 18.99` },
  { id: '4',  name: "Chicken Mandi",     description: "Slow-cooked tender chicken & spices.",                        price: `${PRICE_SYMBOL} 16.99` },
  { id: '5',  name: "Lamb Mandi",        description: "Fragrant rice with slow-cooked lamb.",                        price: `${PRICE_SYMBOL} 21.99` },
  { id: '6',  name: "Kabsa",             description: "Spiced rice with meat, raisins & nuts.",                      price: `${PRICE_SYMBOL} 19.99` },
  { id: '7',  name: "Chicken Kabsa",     description: "A classic Kabsa with juicy chicken.",                         price: `${PRICE_SYMBOL} 17.99` },
  { id: '8',  name: "Mixed Grill",       description: "Selection of kebabs, chicken, lamb & grilled veggies.",       price: `${PRICE_SYMBOL} 24.99` },
  { id: '9',  name: "Lamb Ouzi",         description: "Slow-cooked lamb with rice, nuts & spices.",                  price: `${PRICE_SYMBOL} 22.99` },
  { id: '10', name: "Falafel",           description: "Crispy chickpea fritters served with tahini.",                price: `${PRICE_SYMBOL} 8.99`  },
  { id: '11', name: "Hummus Platter",    description: "Creamy hummus with olive oil & paprika.",                     price: `${PRICE_SYMBOL} 9.99`  },
  { id: '12', name: "Mutabbal",          description: "Smoky roasted eggplant dip with tahini.",                     price: `${PRICE_SYMBOL} 10.99` },
  { id: '13', name: "Baba Ganoush",      description: "Roasted eggplant dip with olive oil.",                        price: `${PRICE_SYMBOL} 10.99` },
  { id: '14', name: "Fattoush",          description: "Fresh salad with crispy bread, tomato & veggies.",            price: `${PRICE_SYMBOL} 11.99` },
  { id: '15', name: "Tabbouleh",         description: "Parsley salad with tomato, lemon & olive oil.",               price: `${PRICE_SYMBOL} 11.99` },
];

export const TURK: MnItem[] = [
  { id: '16', name: "Iskender Kebab",            description: "Sliced doner meat on pita, tomato sauce & yogurt.",   price: `${PRICE_SYMBOL} 21.99` },
  { id: '17', name: "Adana Kebab",               description: "Spicy minced lamb kebab grilled to perfection.",       price: `${PRICE_SYMBOL} 19.99` },
  { id: '18', name: "Doner Kebab",               description: "Classic Turkish doner served with salad or rice.",     price: `${PRICE_SYMBOL} 18.99` },
  { id: '19', name: "Chicken Doner",             description: "Seasoned chicken doner with salad & sauce.",           price: `${PRICE_SYMBOL} 16.99` },
  { id: '20', name: "Turkish Pide",              description: "Turkish flatbread with various toppings.",             price: `${PRICE_SYMBOL} 15.99` },
  { id: '21', name: "Lahmacun",                  description: "Thin crispy flatbread with spiced minced meat.",       price: `${PRICE_SYMBOL} 13.99` },
  { id: '22', name: "Beyti Kebab",               description: "Grilled kebab rolls with tomato sauce & yogurt.",      price: `${PRICE_SYMBOL} 22.99` },
  { id: '23', name: "Turkish Meatballs (Köfte)", description: "Juicy grilled meatballs served with rice.",            price: `${PRICE_SYMBOL} 17.99` },
  { id: '24', name: "Testi Kebab",               description: "Meat & vegetables slow-cooked in a sealed pot.",       price: `${PRICE_SYMBOL} 26.99` },
  { id: '25', name: "Ali Nazik Kebab",           description: "Smoked meat puree with grilled meat.",                 price: `${PRICE_SYMBOL} 23.99` },
  { id: '26', name: "Hunkar Begendi",            description: "Sautéed meat on creamy eggplant puree.",               price: `${PRICE_SYMBOL} 24.99` },
  { id: '27', name: "Sis Kebab",                 description: "Tender cubes of beef grilled on skewers.",             price: `${PRICE_SYMBOL} 20.99` },
  { id: '28', name: "Etli Ekmek",                description: "Turkish flatbread with minced meat topping.",          price: `${PRICE_SYMBOL} 16.99` },
  { id: '29', name: "Karniyarik",                description: "Stuffed eggplant with spiced minced meat.",            price: `${PRICE_SYMBOL} 18.99` },
  { id: '30', name: "Imam Bayildi",              description: "Stuffed eggplant with olive oil & herbs.",             price: `${PRICE_SYMBOL} 17.99` },
];
