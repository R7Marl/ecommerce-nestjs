import { Body, Controller, Delete, Get, Query, UseGuards, Put, UseInterceptors, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryInterceptor } from 'src/interceptors/query.interceptors';
import { UUID } from 'crypto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDTO } from './dto/Update.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Roles as Role} from 'src/utils/roles/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiBearerAuth()
  @Delete()
  @UseGuards(AuthGuard)
  @Roles(Role.admin)
  async deleteUser(@Body('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return result;
  }
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UseInterceptors(QueryInterceptor)
  getUsers(@Req() request: any) {
    return this.usersService.getUsers(request.page, request.limit);
  }

  @ApiBearerAuth()
  @Get('/user')
  @UseGuards(AuthGuard)
  getUserById(@Query('id') id: UUID) {
    console.log(id)
    return this.usersService.getUserById(id);
  }
  @ApiBearerAuth()
  @Put('/update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin)
  async updateUserById(@Body() user: UpdateUserDTO) {
    return await this.usersService.updateUserById(user);
  }
}