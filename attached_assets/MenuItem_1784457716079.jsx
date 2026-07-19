import React from "react";

/* ============================================================
   MenuItem — Number → Thumbnail → Content → Price
   cqw sizing relative to A4Page's inline-size (210mm = 100cqw)
   ============================================================ */
function MenuItem({ number, name, price, description, thumbnail }) {
  return (
    <div style={styles.item}>
      <div style={styles.number}>
        <span style={styles.numberInner}>{number}</span>
      </div>

      <div style={styles.thumbOuter}>
        <div style={styles.thumbInner}>
          <div
            style={{
              ...styles.thumb,
              backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
            }}
          />
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.row}>
          <span style={styles.name}>{name}</span>
          <span style={styles.leader} />
          <span style={styles.price}>{price}</span>
        </div>
        <p style={styles.desc}>{description}</p>
      </div>
    </div>
  );
}

function A4Page({ children }) {
  return <div style={styles.page}>{children}</div>;
}

export default function MenuDemo() {
  const items = [
    {
      number: 1,
      name: "Lamb shank",
      price: "Rs. 1,450",
      description: "Slow-braised bone-in shank, finished with a smoked garlic jus.",
      thumbnail:
        "https://images.unsplash.com/photo-1633436375153-d7045cb93e38?w=400",
    },
    {
      number: 2,
      name: "Herb tossed fries",
      price: "Rs. 450",
      description: "Crisp-cut fries tossed with parsley, garlic, and sea salt.",
      thumbnail:
        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400",
    },
    {
      number: 3,
      name: "Berry stack pancakes",
      price: "Rs. 620",
      description: "Buttermilk stack layered with blueberries, strawberries & maple.",
      thumbnail:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400",
    },
  ];

  return (
    <div style={{ background: "#050403", padding: "32px 16px", minHeight: "100%" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Jost:wght@300;400;500&display=swap"
      />
      <A4Page>
        {items.map((it) => (
          <MenuItem key={it.number} {...it} />
        ))}
      </A4Page>
    </div>
  );
}

const styles = {
  page: {
    containerType: "inline-size",
    containerName: "menu-page",
    aspectRatio: "210 / 297",
    width: "100%",
    maxWidth: 640,
    margin: "0 auto",
    background:
      "radial-gradient(120% 90% at 50% 0%, #17130F 0%, #0C0A08 60%, #070605 100%)",
    padding: "6cqw 5.4cqw",
    overflowY: "auto",
    resize: "horizontal",
    minWidth: 280,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "2.8cqw",
    paddingBlock: "3.6cqw",
  },
  number: {
    flex: "0 0 3.6cqw",
    width: "3.6cqw",
    height: "3.6cqw",
    border: "1.3px solid #C9A76A",
    transform: "rotate(45deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(201,167,106,0.14), rgba(201,167,106,0.02))",
  },
  numberInner: {
    transform: "rotate(-45deg)",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 600,
    fontSize: "clamp(10px, 1.6cqw, 14px)",
    color: "#EDD9AC",
  },
  thumbOuter: {
    flex: "0 0 11.6cqw",
    width: "11.6cqw",
    padding: "0.32cqw",
    border: "1px solid rgba(201, 167, 106, 0.55)",
    boxShadow: "0 0.5cqw 1.4cqw rgba(0,0,0,0.55)",
  },
  thumbInner: {
    border: "1px solid rgba(201, 167, 106, 0.28)",
    overflow: "hidden",
  },
  thumb: {
    width: "100%",
    aspectRatio: "4 / 3",
    background: "#211C15",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "sepia(0.22) saturate(1.15) contrast(1.08) brightness(0.92)",
  },
  content: {
    flex: "1 1 auto",
    minWidth: 0,
  },
  row: {
    display: "flex",
    alignItems: "baseline",
    gap: "1.2cqw",
    marginBottom: "0.9cqw",
    flexWrap: "nowrap",
  },
  name: {
    flex: "0 1 auto",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 600,
    textTransform: "uppercase",
    fontSize: "clamp(12px, 2.15cqw, 19px)",
    letterSpacing: "0.06em",
    color: "#F8F2E3",
  },
  leader: {
    flex: "1 1 0",
    minWidth: "0.8cqw",
    height: "1px",
    alignSelf: "center",
    background:
      "linear-gradient(to right, rgba(201,167,106,0.5), rgba(201,167,106,0.08))",
  },
  price: {
    flex: "0 0 auto",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 700,
    fontStyle: "italic",
    fontSize: "clamp(12px, 1.95cqw, 17px)",
    letterSpacing: "0.02em",
    backgroundImage:
      "linear-gradient(180deg, #F3DFA8 0%, #C9A15A 55%, #E6C583 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    whiteSpace: "nowrap",
  },
  desc: {
    fontFamily: "'Jost', -apple-system, sans-serif",
    fontSize: "clamp(9px, 1.5cqw, 13px)",
    fontWeight: 300,
    letterSpacing: "0.01em",
    lineHeight: 1.7,
    color: "#ABA08D",
    maxWidth: "44cqw",
    margin: 0,
  },
};
