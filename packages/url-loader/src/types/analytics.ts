import { z } from 'zod';
import { IAnalyticsOptions } from '@cloudinary/url-gen/sdkAnalytics/interfaces/IAnalyticsOptions';

export type CloudinaryAnalyticsOptions = IAnalyticsOptions;

// Analytics Options

export const analyticsOptionsSchema: z.ZodType<CloudinaryAnalyticsOptions> = z.any();

export type AnalyticsOptions = z.TypeOf<typeof analyticsOptionsSchema> | false;