import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Printer } from "lucide-react";

import { CoverPage } from "./components/CoverPage";
import { ClosingPage } from "./components/ClosingPage";
import { ContentPage } from "./components/ContentPage";
import { NavControls } from "./components/NavControls";

const queryClient = new QueryClient();

// Data
const ARABIC_ITEMS = [
  { id: 1, name: "Chicken Shawarma", description: "Marinated chicken, thinly sliced & wrapped with garlic sauce.", price: "$12.99" },
  { id: 2, name: "Beef Shawarma", description: "Tender beef slices with pickles & tahini sauce.", price: "$14.99" },
  { id: 3, name: "Mandi", description: "Aromatic rice cooked with tender meat & traditional spices.", price: "$18.99" },
  { id: 4, name: "Chicken Mandi", description: "Slow-cooked tender chicken & spices.", price: "$16.99" },
  { id: 5, name: "Lamb Mandi", description: "Fragrant rice with slow-cooked lamb.", price: "$21.99" },
  { id: 6, name: "Kabsa", description: "Spiced rice with meat, raisins & nuts.", price: "$19.99" },
  { id: 7, name: "Chicken Kabsa", description: "A classic Kabsa with juicy chicken.", price: "$17.99" },
  { id: 8, name: "Mixed Grill", description: "Selection of kebabs, chicken, lamb & grilled veggies.", price: "$24.99" },
  { id: 9, name: "Lamb Ouzi", description: "Slow-cooked lamb with rice, nuts & spices.", price: "$22.99" },
  { id: 10, name: "Falafel", description: "Crispy chickpea fritters served with tahini.", price: "$8.99" },
  { id: 11, name: "Hummus Platter", description: "Creamy hummus with olive oil & paprika.", price: "$9.99" },
  { id: 12, name: "Mutabbal", description: "Smoky roasted eggplant dip with tahini.", price: "$10.99" },
  { id: 13, name: "Baba Ganoush", description: "Roasted eggplant dip with olive oil.", price: "$10.99" },
  { id: 14, name: "Fattoush", description: "Fresh salad with crispy bread, tomato & veggies.", price: "$11.99" },
  { id: 15, name: "Tabbouleh", description: "Parsley salad with tomato, lemon & olive oil.", price: "$11.99" },
];

const TURKISH_ITEMS = [
  { id: 16, name: "Iskender Kebab", description: "Sliced doner meat on pita, tomato sauce & yogurt.", price: "$21.99" },
  { id: 17, name: "Adana Kebab", description: "Spicy minced lamb kebab grilled to perfection.", price: "$19.99" },
  { id: 18, name: "Doner Kebab", description: "Classic Turkish doner served with salad or rice.", price: "$18.99" },
  { id: 19, name: "Chicken Doner", description: "Seasoned chicken doner with salad & sauce.", price: "$16.99" },
  { id: 20, name: "Turkish Pide", description: "Turkish flatbread with various toppings.", price: "$15.99" },
  { id: 21, name: "Lahmacun", description: "Thin crispy flatbread with spiced minced meat.", price: "$13.99" },
  { id: 22, name: "Beyti Kebab", description: "Grilled kebab rolls with tomato sauce & yogurt.", price: "$22.99" },
  { id: 23, name: "Turkish Meatballs (Köfte)", description: "Juicy grilled meatballs served with rice.", price: "$17.99" },
  { id: 24, name: "Testi Kebab", description: "Meat & vegetables slow-cooked in a sealed pot.", price: "$26.99" },
  { id: 25, name: "Ali Nazik Kebab", description: "Smoked meat puree with grilled meat.", price: "$23.99" },
  { id: 26, name: "Hunkar Begendi", description: "Sautéed meat on creamy eggplant puree.", price: "$24.99" },
  { id: 27, name: "Sis Kebab", description: "Tender cubes of beef grilled on skewers.", price: "$20.99" },
  { id: 28, name: "Etli Ekmek", description: "Turkish flatbread with minced meat topping.", price: "$16.99" },
  { id: 29, name: "Karniyarik", description: "Stuffed eggplant with spiced minced meat.", price: "$18.99" },
  { id: 30, name: "Imam Bayildi", description: "Stuffed eggplant with olive oil & herbs.", price: "$17.99" },
];

