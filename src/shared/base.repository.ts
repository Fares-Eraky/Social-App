import { Model, FilterQuery, QueryOptions, Document } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    return await this.model.find(filter, null, options).exec();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }
}
