import { z } from 'zod';

import ICloudinaryConfigurations from '@cloudinary/url-gen/config/interfaces/Config/ICloudinaryConfigurations';

export const configOptionsSchema: z.ZodType<ICloudinaryConfigurations> = z.any();

export type ConfigOptions = z.TypeOf<typeof configOptionsSchema>;