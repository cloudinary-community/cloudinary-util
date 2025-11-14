import { describe, it, expect } from 'vitest';
import { constructTransformation, promptArrayToString } from '../../src/lib/transformations';

describe('constructTransformation', () => {
  it('should construct a transformation string with a prefix, qualifier, and string value', () => {
    const transformation = constructTransformation({
      prefix: 'w',
      qualifier: 'width',
      value: '100'
    });
    expect(transformation).toBe('w_width:100');
  });

  it('should construct a transformation string with a prefix, qualifier, and number value', () => {
    const transformation = constructTransformation({
      prefix: 'h',
      qualifier: 'height',
      value: 250
    });
    expect(transformation).toBe('h_height:250');
  });

  it('should construct a transformation string with a qualifier and value when no prefix is provided', () => {
    const transformation = constructTransformation({
      qualifier: 'c',
      value: 'fill'
    });
    expect(transformation).toBe('c_fill');
  });

  it('should construct a transformation with only prefix and qualifier for a boolean true value', () => {
    const transformation = constructTransformation({
      prefix: 'e',
      qualifier: 'grayscale',
      value: true
    });
    expect(transformation).toBe('e_grayscale');
  });

  it('should construct a transformation with only prefix and qualifier for a string "true" value', () => {
    const transformation = constructTransformation({
      prefix: 'e',
      qualifier: 'sharpen',
      value: 'true'
    });
    expect(transformation).toBe('e_sharpen');
  });

  it('should return only the qualifier when value is true and there is no prefix', () => {
    const transformation = constructTransformation({
      qualifier: 'grayscale',
      value: true
    });
    expect(transformation).toBe('grayscale');
  });

  it('should apply converters to the value if the test passes', () => {
    const converters = [{
      test: (value: any) => Array.isArray(value),
      convert: (value: any) => value.join(':')
    }];
    const transformation = constructTransformation({
      qualifier: 'co',
      value: ['rgb', '2bff00'],
      converters
    });
    expect(transformation).toBe('co_rgb:2bff00');
  });

  it('should not apply a converter if the test fails', () => {
    const converters = [{
      test: (value: any) => Array.isArray(value),
      convert: (value: any) => value.join(':')
    }];
    const transformation = constructTransformation({
      qualifier: 'w',
      value: 900,
      converters
    });
    expect(transformation).toBe('w_900');
  });

  it('should correctly handle a value of 0', () => {
    const transformation = constructTransformation({
      qualifier: 'q',
      value: 0
    });
    expect(transformation).toBe('q_0');
  });

  it('should correctly handle an empty string value', () => {
    const transformation = constructTransformation({
      prefix: 'l',
      qualifier: 'text',
      value: ''
    });
    expect(transformation).toBe('l_text:');
  });

  it('should return undefined if the value is not a boolean, string, or number', () => {
    const transformation = constructTransformation({
      qualifier: 'a',
      value: undefined
    });
    expect(transformation).toBeUndefined();
  });

  it('should return undefined for a boolean false value', () => {
    const transformation = constructTransformation({
      qualifier: 'e',
      value: false
    });
    expect(transformation).toBeUndefined();
  });
});

describe('promptArrayToString', () => {
  it('should convert an array of strings to a single string with parentheses and semicolons', () => {
    const result = promptArrayToString(['hello', 'world']);
    expect(result).toBe('(hello;world)');
  });
});
