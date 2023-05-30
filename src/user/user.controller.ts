import {
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRequestCreateDto } from '@app/user/dto/swagger/userRequestCreate.dto';
import {
  ApiBody,
  ApiTags,
  ApiCreatedResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserBuildResponseDto } from '@app/user/dto/userBuildResponse.dto';
import { UserLoginDto } from '@app/user/dto/userLogin.dto';
import { UserRequestLoginDto } from '@app/user/dto/swagger/userRequestLogin.dto';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { UserUpdateDto } from '@app/user/dto/userUpdate.dto';
import { UserRequestUpdateDto } from './dto/swagger/userRequestUpdate.dto';
import { UserBuildClearResponseDto } from './dto/userBuildClearResponse.dto';
import { Token } from '@app/auth/iterface/auth.interface';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @ApiBody({ type: UserRequestCreateDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async createUsers(
    @Body('user') userCreateDto: UserCreateDto,
  ): Promise<UserBuildResponseDto> {
    return await this.userService.createUsers(userCreateDto);
  }

  @Post('users/login')
  @ApiBody({ type: UserRequestLoginDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') userLoginDto: UserLoginDto,
  ): Promise<UserBuildResponseDto> {
    return await this.userService.login(userLoginDto);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization: Token jwt.token.here',
  })
  @ApiBody({ type: UserRequestLoginDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async getUserAuth(
    @Headers('Authorization') auth: string | undefined,
  ): Promise<UserBuildResponseDto> {
    return await this.userService.getUserCurrent(auth);
  }

  // @Get('user/:id')
  // @ApiCreatedResponse({ type: UserBuildResponseDto })
  // async getUserById(
  //   @Param('id') id: number,
  // ): Promise<UserBuildClearResponseDto> {
  //   const user = await this.userService.getUserById(+id);
  //   return this.userService.buildUserClearResponse(user);
  // }

  @UseGuards(AuthGuard)
  @Put('user')
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization: Token jwt.token.here',
  })
  @ApiBody({ type: UserRequestUpdateDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async updateCurrentUser(
    @Headers('Authorization') auth: Token,
    @Body('user') userUpdateDto: UserUpdateDto,
  ): Promise<UserBuildResponseDto> {
    return await this.userService.updateUser(userUpdateDto, auth);
  }
}