const GRILLS_ITEMS = [
  { id: 31, name: "Chicken Shish Tawook", description: "Marinated chicken cubes grilled to perfection.", price: "$18.99" },
  { id: 32, name: "Lamb Chops", description: "Tender lamb chops seasoned & grilled.", price: "$28.99" },
  { id: 33, name: "Sultan's Mixed Platter", description: "A royal platter of kebabs, lamb, chicken & sides.", price: "$45.99" },
  { id: 34, name: "Ottoman Royal Grill", description: "Premium selection Ottoman-style grills.", price: "$49.99" },
  { id: 35, name: "Turkish Steak Platter", description: "Grilled steak with sides & special sauce.", price: "$34.99" },
  { id: 36, name: "Arabic BBQ Platter", description: "Mix of BBQ favorites with rice & dips.", price: "$39.99" },
  { id: 37, name: "Grilled Sea Bass", description: "Fresh sea bass grilled with herbs.", price: "$29.99" },
  { id: 38, name: "Charcoal Chicken", description: "Whole chicken grilled over charcoal.", price: "$22.99" },
  { id: 39, name: "Lamb Ribs", description: "Slow-cooked lamb ribs with BBQ glaze.", price: "$27.99" },
  { id: 40, name: "Castle Feast Family Tray", description: "A grand feast for the whole family.", price: "$85.99" },
];

const DESSERT_ITEMS = [
  { id: 41, name: "Kunafa", description: "Crispy shredded pastry with sweet cheese & syrup.", price: "$9.99" },
  { id: 42, name: "Baklava", description: "Layers of filo pastry with nuts & honey.", price: "$8.99" },
  { id: 43, name: "Turkish Delight", description: "Traditional rose-flavored delight with powdered sugar.", price: "$6.99" },
  { id: 44, name: "Umm Ali", description: "Classic Arabic bread pudding with nuts & creamy milk.", price: "$8.99" },
  { id: 45, name: "Sutlac (Turkish Rice Pudding)", description: "Creamy rice pudding with cinnamon.", price: "$7.99" },
];

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        position: 'fixed',
        top: '1.5vh',
        right: '1.5vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        border: '1px solid rgba(212,175,55,0.5)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        cursor: 'pointer',
        zIndex: 100,
      }}
    >
      <Printer style={{ color: '#d4af37', width: '24px', height: '24px' }} />
    </button>
  );
}

function MenuApp() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 6;

  const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <CoverPage />;
      case 1:
        return <ContentPage pageNumber={1} heading="Arabic Specialties" items={ARABIC_ITEMS} layout="single" />;
      case 2:
        return <ContentPage pageNumber={2} heading="Turkish Specialties" items={TURKISH_ITEMS} layout="two-column" />;
      case 3:
        return <ContentPage pageNumber={3} heading="Chef Signatures & Premium Grills" items={GRILLS_ITEMS} layout="two-column" />;
      case 4:
        return <ContentPage pageNumber={4} heading="Desserts & Premium Selections" items={DESSERT_ITEMS} layout="single" />;
      case 5:
        return <ClosingPage />;
      default:
        return <CoverPage />;
    }
  };

  return (
    <div className="stage">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
        <div className="a4-box">
          {renderPage()}
        </div>
        <NavControls 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPrev={handlePrev} 
          onNext={handleNext} 
        />
      </div>
      
      <PrintButton />
      
      {currentPage > 0 && currentPage < 5 && (
        <div 
          className="page-total no-print" 
          style={{
            position: 'fixed',
            bottom: '2vh',
            right: '2vw',
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: '11px',
            color: 'rgba(212,175,55,0.5)',
            zIndex: 100,
          }}
        >
          Page {currentPage} of 4
        </div>
      )}
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