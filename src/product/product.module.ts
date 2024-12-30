import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModel, ProductModelSchema } from './product.model';
import { ProductService } from './product.service';

@Module({
	controllers: [ProductController],
	imports: [
		MongooseModule.forFeature([
			{
				name: ProductModel.name,
				schema: ProductModelSchema,
			},
		]),
	],
	providers: [ProductService],
})
export class ProductModule {}
