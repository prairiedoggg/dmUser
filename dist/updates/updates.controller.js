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
exports.UpdatesController = void 0;
const common_1 = require("@nestjs/common");
const updates_service_1 = require("./updates.service");
const update_user_profile_dto_1 = require("./dto/update-user-profile.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UpdatesController = class UpdatesController {
    constructor(updatesService) {
        this.updatesService = updatesService;
    }
    updateUserProfile(req, updateUserProfileDto) {
        const userId = req.user.userId;
        return this.updatesService.updateUserProfile(userId, updateUserProfileDto);
    }
};
exports.UpdatesController = UpdatesController;
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_profile_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", void 0)
], UpdatesController.prototype, "updateUserProfile", null);
exports.UpdatesController = UpdatesController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [updates_service_1.UpdatesService])
], UpdatesController);
//# sourceMappingURL=updates.controller.js.map