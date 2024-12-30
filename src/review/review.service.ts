import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewModel } from './review.model';
import { DeleteResult, Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(ReviewModel.name) private reviewModel: Model<ReviewModel>,
	) {}

	async create(dto: CreateReviewDto): Promise<ReviewModel> {
		// return await this.reviewModel.create(dto);
		return await this.reviewModel.create({
			...dto,
			productId: new Types.ObjectId(dto.productId),
		});
	}

	async delete(id: string): Promise<ReviewModel | null> {
		return await this.reviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<ReviewModel[]> {
		return this.reviewModel
			.find({
				productId,
				// productId: new Types.ObjectId(productId), // если будет ошибка то убрать создание new Types.ObjectId и просто передавать productId
			})
			.exec();
	}

	async deleteProductId(productId: string) {
		return this.reviewModel.deleteMany({ productId }).exec();
	}
}
