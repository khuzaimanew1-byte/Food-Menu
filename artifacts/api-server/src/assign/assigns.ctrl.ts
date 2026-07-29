import { Controller, Get, Post, Delete, Param, Body, Query, HttpCode } from '@nestjs/common';
import { AssignSvc, type UpsertAssignDto } from './assign.svc';

@Controller('assigns')
export class AssignsCtrl {
  constructor(private readonly svc: AssignSvc) {}

  /** GET /api/assigns?item_id=:id — returns full record or null */
  @Get()
  get(@Query('item_id') itemId: string) {
    return this.svc.getAssign(itemId);
  }

  /** POST /api/assigns — create or update full assign record (upsert by item_id) */
  @Post()
  upsert(@Body() body: UpsertAssignDto) {
    return this.svc.upsertAssign(body);
  }

  /** DELETE /api/assigns/:id — remove assign record (and cascades to emps/rsrcs) */
  @Delete(':id')
  @HttpCode(204)
  del(@Param('id') id: string) {
    return this.svc.deleteAssign(id);
  }
}
