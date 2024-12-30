import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserEmail = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();

		return request.user; // по дефолту создает поле user и получим там данные какие отправили из jwt.strategy (наш email)
	},
);
