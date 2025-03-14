import { superAgentsList } from '#clients/authentication/super-agent-list/agent-list';
import { PrestataireException } from '#models/authentication/authentication-exceptions';
import { AgentOrganisation } from '../organisation';
import { AgentConnected } from './index';

jest.mock('#clients/authentication/super-agent-list/agent-list');
jest.mock('#models/authentication/agent/organisation');

describe('AgentConnected', () => {
  const mockUserInfo = {
    idp_id: 'test-idp',
    email: 'test@example.com',
    email_verified: true,
    family_name: 'Doe',
    given_name: 'John',
    phone_number: '+33612345678',
    job: 'Developer',
    siret: '123 456 789 00000',
    is_external: false,
    label: 'Test Label',
    is_collectivite_territoriale: false,
    is_service_public: true,
    sub: 'test-user-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should properly initialize with user info', () => {
      const agent = new AgentConnected(mockUserInfo);

      expect(agent['domain']).toBe('@example.com');
      expect(agent['idpId']).toBe(mockUserInfo.idp_id);
      expect(agent['email']).toBe(mockUserInfo.email);
      expect(agent['familyName']).toBe(mockUserInfo.family_name);
      expect(agent['firstName']).toBe(mockUserInfo.given_name);
      expect(agent['userId']).toBe(mockUserInfo.sub);
      expect(agent['siret']).toBe('12345678900000');
    });
  });

  describe('isLikelyPrestataire', () => {
    it('should detect prestataire by domain', () => {
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: 'test@beta.gouv.fr',
      };
      const agent = new AgentConnected(prestataireUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(true);
    });

    it('should detect prestataire by email pattern', () => {
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: 'test.prestataire@example.com',
      };
      const agent = new AgentConnected(prestataireUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(true);
    });

    it('should not detect regular user as prestataire', () => {
      const agent = new AgentConnected(mockUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(false);
    });
  });

  describe('getHabilitationLevel', () => {
    it('should return agent habilitation when available', async () => {
      const mockScopes = ['scope1', 'scope2'];
      (superAgentsList.getScopeForAgent as jest.Mock).mockResolvedValue(
        mockScopes
      );

      const agent = new AgentConnected(mockUserInfo);
      const result = await agent.getHabilitationLevel();

      expect(result).toEqual({
        scopes: expect.arrayContaining([...mockScopes]),
        userType: 'Super-agent connecté',
        isSuperAgent: true,
      });
    });

    it('should throw PrestataireException for prestataire users', async () => {
      (superAgentsList.getScopeForAgent as jest.Mock).mockResolvedValue([]);
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: 'test@beta.gouv.fr',
      };
      const agent = new AgentConnected(prestataireUserInfo);
      await expect(agent.getHabilitationLevel()).rejects.toThrow(
        PrestataireException
      );
    });

    it('should fallback to organisation habilitation when no agent habilitation', async () => {
      (superAgentsList.getScopeForAgent as jest.Mock).mockResolvedValue([]);
      const mockOrgHabilitation = {
        scopes: ['org-scope'],
        userType: 'Organisation',
      };
      (
        AgentOrganisation.prototype.getHabilitationLevel as jest.Mock
      ).mockResolvedValue(mockOrgHabilitation);

      const agent = new AgentConnected(mockUserInfo);
      const result = await agent.getHabilitationLevel();

      expect(result).toEqual(mockOrgHabilitation);
    });
  });

  describe('getAndVerifyAgentInfo', () => {
    it('should return complete agent info with habilitation', async () => {
      const mockScopes = ['scope1', 'scope2'];
      (superAgentsList.getScopeForAgent as jest.Mock).mockResolvedValue(
        mockScopes
      );

      const agent = new AgentConnected(mockUserInfo);
      const result = await agent.getAndVerifyAgentInfo();

      expect(result).toEqual({
        userId: 'test-user-id',
        idpId: 'test-idp',
        domain: '@example.com',
        email: 'test@example.com',
        familyName: 'Doe',
        firstName: 'John',
        fullName: 'John Doe',
        siret: '12345678900000',
        scopes: expect.arrayContaining(mockScopes),
        userType: 'Super-agent connecté',
        isSuperAgent: true,
      });
    });
  });
});
