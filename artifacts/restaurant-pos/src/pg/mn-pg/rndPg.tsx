import { CvrPg }  from '../../components/CvrPg';
import { ClsPg }  from '../../components/ClsPg';
import { CtntPg } from '../../components/CtntPg/CtntPg';
import type { PageData } from '../../lib/menu/paginate';
import type { ReactNode } from 'react';

export function rndPg(pg: number, pages: PageData[], ttlPg: number): ReactNode {
  if (pg === 0)         return <CvrPg />;
  if (pg === ttlPg - 1) return <ClsPg />;
  const pd = pages[pg - 1];
  return <CtntPg pgNum={pd.pgNum} sections={pd.sections} />;
}
