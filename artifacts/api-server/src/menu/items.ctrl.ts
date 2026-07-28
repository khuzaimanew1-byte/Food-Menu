import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode,
} from '@nestjs/common';
import { MenuSvc }  from './menu.svc';
import type { UpdItem } from '@workspace/db';

@Controller('items')
export class ItemCtrl {
  constructor(private readonly svc: MenuSvc) {}

  @Get()
  list(
    @Query('sectId') sectId: string,
    @Query('pg') pg = '0',
    @Query('sz') sz = '20',
  ) {
    return this.svc.listItems(sectId, +pg, +sz);
  }

  // [API-FIELDS] prevent N+1 — fetch items for many sections at once
  @Post('query')
  queryBulk(@Body() body: { sectIds: string[]; pg?: number; sz?: number }) {
    return this.svc.listItemsBulk(body.sectIds, body.pg ?? 0, body.sz ?? 100);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.getItem(id);
  }

  @Post()
  create(@Body() body: { sect_id: string; name: string; dsc?: string; price?: string; img?: string; shp?: string }) {
    return this.svc.createItem(body);
  }

  // [API-BULK]
  @Post('bulk')
  bulk(@Body() body: { items: Parameters<MenuSvc['createItem']>[0][] }) {
    return this.svc.bulkNewItem(body.items);
  }

  @Patch('reord')
  @HttpCode(204)
  reord(@Body() body: { ids: string[]; sectId?: string }) {
    return this.svc.reordItems(body.ids, body.sectId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdItem) {
    return this.svc.updItem(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  del(@Param('id') id: string) {
    return this.svc.delItem(id);
  }
}
