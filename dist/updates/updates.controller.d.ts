import { UpdatesService } from './updates.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
export declare class UpdatesController {
    private readonly updatesService;
    constructor(updatesService: UpdatesService);
    updateUserProfile(req: any, updateUserProfileDto: UpdateUserProfileDto): Promise<any>;
}
