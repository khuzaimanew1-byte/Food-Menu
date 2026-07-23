import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./App.css";

import { CoverPage } from "./components/CoverPage";
import { ClosingPage } from "./components/ClosingPage";
import { ContentPage } from "./components/ContentPage/ContentPage";
import { PrintBtn } from "./components/PrintBtn/PrintBtn";
import { NavCtrl } from "./components/NavCtrl/NavCtrl";

const queryClient = new QueryClient();

const ARABIC_ITEMS = [
  {
    id: 1,
    name: "Chicken Shawarma",
    description:
      "Marinated chicken, thinly sliced & wrapped with garlic sauce.",
    price: "Rs. 12.99",
  },
  {
    id: 2,
    name: "Beef Shawarma",
    description: "Tender beef slices with pickles & tahini sauce.",
    price: "Rs. 14.99",
  },
  {
    id: 3,
    name: "Mandi",
    description: "Aromatic rice cooked with tender meat & traditional spices.",
    price: "Rs. 18.99",
  },
  {
    id: 4,
    name: "Chicken Mandi",
    description: "Slow-cooked tender chicken & spices.",
    price: "Rs. 16.99",
  },
  {
    id: 5,
    name: "Lamb Mandi",
    description: "Fragrant rice with slow-cooked lamb.",
    price: "Rs. 21.99",
  },
  {
    id: 6,
    name: "Kabsa",
    description: "Spiced rice with meat, raisins & nuts.",
    price: "Rs. 19.99",
  },
  {
    id: 7,
    name: "Chicken Kabsa",
    description: "A classic Kabsa with juicy chicken.",
    price: "Rs. 17.99",
  },
  {
    id: 8,
    name: "Mixed Grill",
    description: "Selection of kebabs, chicken, lamb & grilled veggies.",
    price: "Rs. 24.99",
  },
  {
    id: 9,
    name: "Lamb Ouzi",
    description: "Slow-cooked lamb with rice, nuts & spices.",
    price: "Rs. 22.99",
  },
  {
    id: 10,
    name: "Falafel",
    description: "Crispy chickpea fritters served with tahini.",
    price: "Rs. 8.99",
  },
  {
    id: 11,
    name: "Hummus Platter",
    description: "Creamy hummus with olive oil & paprika.",
    price: "Rs. 9.99",
  },
  {
    id: 12,
    name: "Mutabbal",
    description: "Smoky roasted eggplant dip with tahini.",
    price: "Rs. 10.99",
  },
  {
    id: 13,
    name: "Baba Ganoush",
    description: "Roasted eggplant dip with olive oil.",
    price: "Rs. 10.99",
  },
  {
    id: 14,
    name: "Fattoush",
    description: "Fresh salad with crispy bread, tomato & veggies.",
    price: "Rs. 11.99",
  },
  {
    id: 15,
    name: "Tabbouleh",
    description: "Parsley salad with tomato, lemon & olive oil.",
    price: "Rs. 11.99",
  },
];

const TURKISH_ITEMS = [
  {
    id: 16,
    name: "Iskender Kebab",
    description: "Sliced doner meat on pita, tomato sauce & yogurt.",
    price: "Rs. 21.99",
  },
  {
    id: 17,
    name: "Adana Kebab",
    description: "Spicy minced lamb kebab grilled to perfection.",
    price: "Rs. 19.99",
  },
  {
    id: 18,
    name: "Doner Kebab",
    description: "Classic Turkish doner served with salad or rice.",
    price: "Rs. 18.99",
  },
  {
    id: 19,
    name: "Chicken Doner",
    description: "Seasoned chicken doner with salad & sauce.",
    price: "Rs. 16.99",
  },
  {
    id: 20,
    name: "Turkish Pide",
    description: "Turkish flatbread with various toppings.",
    price: "Rs. 15.99",
  },
  {
    id: 21,
    name: "Lahmacun",
    description: "Thin crispy flatbread with spiced minced meat.",
    price: "Rs. 13.99",
  },
  {
    id: 22,
    name: "Beyti Kebab",
    description: "Grilled kebab rolls with tomato sauce & yogurt.",
    price: "Rs. 22.99",
  },
  {
    id: 23,
    name: "Turkish Meatballs (Köfte)",
    description: "Juicy grilled meatballs served with rice.",
    price: "Rs. 17.99",
  },
  {
    id: 24,
    name: "Testi Kebab",
    description: "Meat & vegetables slow-cooked in a sealed pot.",
    price: "Rs. 26.99",
  },
  {
    id: 25,
    name: "Ali Nazik Kebab",
    description: "Smoked meat puree with grilled meat.",
    price: "Rs. 23.99",
  },
  {
    id: 26,
    name: "Hunkar Begendi",
    description: "Sautéed meat on creamy eggplant puree.",
    price: "Rs. 24.99",
  },
  {
    id: 27,
    name: "Sis Kebab",
    description: "Tender cubes of beef grilled on skewers.",
    price: "Rs. 20.99",
  },
  {
    id: 28,
    name: "Etli Ekmek",
    description: "Turkish flatbread with minced meat topping.",
    price: "Rs. 16.99",
  },
  {
    id: 29,
    name: "Karniyarik",
    description: "Stuffed eggplant with spiced minced meat.",
    price: "Rs. 18.99",
  },
  {
    id: 30,
    name: "Imam Bayildi",
    description: "Stuffed eggplant with olive oil & herbs.",
    price: "Rs. 17.99",
  },
];

