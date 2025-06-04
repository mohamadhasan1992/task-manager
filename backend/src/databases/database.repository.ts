import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { PaginatedResult, PaginationOptions, SortOptions } from '../interfaces/database.interface';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Create operations
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw this.handleError(error, 'CREATE');
    }
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      return await this.model.insertMany(data);
    } catch (error) {
      throw this.handleError(error, 'CREATE_MANY');
    }
  }

  // Read operations
  async findById(id: string, options?: Omit<FilterQuery<T>, 'pagination'>): Promise<T | null> {
    try {
      let query = this.model.findById(id);
      query = this.applyQueryOptions(query, options);
      return await query.exec();
    } catch (error) {
      throw this.handleError(error, 'FIND_BY_ID');
    }
  }

  async findOne(filter: FilterQuery<T>, options?: Omit<FilterQuery<T>, 'pagination'>): Promise<T | null> {
    try {
      let query = this.model.findOne(filter);
      query = this.applyQueryOptions(query, options);
      return await query.exec();
    } catch (error) {
      throw this.handleError(error, 'FIND_ONE');
    }
  }

  async findWithPagination(options?: FilterQuery<T>): Promise<PaginatedResult<T>> {
    try {
        const { page, limit, skip } = this.calculatePagination(options);
        const filter = {...options};
        delete filter.page    
        delete filter.limit    
        delete filter.skip    
        // Get total count for pagination
        const totalItems = await this.model.countDocuments(filter);
        
        // Build query
        let query = this.model.find(filter);
        // Omit 'pagination' property before passing to applyQueryOptions
        const queryOptions: Omit<FilterQuery<T>, 'pagination'> = options as Omit<FilterQuery<T>, 'pagination'>;
        query = this.applyQueryOptions(query, queryOptions);
        query = query.skip(skip).limit(limit);
        
        const data = await query.exec();

        return this.buildPaginatedResult(data, page, limit, totalItems);
    } catch (error) {
        throw this.handleError(error, 'FIND_WITH_PAGINATION');
    }
  }

  // Update operations
  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id, 
        update, 
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw this.handleError(error, 'UPDATE_BY_ID');
    }
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(
        filter, 
        update, 
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw this.handleError(error, 'UPDATE_ONE');
    }
  }


  // Delete operations
  async deleteById(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      throw this.handleError(error, 'DELETE_BY_ID');
    }
  }

  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndDelete(filter).exec();
    } catch (error) {
      throw this.handleError(error, 'DELETE_ONE');
    }
  }

  // Utility methods
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      throw this.handleError(error, 'COUNT');
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter).exec();
      return result !== null;
    } catch (error) {
      throw this.handleError(error, 'EXISTS');
    }
  }

  // Private helper methods
  private applyQueryOptions(query: any, options?: Omit<FilterQuery<T>, 'pagination'>): any {
    if (!options) return query;

    // Apply sorting
    if (options.sort) {
      query = query.sort(this.buildSortObject(options.sort));
    }

    // Apply field selection
    if (options.select) {
      const selectFields = Array.isArray(options.select) 
        ? options.select.join(' ') 
        : options.select;
      query = query.select(selectFields);
    }

    // Apply population
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach(pop => {
          query = query.populate(pop);
        });
      } else {
        query = query.populate(options.populate);
      }
    }

    return query;
  }

  private calculatePagination(pagination?: FilterQuery<T>) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = pagination?.skip !== undefined ? pagination.skip : (page - 1) * limit;

    return { page, limit, skip };
  }

  private buildSortObject(sort: SortOptions): Record<string, 1 | -1> {
    const sortObj: Record<string, 1 | -1> = {};
    
    Object.entries(sort).forEach(([key, value]) => {
      if (value === 'asc' || value === 1) {
        sortObj[key] = 1;
      } else if (value === 'desc' || value === -1) {
        sortObj[key] = -1;
      }
    });
    return sortObj;
  }

  private buildPaginatedResult<T>(
    data: T[], 
    page: number, 
    limit: number, 
    totalItems: number
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  protected handleError(error: any, operation: string): Error {
    const message = `Database ${operation} operation failed: ${error.message}`;
    console.error(message, error);
    
    // You can customize error handling based on error types
    if (error.name === 'ValidationError') {
      return new Error(`Validation failed: ${error.message}`);
    }
    
    if (error.name === 'CastError') {
      return new Error(`Invalid ID format: ${error.message}`);
    }
    
    return new Error(message);
  }
}