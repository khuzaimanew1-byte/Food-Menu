import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { AssignSvc } from './assign.svc';

@Controller('roles')
export class RolesCtrl {
  constructor(private readonly svc: AssignSvc) {}

  @Get()
  list() { return this.svc.listRoles(); }

  @Post()
  create(@Body() body: { name: string }) {
    return this.svc.createRole(body.name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.svc.updateRole(id, body.name);
  }

  @Delete(':id')
  @HttpCode(204)
  del(@Param('id') id: string) {
    return this.svc.deleteRole(id);
  }
}
