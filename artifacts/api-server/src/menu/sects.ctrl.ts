import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MenuSvc }  from './menu.svc';
import type { UpdSect } from '@workspace/db';

// [HTTP-CACHE] 10s shared cache for list; 30s for single-item reads
const LIST_CC  = 'public, max-age=10, stale-while-revalidate=30';
const ITEM_CC  = 'public, max-age=30, stale-while-revalidate=60';

@Controller('sects')
export class SectCtrl {
  constructor(private readonly svc: MenuSvc) {}

  @Get()
  async list(
    @Query('pg') pg = '0',
    @Query('sz') sz = '20',
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Cache-Control', LIST_CC);
    return this.svc.listSects(+pg, +sz);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', ITEM_CC);
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
