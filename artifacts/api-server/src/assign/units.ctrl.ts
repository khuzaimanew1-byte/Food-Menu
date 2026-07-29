import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { AssignSvc } from './assign.svc';

@Controller('units')
export class UnitsCtrl {
  constructor(private readonly svc: AssignSvc) {}

  @Get()
  list() { return this.svc.listUnits(); }

  @Post()
  create(@Body() body: { name: string }) {
    return this.svc.createUnit(body.name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.svc.updateUnit(id, body.name);
  }

  @Delete(':id')
  @HttpCode(204)
  del(@Param('id') id: string) {
    return this.svc.deleteUnit(id);
  }
}
