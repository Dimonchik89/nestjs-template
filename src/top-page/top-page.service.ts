import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel.name) private topPageModel: Model<TopPageModel>,
	) {}

	async create(dto: CreateTopPageDto): Promise<TopPageModel> {
		return this.topPageModel.create(dto);
	}

	async findById(id: string): Promise<TopPageModel> {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findByCategory(
		firstCategory: TopLevelCategory,
	): Promise<TopPageModel[]> {
		return this.topPageModel
			.aggregate([
				{
					$match: {
						firstCategory,
					},
				},
				{
					$group: {
						_id: { secondCategory: '$secondCategory' },
						pages: { $push: { alias: '$alias', title: '$title' } },
					},
				},
			])
			.exec(); // вторым параметром список полей для передачи, получим не всю таблицу а указанные поля

		// альтернативная запись агрегации
		// return this.topPageModel
		// 	.aggregate()
		// 	.match({
		// 		firstCategory,
		// 	})
		// 	.group({
		// 		_id: { secondCategory: '$secondCategory' },
		// 		pages: { $push: { alias: '$alias', title: '$title' } },
		// 	}).exec();
	}

	// полнотекстовый поиск по индексированным в моделе полям
	async findByText(text: string) {
		return this.topPageModel
			.find({ $text: { $search: text, $caseSensitive: false } })
			.exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateTopPageDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
}
