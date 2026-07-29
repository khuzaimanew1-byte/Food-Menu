import { Module }       from '@nestjs/common';
import { AssignSvc }    from './assign.svc';
import { AssignsCtrl }  from './assigns.ctrl';
import { RolesCtrl }    from './roles.ctrl';
import { UnitsCtrl }    from './units.ctrl';

@Module({
  controllers: [AssignsCtrl, RolesCtrl, UnitsCtrl],
  providers:   [AssignSvc],
})
export class AssignMod {}
