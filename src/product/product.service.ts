import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel.name) private productModel: Model<ProductModel>,
	) {}

	async create(dto: CreateProductDto) {
		return this.productModel.create(dto);
	}

	async findById(id: string) {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto) {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec(); // { new: true } указывает что после обновления вернуть новую сущность, по усолчанию возвращает старую
	}

	async findWithRewiews(dto: FindProductDto) {
		return this.productModel
			.aggregate([
				{
					$match: {
						categories: dto.category,
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$limit: dto.limit,
				},
				{
					$lookup: {
						// получаем данные из таблицы reviewmodels какие соответствуют _id полученного продукта
						from: 'reviewmodels', // газвание из запущенной базы данных (в vscode)
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews',
					},
				},
				{
					$addFields: {
						reviewCount: { $size: '$reviews' },
						reviewAvg: { $avg: '$reviews.rating' },
						reviews: {
							$function: {
								body: `function (reviews) {
									// сортируем полученные отзывы в порядке от нового, иначе получаем от старого
									reviews.sort(
										(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
									);
									return reviews;
								}`,
								args: ['$reviews'],
								lang: 'js',
							},
						},
					},
				},
			])
			.exec() as Promise<
			(ProductModel & {
				review: ReviewModel[];
				reviewCount: number;
				reviewAvg: number;
			})[]
		>;
	}
}
