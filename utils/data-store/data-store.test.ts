import { DataStore } from '.';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('DataStore', () => {
  it('Zero refresh strategy should only fetch data once', async () => {
    let t = 0;
    const DS = new DataStore(
      async () => await sleep(50),
      'test',
      () => {
        t += 1;
        const m = new Map();
        m.set('foo', true);
        m.set('bar', true);
        return m;
      },
      0
    );

    const result = await DS.get('foo');
    await DS.get('foo');
    await DS.get('bar');

    expect(t).toBe(1);
    expect(result).toBe(true);
  });
});
