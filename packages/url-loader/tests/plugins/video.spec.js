import { Cloudinary } from '@cloudinary/url-gen';

import * as videoPlugin from '../../src/plugins/video';

const { plugin } = videoPlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

describe('Plugins', () => {
  describe('Video', () => {
    it('should include sp_auto on a video with streamingProfile of auto', () => {
      const src = 'turtle.mp4';
      const cldVideo = cld.video(src);
      const streamingProfile = 'auto';
      plugin({ cldAsset: cldVideo, options: {
        assetType: 'video',
        src,
        streamingProfile
      } });
      expect(cldVideo.toURL()).toContain(`video/upload/sp_${streamingProfile}/${src}`);
    }); 

    it('should include streamingProfile with subtitles', () => {
      const src = 'turtle.mp4';
      const streamingProfile = 'sd:subtitles_((code_en-US;file_outdoors.vtt);(code_es-ES;file_outdoors-es.vtt))';
      const cldVideo = cld.video(src);
      plugin({ cldAsset: cldVideo, options: {
        assetType: 'video',
        src,
        streamingProfile
      } });
      expect(cldVideo.toURL()).toContain(`video/upload/sp_${streamingProfile}/${src}`);
    }); 
  });
});
