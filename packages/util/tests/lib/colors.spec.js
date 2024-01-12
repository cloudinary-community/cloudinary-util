import { describe, it, expect } from 'vitest';

import { testColorIsHex, convertColorHexToRgb } from '../../src/lib/colors';

describe('colors', () => {
  describe('testColorIsHex', () => {
    it('should return true if is a hex with #', () => {
      const value = '#ff00ff';
      expect(testColorIsHex(value)).toBe(true)
    });
    it('should return false if is not a hex with #', () => {
      const value = 'ff00ff';
      expect(testColorIsHex(value)).toBe(false)
    });
  })

  describe('convertColorHexToRgb', () => {
    it('should convert a hex with # to Cloudinary rgb value', () => {
      const value = 'ff00ff';
      expect(convertColorHexToRgb(`#${value}`)).toBe(`rgb:${value}`)
    });
  })

})