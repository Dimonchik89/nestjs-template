import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { index } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { HydratedDocument } from 'mongoose';

export enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products,
}

export class HHData {
	@Prop()
	count: number;

	@Prop()
	juniorSalary: number;

	@Prop()
	middleSalary: number;

	@Prop()
	seniorSalary: number;
}

export class TopPageAdvantage {
	@Prop()
	title: string;

	@Prop()
	description: string;
}

export type TopPageModelDocument = HydratedDocument<TopPageModel>;
export interface TopPageModel extends Base {}

//@index({ title: 'text', seoText: 'text' }) // для полнотекстового поиска по нескольким полям
@index({ '$**': 'text' }) // индексирует всю таблицу для полнотекстового поля
@Schema({ timestamps: true })
export class TopPageModel {
	@Prop({ enum: TopLevelCategory })
	firstCategory: TopLevelCategory;

	@Prop()
	secondCategory: string;

	@Prop({ unique: true })
	alias: string;

	// @Prop({ text: true }) // { text: true } указывает что поле будет работать с полнотекстовым поиском. Подходит если поиск только по одному полю
	@Prop()
	title: string;

	@Prop()
	metaTitle: string;

	@Prop()
	metaDescription: string;

	@Prop()
	category: string;

	@Prop({ type: () => HHData })
	hh?: HHData;

	@Prop({ type: () => [TopPageAdvantage] })
	advantages: TopPageAdvantage[];

	@Prop()
	seoText: string;

	@Prop()
	tagsTitle: string[];

	@Prop({ type: () => [String] })
	tags: string[];
}

export const TopPageModelSchema = SchemaFactory.createForClass(TopPageModel);

// db.top_page_models.dropIndexes()  // Удаляет все старые индексы
// db.top_page_models.createIndex({ "$**": "text" })  // Создаёт текстовый индекс для всех полей
