import { Module }     from '@nestjs/common';
import { SectCtrl }  from './sects.ctrl';
import { ItemCtrl }  from './items.ctrl';
import { MenuSvc }   from './menu.svc';

@Module({
  controllers: [SectCtrl, ItemCtrl],
  providers:   [MenuSvc],
})
export class MenuMod {}
