import { JsonController, Post, Body } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@JsonController('/auth')
@OpenAPI({ tags: ['Authentication'] })
export class AuthController {
  private authService = new AuthService();

  @Post('/login')
  @OpenAPI({
    summary: 'User login',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/LoginDto' },
        },
      },
    },
    responses: {
      '200': { description: 'Successful login', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' } } } } } },
      '401': { description: 'Invalid credentials' },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
