import { IAgentScope } from "./constants";

export class Scopes {
  private _scopes: IAgentScope[] = [];

  /**
   * Add new scopes to the existing collection
   */
  add(scopes: IAgentScope[]): void {
    this._scopes = [...new Set([...this._scopes, ...scopes])];
  }

  /**
   * Get the array of unique, validated scopes
   */
  get scopes(): IAgentScope[] {
    return this._scopes;
  }

  /**
   * Check if there are any scopes
   */
  hasScopes(): boolean {
    return this._scopes.length > 0;
  }

  /**
   * Check if a specific scope exists
   */
  hasScope(scope: IAgentScope): boolean {
    return this._scopes.includes(scope);
  }

  /**
   * Get the number of scopes
   */
  get length(): number {
    return this._scopes.length;
  }

  /**
   * Convert to array
   */
  toArray(): IAgentScope[] {
    return this._scopes;
  }
}
