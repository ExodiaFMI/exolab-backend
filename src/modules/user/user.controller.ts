import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserService } from './user.service';
import { CreateUserDto, UserResponseDto } from './user.dto';

@JsonController('/users')
@OpenAPI({ tags: ['Users'] })
export class UserController {
  private userService = UserService.getInstance();

  @Get('/')
  @OpenAPI({
    summary: 'Retrieve all users',
    responses: {
      '200': {
        description: 'List of users',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponseDto' } } }
      }
    }
  })
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.getAllUsers();
    return users.map(user => new UserResponseDto(user));
  }

  @Get('/:id')
  @OpenAPI({
    summary: 'Retrieve a user by ID',
    responses: {
      '200': { description: 'User data', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponseDto' } } } },
      '404': { description: 'User not found' }
    }
  })
  async getUserById(@Param('id') id: number): Promise<UserResponseDto | null> {
    const user = await this.userService.getUserById(id);
    return user ? new UserResponseDto(user) : null;
  }

  @Post('/')
  @OpenAPI({
    summary: 'Create a new user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreateUserDto' }
        }
      }
    },
    responses: {
      '201': { description: 'User created successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponseDto' } } } }
    }
  })
  async createUser(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    const newUser = await this.userService.registerUser(userData);
    return new UserResponseDto(newUser);
  }

  @Delete('/:id')
  @OpenAPI({
    summary: 'Delete a user by ID',
    responses: {
      '204': { description: 'User deleted successfully' },
      '404': { description: 'User not found' }
    }
  })
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
