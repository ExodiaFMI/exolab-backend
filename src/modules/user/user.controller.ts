import { JsonController, Get, Post, Delete, Param, Body } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserService } from './user.service';
import { User } from './user.entity';

@JsonController('/users')
@OpenAPI({ tags: ['Users'] })
export class UserController {
  private userService = UserService.getInstance();

  @Get('/')
  @OpenAPI({ summary: 'Retrieves all users' })
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Retrieves a user by ID' })
  getUserById(@Param('id') id: number): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Post('/')
  @OpenAPI({ summary: 'Creates a new user' })
  createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.registerUser(userData);
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Deletes a user by ID' })
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
