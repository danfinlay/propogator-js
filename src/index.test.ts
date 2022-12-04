import { createCell } from '.';

describe('Cell', () => {
  it('can have a value', async () => {
    const name = 'Huey';
    const cell = createCell({ value: name });
    const result = await cell.getValue();
    expect(result.value).toBe(name);
  });

  it('can have a list of values', async () => {
    const colors = ['red', 'blue', 'green'];
    const cell = createCell({ oneOf: colors });
    const { oneOf } = await cell.getValue();
    console.dir(oneOf);
    expect(oneOf).toContain(colors[0]);
    expect(oneOf).toContain(colors[1]);
    expect(oneOf).toContain(colors[2]);
  });
});
