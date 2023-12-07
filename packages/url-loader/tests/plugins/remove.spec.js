import { Cloudinary } from "@cloudinary/url-gen";

import * as removePlugin from "../../src/plugins/remove";

const { plugin } = removePlugin;

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Remove", () => {
    it("should remove an object by string", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        remove: 'apple'
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_remove:prompt_apple`);
    });

    it("should remove an object by array", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        remove: ['apple', 'banana', 'orange']
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_remove:prompt_(apple;banana;orange)`);
    });

    

    // https://res.cloudinary.com/demo/image/upload/e_gen_remove:region_(x_300;y_200;w_1900;h_3500)/docs/man-skate.jpg
    // https://res.cloudinary.com/demo/image/upload/e_gen_remove:region_((x_300;y_200;w_750;h_500);(x_1800;y_1200;w_1000;h_800))/docs/accessories-bag.jpg
    // https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_phone;multiple_true/docs/gadgets.jpg
    // https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_(keyboard;phone;mouse)/docs/gadgets
    // https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_the woman;remove-shadow_true/docs/woman-shadow
    // https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_text/docs/display
    // https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_text:the big england flag/docs/britain


    it("should remove an object with object configuration", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        remove: {
          prompt: 'apple',
          multiple: true,
          removeShadow: true
        }
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_remove:prompt_apple;multiple_true;remove-shadow_true`);
    });

    it("should remove an object with region", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        remove: {
          region: [300, 200, 1900, 3500]
        }
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`region_(x_300;y_200;w_1900;h_3500)`);
    });

    it("should remove an object with multi-level region", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        remove: {
          region: [
            [300, 200, 1900, 3500],
            [123, 321, 750, 500]
          ]
        }
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`region_((x_300;y_200;w_1900;h_3500);(x_123;y_321;w_750;h_500))`);
    });

    it("should not allow both a prompt and a region", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        remove: {
          prompt: 'apple',
          region: [
            [300, 200, 1900, 3500],
            [123, 321, 750, 500]
          ]
        }
      };

      expect(() => plugin({
        cldAsset: cldImage,
        options,
      })).toThrow('Invalid remove options: you can not have both a prompt and a region. More info: https://cloudinary.com/documentation/transformation_reference#e_gen_remove')
    });

  });
});
