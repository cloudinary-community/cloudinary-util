import { z } from 'zod';
import ICloudinaryConfigurations from '@cloudinary/url-gen/config/interfaces/Config/ICloudinaryConfigurations';

export interface CloudinaryConfigurationOptions extends ICloudinaryConfigurations {}

export const configOptionsSchema: z.ZodType<CloudinaryConfigurationOptions> = z.any();

export type ConfigOptions = z.TypeOf<typeof configOptionsSchema>;