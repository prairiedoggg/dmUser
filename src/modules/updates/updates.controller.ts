import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('user')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Request() req) {
    const userId = req.user.userId;
    return this.updatesService.getUserProfile(userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateUserProfile(@Request() req, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    const userId = req.user.userId;
    return this.updatesService.updateUserProfile(userId, updateUserProfileDto);
  }
}