const GRILLS_ITEMS = [
  {
    id: 31,
    name: "Chicken Shish Tawook",
    description: "Marinated chicken cubes grilled to perfection.",
    price: "Rs. 18.99",
  },
  {
    id: 32,
    name: "Lamb Chops",
    description: "Tender lamb chops seasoned & grilled.",
    price: "Rs. 28.99",
  },
  {
    id: 33,
    name: "Sultan's Mixed Platter",
    description: "A royal platter of kebabs, lamb, chicken & sides.",
    price: "Rs. 45.99",
  },
  {
    id: 34,
    name: "Ottoman Royal Grill",
    description: "Premium selection Ottoman-style grills.",
    price: "Rs. 49.99",
  },
  {
    id: 35,
    name: "Turkish Steak Platter",
    description: "Grilled steak with sides & special sauce.",
    price: "Rs. 34.99",
  },
  {
    id: 36,
    name: "Arabic BBQ Platter",
    description: "Mix of BBQ favorites with rice & dips.",
    price: "Rs. 39.99",
  },
  {
    id: 37,
    name: "Grilled Sea Bass",
    description: "Fresh sea bass grilled with herbs.",
    price: "Rs. 29.99",
  },
  {
    id: 38,
    name: "Charcoal Chicken",
    description: "Whole chicken grilled over charcoal.",
    price: "Rs. 22.99",
  },
  {
    id: 39,
    name: "Lamb Ribs",
    description: "Slow-cooked lamb ribs with BBQ glaze.",
    price: "Rs. 27.99",
  },
  {
    id: 40,
    name: "Castle Feast Family Tray",
    description: "A grand feast for the whole family.",
    price: "Rs. 85.99",
  },
];

const DESSERT_ITEMS = [
  {
    id: 41,
    name: "Kunafa",
    description: "Crispy shredded pastry with sweet cheese & syrup.",
    price: "Rs. 9.99",
  },
  {
    id: 42,
    name: "Baklava",
    description: "Layers of filo pastry with nuts & honey.",
    price: "Rs. 8.99",
  },
  {
    id: 43,
    name: "Turkish Delight",
    description: "Traditional rose-flavored delight with powdered sugar.",
    price: "Rs. 6.99",
  },
  {
    id: 44,
    name: "Umm Ali",
    description: "Classic Arabic bread pudding with nuts & creamy milk.",
    price: "Rs. 8.99",
  },
  {
    id: 45,
    name: "Sutlac (Turkish Rice Pudding)",
    description: "Creamy rice pudding with cinnamon.",
    price: "Rs. 7.99",
  },
];

function MenuApp() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 6;

  const handlePrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  const handleGoto = (p: number) => setCurrentPage(Math.max(0, Math.min(totalPages - 1, p)));

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <CoverPage />;
      case 1:
        return (
          <ContentPage
            pageNumber={1}
            heading="Arabic Specialties"
            items={ARABIC_ITEMS}
            layout="single"
          />
        );
      case 2:
        return (
          <ContentPage
            pageNumber={2}
            heading="Turkish Specialties"
            items={TURKISH_ITEMS}
            layout="two-column"
          />
        );
      case 3:
        return (
          <ContentPage
            pageNumber={3}
            heading="Chef Signatures & Premium Grills"
            items={GRILLS_ITEMS}
            layout="two-column"
          />
        );
      case 4:
        return (
          <ContentPage
            pageNumber={4}
            heading="Desserts & Premium Selections"
            items={DESSERT_ITEMS}
            layout="single"
          />
        );
      case 5:
        return <ClosingPage />;
      default:
        return <CoverPage />;
    }
  };

  return (
    <div className="stage">
      <div className="pg-wrap">
        <div className="a4-box">{renderPage()}</div>
        <NavCtrl
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
          onGoto={handleGoto}
        />
      </div>
      {/* PrintBtn is fixed to the viewport — DOM position doesn't affect placement */}
      <PrintBtn />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MenuApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
