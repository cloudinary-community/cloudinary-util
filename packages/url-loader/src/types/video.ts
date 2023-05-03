import type { AssetOptions, AssetOptionsResize } from './asset';

export interface VideoOptionsResize extends AssetOptionsResize {}

export interface VideoOptions extends AssetOptions {
  streamingProfile?: string;
}
