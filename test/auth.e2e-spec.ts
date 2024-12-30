import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import {
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';

const loginDto: AuthDto = {
	login: 'lalala@gmail.com',
	password: '123456',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
			});
	});

	it('/auth/login (POST) - fail email', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: '123@gmail.com' })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(USER_NOT_FOUND_ERROR);
			});
	});

	it('/auth/login (POST) - fail password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: '123' })
			.expect(401, {
				message: 'Не вiрний пароль',
				error: 'Unauthorized',
				statusCode: 401,
			});
	});

	afterAll(async () => {
		disconnect();
		await app.close();
	});
});
