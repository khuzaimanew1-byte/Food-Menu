import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode,
} from '@nestjs/common';
import { MenuSvc }  from './menu.svc';
import type { UpdSect } from '@workspace/db';

@Controller('sects')
export class SectCtrl {
  constructor(private readonly svc: MenuSvc) {}

  @Get()
  list(@Query('pg') pg = '0', @Query('sz') sz = '20') {
    return this.svc.listSects(+pg, +sz);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.getSect(id);
  }

  @Post()
  create(@Body() body: { name: string; shp?: string }) {
    return this.svc.createSect(body);
  }

  // [API-BULK]
  @Post('bulk')
  bulk(@Body() body: { items: { name: string; shp?: string }[] }) {
    return this.svc.bulkNewSect(body.items);
  }

  @Patch('reord')
  @HttpCode(204)
  reord(@Body() body: { ids: string[] }) {
    return this.svc.reordSects(body.ids);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdSect) {
    return this.svc.updSect(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  del(@Param('id') id: string) {
    return this.svc.delSect(id);
  }
}
