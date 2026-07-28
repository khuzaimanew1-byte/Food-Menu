export function triggerCfm(
  setFlash: (v: boolean) => void,
  onConfirm: () => void,
): void {
  setFlash(true);
  setTimeout(() => { setFlash(false); onConfirm(); }, 90);
}
