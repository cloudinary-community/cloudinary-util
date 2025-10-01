import { constructTransformation, promptArrayToString } from './constructTransformation';

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
      test: (value) => Array.isArray(value),
      convert: (value) => value.join(':')
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
      test: (value) => Array.isArray(value),
      convert: (value) => value.join(':')
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

  it('should apply multiple converters in order', () => {
    const converters = [
      { test: (v) => typeof v === 'number', convert: (v: number) => v + 1 },
      { test: (v) => typeof v === 'number', convert: (v: number) => v * 2 }
    ];
    const transformation = constructTransformation({
      qualifier: 'w',
      value: 5,
      converters
    });
    expect(transformation).toBe('w_12'); // (5 + 1) * 2
  });

  it('should return undefined if value is true but qualifier is missing', () => {
    const transformation = constructTransformation({
      value: true
    });
    expect(transformation).toBeUndefined();
  });

  it('should return undefined if value is null', () => {
    const transformation = constructTransformation({
      qualifier: 'x',
      value: null
    });
    expect(transformation).toBeUndefined();
  });
});

describe('promptArrayToString', () => {
  it('should convert an array of strings to a single string with parentheses and semicolons', () => {
    const result = promptArrayToString(['hello', 'world', 'test']);
    expect(result).toBe('(hello;world;test)');
  });

  it('should return empty parentheses for an empty array', () => {
    const result = promptArrayToString([]);
    expect(result).toBe('()');
  });

  it('should handle array with one element', () => {
    const result = promptArrayToString(['single']);
    expect(result).toBe('(single)');
  });
});
