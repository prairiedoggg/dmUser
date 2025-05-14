import { IsOptional, IsString, IsDateString, Matches } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  // Optional: Add regex if you need a specific format like YYYY-MM-DD
  // @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Birth date must be in YYYY-MM-DD format' })
  birth?: string; // Keep as string for simplicity, convert in service if needed

  @IsOptional()
  @IsString()
  job?: string;

  @IsOptional()
  @IsString()
  birth_time_division?: string;
} 

