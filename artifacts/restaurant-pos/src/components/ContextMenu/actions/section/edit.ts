import { activate } from '@/lib/edt/edtStore';

/** Edit Section — activate inline edit mode for this section heading. */
export function editSection(id: string | null): void {
  if (id == null) return;
  activate(id, 'section');
}
