import { Controller, Get, Patch, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/admin')
// @UseGuards(AuthGuard('jwt')) // In a real app we'd also check if req.user.role === 'ADMIN'
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('orders')
  async getOrders() {
    return this.adminService.getAllOrders();
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateOrderStatus(id, status);
  }

  @Get('coupons')
  async getCoupons() {
    return this.adminService.getAllCoupons();
  }

  @Post('coupons')
  async createCoupon(@Body() body: any) {
    return this.adminService.createCoupon(body);
  }
}
