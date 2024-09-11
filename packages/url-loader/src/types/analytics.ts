import type { IAnalyticsOptions } from "@cloudinary/url-gen/sdkAnalytics/interfaces/IAnalyticsOptions";
import { z } from "zod";

export interface CloudinaryAnalyticsOptions extends IAnalyticsOptions {}

export const analyticsOptionsSchema: z.ZodType<CloudinaryAnalyticsOptions> =
  z.any();

const { _output } = analyticsOptionsSchema;

export type AnalyticsOptions = typeof _output | false;
