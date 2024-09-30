// user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
// import { MockUserService } from './mockuser.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService ],
  exports: [UserService], // Export the UserService to make it available for other modules
})
export class UserModule {}
