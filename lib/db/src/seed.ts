// Run once: pnpm --filter @workspace/db run seed
import { db, pool, mkId, sects, items } from './index';

const SECTS = [
  { name: 'Arabic',  shp: 'ic'  as const },
  { name: 'Turkish', shp: 'ic'  as const },
];

const ITEMS: Record<string, { name: string; desc: string; price: string }[]> = {
  Arabic: [
    { name: 'Chicken Shawarma',  desc: 'Marinated chicken, thinly sliced & wrapped with garlic sauce.',  price: '12.99' },
    { name: 'Beef Shawarma',     desc: 'Tender beef slices with pickles & tahini sauce.',                price: '14.99' },
    { name: 'Mandi',             desc: 'Aromatic rice cooked with tender meat & traditional spices.',    price: '18.99' },
    { name: 'Chicken Mandi',     desc: 'Slow-cooked tender chicken & spices.',                           price: '16.99' },
    { name: 'Lamb Mandi',        desc: 'Fragrant rice with slow-cooked lamb.',                           price: '21.99' },
    { name: 'Kabsa',             desc: 'Spiced rice with meat, raisins & nuts.',                        price: '19.99' },
    { name: 'Chicken Kabsa',     desc: 'A classic Kabsa with juicy chicken.',                            price: '17.99' },
    { name: 'Mixed Grill',       desc: 'Selection of kebabs, chicken, lamb & grilled veggies.',          price: '24.99' },
    { name: 'Lamb Ouzi',         desc: 'Slow-cooked lamb with rice, nuts & spices.',                    price: '22.99' },
    { name: 'Falafel',           desc: 'Crispy chickpea fritters served with tahini.',                   price: '8.99'  },
    { name: 'Hummus Platter',    desc: 'Creamy hummus with olive oil & paprika.',                        price: '9.99'  },
    { name: 'Mutabbal',          desc: 'Smoky roasted eggplant dip with tahini.',                        price: '10.99' },
    { name: 'Baba Ganoush',      desc: 'Roasted eggplant dip with olive oil.',                           price: '10.99' },
    { name: 'Fattoush',          desc: 'Fresh salad with crispy bread, tomato & veggies.',               price: '11.99' },
    { name: 'Tabbouleh',         desc: 'Parsley salad with tomato, lemon & olive oil.',                  price: '11.99' },
  ],
  Turkish: [
    { name: 'Iskender Kebab',            desc: 'Sliced doner meat on pita, tomato sauce & yogurt.',   price: '21.99' },
    { name: 'Adana Kebab',               desc: 'Spicy minced lamb kebab grilled to perfection.',       price: '19.99' },
    { name: 'Doner Kebab',               desc: 'Classic Turkish doner served with salad or rice.',     price: '18.99' },
    { name: 'Chicken Doner',             desc: 'Seasoned chicken doner with salad & sauce.',            price: '16.99' },
    { name: 'Turkish Pide',              desc: 'Turkish flatbread with various toppings.',             price: '15.99' },
    { name: 'Lahmacun',                  desc: 'Thin crispy flatbread with spiced minced meat.',       price: '13.99' },
    { name: 'Beyti Kebab',               desc: 'Grilled kebab rolls with tomato sauce & yogurt.',      price: '22.99' },
    { name: 'Turkish Meatballs (Köfte)', desc: 'Juicy grilled meatballs served with rice.',            price: '17.99' },
    { name: 'Testi Kebab',               desc: 'Meat & vegetables slow-cooked in a sealed pot.',       price: '26.99' },
    { name: 'Ali Nazik Kebab',           desc: 'Smoked meat puree with grilled meat.',                 price: '23.99' },
    { name: 'Hunkar Begendi',            desc: 'Sautéed meat on creamy eggplant puree.',               price: '24.99' },
    { name: 'Sis Kebab',                 desc: 'Tender cubes of beef grilled on skewers.',             price: '20.99' },
    { name: 'Etli Ekmek',                desc: 'Turkish flatbread with minced meat topping.',          price: '16.99' },
    { name: 'Karniyarik',                desc: 'Stuffed eggplant with spiced minced meat.',            price: '18.99' },
    { name: 'Imam Bayildi',              desc: 'Stuffed eggplant with olive oil & herbs.',             price: '17.99' },
  ],
};

async function seed() {
  // [DB-TX] entire seed in one transaction — partial writes forbidden
  await db.transaction(async (tx) => {
    for (let si = 0; si < SECTS.length; si++) {
      const s = SECTS[si];
      const sectId = mkId();
      await tx.insert(sects).values({ id: sectId, name: s.name, pos: si, shp: s.shp });

      const rows = ITEMS[s.name] ?? [];
      for (let ii = 0; ii < rows.length; ii++) {
        await tx.insert(items).values({
          id:      mkId(),
          sect_id: sectId,
          pos:     ii,
          name:    rows[ii].name,
          dsc:     rows[ii].desc,
          price:   rows[ii].price,
        });
      }
    }
  });
  await pool.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });
