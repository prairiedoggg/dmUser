import { Inject, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../constants/supabase.constants';

@Injectable()
export class UpdatesService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  create(createUpdateDto: CreateUpdateDto) {
    return 'This action adds a new update';
  }

  findAll() {
    return `This action returns all updates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} update`;
  }

  update(id: number, updateUpdateDto: UpdateUpdateDto) {
    return `This action updates a #${id} update`;
  }

  remove(id: number) {
    return `This action removes a #${id} update`;
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('name, birth, job, birth_time_division') // Select only necessary fields
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      if (error.code === 'PGRST116') { // 'PGRST116' indicates that the query returned no rows
        throw new NotFoundException(`User profile with ID ${userId} not found.`);
      }
      throw new InternalServerErrorException('Failed to fetch user profile.');
    }

    if (!data) {
      // This case might be redundant due to PGRST116 handling, but good for safety
      throw new NotFoundException(`User profile with ID ${userId} not found.`);
    }

    // Ensure birth is returned as YYYY-MM-DD string if it's a Date object
    // Supabase typically returns date strings, but this is a safeguard.
    if (data.birth && data.birth instanceof Date) {
      data.birth = data.birth.toISOString().split('T')[0];
    }
    
    return data;
  }

  async updateUserProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto) {
    const updateData = Object.entries(updateUserProfileDto)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    if (Object.keys(updateData).length === 0) {
      return { message: 'No update data provided.' };
    }

    updateData['updated_at'] = new Date();

    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }
      throw new InternalServerErrorException('Failed to update user profile.');
    }

    if (!data) {
      throw new NotFoundException(`User with ID ${userId} not found or update failed.`);
    }

    return data;
  }
}
