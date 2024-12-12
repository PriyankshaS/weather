import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import {JwtService} from '@nestjs/jwt';

const dummyUsers =[
    {
        id:'1',
        username: 'Priyanksha',
        password: 'Test'
    },
    {
        id:'2',
        username: 'TestUser',
        password: 'Test1'
    },
];

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) {}

    async validateUser({username, password}: AuthPayloadDto) {
        const findUser = dummyUsers.find((user) => user.username === username);
        if (password === findUser.password) {
            return findUser;
        }
        return null;
    }

    async signInUser(userId: string) {
        const payload = { user_id: userId };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}
