import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { FlagsPlugin } from "../../src/plugins/flags.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

describe("Plugins", () => {
  describe("Flags", () => {
    it("should include a flag on an image", () => {
      const src = "turtle";
      const assetType = "image";
      const cldVideo = cld.image(src);
      const flags = "keep_iptc";
      const options = {
        assetType,
        src,
        flags,
      } as const;

      FlagsPlugin.apply(cldVideo, options);

      expect(cldVideo.toURL()).toContain(
        `${assetType}/upload/fl_keep_iptc/${src}`,
      );
    });

    it("should add multiple flags to a video", () => {
      const src = "turtle.mp4";
      const assetType = "video";
      const cldVideo = cld.video(src);
      const flags = ["no_stream", "splice"] as const;

      const options = {
        assetType,
        src,
        flags,
      } as const;

      FlagsPlugin.apply(cldVideo, options);

      expect(cldVideo.toURL()).toContain(
        `${assetType}/upload/fl_no_stream/fl_splice/${src}`,
      );
    });

    it("should add custom flag definitions via object syntax", () => {
      const src = "turtle";
      const assetType = "image";
      const cldVideo = cld.image(src);
      const flags = {
        splice: "transition_(name_circleopen;du_2.5)",
        attachment: "space_jellyfish",
      };
      const flagsString = Object.entries(flags)
        .map(([q, v]) => `fl_${q}:${v}`)
        .join("/");

      const options = {
        assetType,
        src,
        flags,
      } as const;

      FlagsPlugin.apply(cldVideo, options);
      expect(cldVideo.toURL()).toContain(
        `${assetType}/upload/${flagsString}/${src}`,
      );
    });
  });
});
