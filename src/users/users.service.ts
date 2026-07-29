import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
      include: { customerProfile: true },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.db.user.create({
      data,
    });
  }
}
