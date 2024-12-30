import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewModelDocument = HydratedDocument<ReviewModel>;

export interface ReviewModel extends Base {}

@Schema({ timestamps: true })
export class ReviewModel {
	@Prop()
	name: string;

	@Prop()
	title: string;

	@Prop()
	description: string;

	@Prop()
	rating: number;

	@Prop()
	productId: Types.ObjectId;
}

export const ReviewModelSchema = SchemaFactory.createForClass(ReviewModel);
