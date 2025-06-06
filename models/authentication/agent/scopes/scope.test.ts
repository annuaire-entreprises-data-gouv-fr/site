import { Scopes } from '.';
import { IAgentScope } from './constants';

describe('Scopes', () => {
  describe('constructor', () => {
    it('should handle empty input', () => {
      const scopes = new Scopes();
      expect(scopes.scopes).toEqual([]);
      expect(scopes.hasScopes()).toBe(false);
    });

    it('should handle string scopes', () => {
      const scopes = new Scopes();
      scopes.add(['conformite', 'beneficiaires']);
      expect(scopes.scopes).toEqual(['conformite', 'beneficiaires']);
      expect(scopes.hasScopes()).toBe(true);
    });

    it('should handle array scopes', () => {
      const inputScopes: IAgentScope[] = ['rne', 'nonDiffusible'];
      const scopes = new Scopes();
      scopes.add(inputScopes);
      expect(scopes.scopes).toEqual(['rne', 'nonDiffusible']);
      expect(scopes.hasScopes()).toBe(true);
    });

    it('should handle mixed string and array inputs using add method', () => {
      const inputArray: IAgentScope[] = ['conformite', 'beneficiaires'];
      const scopes = new Scopes();
      scopes.add(['rne', 'nonDiffusible']);
      scopes.add(inputArray);
      expect(scopes.scopes).toEqual([
        'rne',
        'nonDiffusible',
        'conformite',
        'beneficiaires',
      ]);
    });

    it('should remove duplicates when using add method', () => {
      const inputArray: IAgentScope[] = ['conformite', 'rne'];
      const scopes = new Scopes();
      scopes.add(['rne', 'nonDiffusible']);
      scopes.add(inputArray);
      expect(scopes.scopes).toEqual(['rne', 'nonDiffusible', 'conformite']);
      expect(scopes.length).toBe(3);
    });

    it('should handle undefined inputs using add method', () => {
      const inputArray: IAgentScope[] = ['conformite'];
      const scopes = new Scopes();
      scopes.add(['rne']);
      expect(scopes.scopes).toEqual(['rne']);
      scopes.add(inputArray);
      expect(scopes.scopes).toEqual(['rne', 'conformite']);
      expect(scopes.length).toBe(2);
    });
  });

  describe('methods', () => {
    let scopes: Scopes;

    beforeEach(() => {
      scopes = new Scopes();
      scopes.add(['conformite', 'beneficiaires']);
      scopes.add(['rne']);
    });

    it('should check if scope exists', () => {
      expect(scopes.hasScope('conformite')).toBe(true);
      expect(scopes.hasScope('beneficiaires')).toBe(true);
      expect(scopes.hasScope('rne')).toBe(true);
      expect(scopes.hasScope('administrateur')).toBe(false);
    });

    it('should convert to array', () => {
      const array = scopes.toArray();
      expect(Array.isArray(array)).toBe(true);
      expect(array).toEqual(['conformite', 'beneficiaires', 'rne']);
    });

    it('should handle empty string input', () => {
      const emptyScopes = new Scopes();
      emptyScopes.add([]);
      expect(emptyScopes.hasScopes()).toBe(false);
      expect(emptyScopes.length).toBe(0);
    });
  });

  describe('add method', () => {
    it('should add new scopes to existing collection', () => {
      const scopes = new Scopes();
      scopes.add(['conformite']);
      scopes.add(['beneficiaires', 'rne']);
      expect(scopes.scopes).toEqual(['conformite', 'beneficiaires', 'rne']);
      expect(scopes.length).toBe(3);
    });

    it('should add array of scopes', () => {
      const scopes = new Scopes();
      scopes.add(['conformite']);
      scopes.add(['beneficiaires', 'rne']);
      expect(scopes.scopes).toEqual(['conformite', 'beneficiaires', 'rne']);
      expect(scopes.length).toBe(3);
    });

    it('should handle undefined input', () => {
      const scopes = new Scopes();
      scopes.add(['conformite']);
      expect(scopes.scopes).toEqual(['conformite']);
      expect(scopes.length).toBe(1);
    });

    it('should deduplicate when adding existing scopes', () => {
      const scopes = new Scopes();
      scopes.add(['conformite', 'beneficiaires']);
      scopes.add(['conformite', 'rne']);
      expect(scopes.scopes).toEqual(['conformite', 'beneficiaires', 'rne']);
      expect(scopes.length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple duplicate scopes using add method', () => {
      const scopes = new Scopes();
      scopes.add(['conformite', 'beneficiaires', 'conformite']);
      scopes.add(['beneficiaires', 'rne']);
      scopes.add(['rne', 'conformite']);
      expect(scopes.scopes).toEqual(['conformite', 'beneficiaires', 'rne']);
      expect(scopes.length).toBe(3);
    });

    it('should maintain order while removing duplicates', () => {
      const scopes = new Scopes();
      scopes.add(['conformite', 'beneficiaires']);
      scopes.add(['rne', 'conformite']);
      // Should maintain first occurrence order
      expect(scopes.scopes).toEqual(['conformite', 'beneficiaires', 'rne']);
    });
  });
});
