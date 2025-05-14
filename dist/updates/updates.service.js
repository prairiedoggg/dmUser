"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_constants_1 = require("../constants/supabase.constants");
let UpdatesService = class UpdatesService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    create(createUpdateDto) {
        return 'This action adds a new update';
    }
    findAll() {
        return `This action returns all updates`;
    }
    findOne(id) {
        return `This action returns a #${id} update`;
    }
    update(id, updateUpdateDto) {
        return `This action updates a #${id} update`;
    }
    remove(id) {
        return `This action removes a #${id} update`;
    }
    async updateUserProfile(userId, updateUserProfileDto) {
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
                throw new common_1.NotFoundException(`User with ID ${userId} not found.`);
            }
            throw new common_1.InternalServerErrorException('Failed to update user profile.');
        }
        if (!data) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found or update failed.`);
        }
        return data;
    }
};
exports.UpdatesService = UpdatesService;
exports.UpdatesService = UpdatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_constants_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], UpdatesService);
//# sourceMappingURL=updates.service.js.map