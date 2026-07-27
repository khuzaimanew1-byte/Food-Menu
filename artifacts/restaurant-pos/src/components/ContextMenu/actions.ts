// ── Context menu action router ────────────────────────────────────────────
// Re-exports from the modular actions/index.ts so existing import paths
// ("./actions") continue to resolve without changes in MnPg.tsx or elsewhere.
// All logic lives in actions/index.ts and its action sub-files.

export { dispatchCtxAction } from './actions/index';
