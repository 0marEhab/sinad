import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      name: registerDto.name,
    });

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_ACCESS_SECRET || 'sinad-access-secret-key-123456789',
      expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET || 'sinad-refresh-secret-key-987654321',
      expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as any,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_ACCESS_SECRET || 'sinad-access-secret-key-123456789',
      expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET || 'sinad-refresh-secret-key-987654321',
      expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as any,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_ACCESS_SECRET || 'sinad-access-secret-key-123456789',
      expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET || 'sinad-refresh-secret-key-987654321',
      expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as any,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
