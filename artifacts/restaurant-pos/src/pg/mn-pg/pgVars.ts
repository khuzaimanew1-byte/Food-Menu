export const pgVars = {
  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
};
