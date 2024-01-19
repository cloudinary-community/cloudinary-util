import { z } from 'zod';
import ICloudinaryConfigurations from '@cloudinary/url-gen/config/interfaces/Config/ICloudinaryConfigurations';

export type CloudinarConfigurationOptions = ICloudinaryConfigurations;

export const configOptionsSchema: z.ZodType<CloudinarConfigurationOptions> = z.any();

export type ConfigOptions = z.TypeOf<typeof configOptionsSchema>;