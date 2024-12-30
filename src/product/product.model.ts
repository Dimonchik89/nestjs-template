import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { HydratedDocument } from 'mongoose';

class ProductCharacteristic {
	@Prop()
	name: string;

	@Prop()
	value: string;
}

export type ProductModelDocument = HydratedDocument<ProductModel>;
export interface ProductModel extends Base {}

@Schema({ timestamps: true })
export class ProductModel extends TimeStamps {
	@Prop()
	image: string;

	@Prop()
	title: string;

	@Prop()
	price: number;

	@Prop()
	oldPrice?: number;

	@Prop()
	credit: number;

	@Prop()
	description: string;

	@Prop()
	advantages: string;

	@Prop()
	disAdvantages: string;

	@Prop({ type: () => [String] })
	categories: string[];

	@Prop({ type: () => [String] })
	tags: string[];

	@Prop({ type: () => [ProductCharacteristic], _id: false })
	characteristics: ProductCharacteristic[];
}

export const ProductModelSchema = SchemaFactory.createForClass(ProductModel);
