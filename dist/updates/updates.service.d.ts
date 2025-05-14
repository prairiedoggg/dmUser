import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class UpdatesService {
    private supabase;
    constructor(supabase: SupabaseClient);
    create(createUpdateDto: CreateUpdateDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUpdateDto: UpdateUpdateDto): string;
    remove(id: number): string;
    updateUserProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<any>;
}
