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
    let { oneOf } = await cell.getValue();
    console.dir(oneOf);
    expect(oneOf).toContain(colors[0]);
    expect(oneOf).toContain(colors[1]);
    expect(oneOf).toContain(colors[2]);

    await cell.update({ oneOf: ['red', 'blue' ]});
    ({ oneOf } = await cell.getValue());
    expect(oneOf).toContain(colors[0]);
    expect(oneOf).toContain(colors[1]);
    expect(oneOf && oneOf.length).toBe(2);
  });

  it('can have process not values', async () => {
    const colors = ['red', 'blue', 'green'];
    const cell = createCell({ oneOf: colors });
    let { oneOf } = await cell.getValue();
    console.dir(oneOf);
    expect(oneOf).toContain(colors[0]);
    expect(oneOf).toContain(colors[1]);
    expect(oneOf).toContain(colors[2]);

    await cell.update({ oneOf: ['red', 'blue' ]});
    ({ oneOf } = await cell.getValue());
    expect(oneOf).toContain(colors[0]);
    expect(oneOf).toContain(colors[1]);
    expect(oneOf && oneOf.length).toBe(2);

    await cell.update({ isNot: ['red']});
    ({ oneOf } = await cell.getValue());
    expect(oneOf).toContain(colors[1]);
    expect(oneOf && oneOf.length).toBe(1);
    const { value } = await cell.getValue();
    expect(value).toBe('blue');
  });
});
