// Mocking fetch to avoid real network requests during tests
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ message: 'Hello World' }),
});

// describe('fetchData', () => {
//   let t = 0;
//   const DS = new DataStore(
//     async () => await fetch('https://test.fr'),
//     'test',
//     () => {
//       t += 1;
//       const m = new Map();
//       m.set('foo', true);
//       m.set('bar', true);
//       return m;
//     },
//     1
//   );

//   it('should fetch data successfully', async () => {
//     const result = await DS.get('foo');
//     await DS.get('foo');
//     await DS.get('foo');
//     await DS.get('foo');
//     await DS.get('foo');
//     await DS.get('foo');
//     await DS.get('foo');
//     await DS.get('foo');
//     await DS.get('foo');
//     expect(t).toBe(1);
//     expect(result).toBe(true);
//     expect(fetch).toHaveBeenCalledWith('https://test.fr');
//   });
// });
