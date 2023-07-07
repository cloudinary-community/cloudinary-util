import { z } from 'zod';
import { IAnalyticsOptions } from '@cloudinary/url-gen/sdkAnalytics/interfaces/IAnalyticsOptions';

export const analyticsOptionsSchema: z.ZodType<IAnalyticsOptions> = z.any();

export type AnalyticsOptions = z.TypeOf<typeof analyticsOptionsSchema>;