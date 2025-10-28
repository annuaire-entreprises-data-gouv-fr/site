import { AgentOrganisation } from "#models/authentication/agent/organisation";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import {
  NeedASiretException,
  PrestataireException,
} from "#models/authentication/authentication-exceptions";
import {
  getAgentGroups,
  type IAgentsGroup,
} from "#models/authentication/group";
import { AgentConnected } from "./index";

jest.mock("#models/authentication/group/index.ts", () => ({
  getAgentGroups: jest.fn(),
  AgentsGroup: jest.fn(),
}));

jest.mock("#models/authentication/agent/organisation");

const mockGetAgentGroups = jest.mocked(getAgentGroups);
const mockAgentOrganisation = jest.mocked(AgentOrganisation);

describe("AgentConnected", () => {
  const mockGroup = {
    name: "Test Group",
    id: 1,
    organisation_siret: "123456789",
    contract: "test-contract",
    users: [],
    scopes: ["rne", "nonDiffusible"] as IAgentScope[],
    contract_description: "test-contract-description",
  };
  const mockUserInfo = {
    idp_id: "test-idp",
    email: "test@example.com",
    email_verified: true,
    family_name: "Doe",
    given_name: "John",
    phone_number: "+33612345678",
    job: "Developer",
    siret: "123 456 789 00000",
    is_external: false,
    label: "Test Label",
    is_collectivite_territoriale: false,
    is_service_public: true,
    sub: "test-user-id",
  };

  const mockUserInfoNoSiret = {
    idp_id: "test-idp",
    email: "test@example.com",
    email_verified: true,
    family_name: "Doe",
    given_name: "John",
    phone_number: "+33612345678",
    job: "Developer",
    siret: "",
    is_external: false,
    label: "Test Label",
    is_collectivite_territoriale: false,
    is_service_public: true,
    sub: "test-user-id",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup the AgentOrganisation mock
    const mockGetHabilitationLevel = jest.fn();
    mockAgentOrganisation.mockImplementation(
      () =>
        ({
          getHabilitationLevel: mockGetHabilitationLevel,
        }) as any
    );
  });

  describe("constructor", () => {
    it("should properly initialize with user info", () => {
      const agent = new AgentConnected(mockUserInfo);

      expect(agent["domain"]).toBe("@example.com");
      expect(agent["idpId"]).toBe(mockUserInfo.idp_id);
      expect(agent["email"]).toBe(mockUserInfo.email);
      expect(agent["familyName"]).toBe(mockUserInfo.family_name);
      expect(agent["firstName"]).toBe(mockUserInfo.given_name);
      expect(agent["proConnectSub"]).toBe(mockUserInfo.sub);
      expect(agent["siret"]).toBe("12345678900000");
    });

    it("should fail to initialize without SIRET", () => {
      expect(() => new AgentConnected(mockUserInfoNoSiret)).toThrow(
        NeedASiretException
      );
    });
  });

  describe("isLikelyPrestataire", () => {
    it("should detect prestataire by domain", () => {
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: "test@beta.gouv.fr",
      };
      const agent = new AgentConnected(prestataireUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(true);
    });

    it("should not detect numerique.gouv.fr as prestataire", () => {
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: "test@numerique.gouv.fr",
      };
      const agent = new AgentConnected(prestataireUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(false);
    });

    it("should detect numerique.gouv.fr with ext in name as prestataire", () => {
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: "test.ext@numerique.gouv.fr",
      };
      const agent = new AgentConnected(prestataireUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(true);
    });

    it("should detect prestataire by email pattern", () => {
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: "test.prestataire@example.com",
      };
      const agent = new AgentConnected(prestataireUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(true);
    });

    it("should detect prestataire by email pattern", () => {
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: "prenom.nom-consultant@example.com",
      };
      const agent = new AgentConnected(prestataireUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(true);
    });

    it("should not detect regular user as prestataire", () => {
      const agent = new AgentConnected(mockUserInfo);
      expect(agent.isLikelyPrestataire()).toBe(false);
    });
  });

  describe("getHabilitationLevel", () => {
    it("should return agent habilitation when available", async () => {
      const groupScopes: IAgentScope[] = ["rne", "nonDiffusible"];
      mockGetAgentGroups.mockResolvedValue([
        { ...mockGroup, scopes: groupScopes } as IAgentsGroup,
      ]);

      const agent = new AgentConnected(mockUserInfo);
      const result = await agent.getHabilitationLevel();

      expect(result).toEqual({
        scopes: expect.arrayContaining([...groupScopes]),
        userType: "Super-agent connecté",
        isSuperAgent: true,
      });
    });

    it("should throw PrestataireException for prestataire users", async () => {
      mockGetAgentGroups.mockResolvedValue([
        { ...mockGroup, scopes: [] } as IAgentsGroup,
      ]);
      const prestataireUserInfo = {
        ...mockUserInfo,
        email: "test@beta.gouv.fr",
      };
      const agent = new AgentConnected(prestataireUserInfo);
      await expect(agent.getHabilitationLevel()).rejects.toThrow(
        PrestataireException
      );
    });

    it("should fallback to organisation habilitation when no agent habilitation", async () => {
      mockGetAgentGroups.mockResolvedValue([
        { ...mockGroup, scopes: [] } as IAgentsGroup,
      ]);
      const mockOrgHabilitation = {
        scopes: ["org-scope"],
        userType: "Organisation",
      };

      const mockGetHabilitationLevel = jest
        .fn()
        .mockResolvedValue(mockOrgHabilitation);
      mockAgentOrganisation.mockImplementation(
        () =>
          ({
            getHabilitationLevel: mockGetHabilitationLevel,
          }) as any
      );

      const agent = new AgentConnected(mockUserInfo);
      const result = await agent.getHabilitationLevel();

      expect(result).toEqual(mockOrgHabilitation);
    });
  });

  describe("getAndVerifyAgentInfo", () => {
    it("should return complete agent info with habilitation", async () => {
      const groupScopes: IAgentScope[] = ["rne", "nonDiffusible"];
      mockGetAgentGroups.mockResolvedValue([
        { ...mockGroup, scopes: groupScopes } as IAgentsGroup,
      ]);

      const agent = new AgentConnected(mockUserInfo);
      const result = await agent.getAndVerifyAgentInfo();

      expect(result).toEqual({
        proConnectSub: "test-user-id",
        idpId: "test-idp",
        domain: "@example.com",
        email: "test@example.com",
        familyName: "Doe",
        firstName: "John",
        fullName: "John Doe",
        siret: "12345678900000",
        scopes: expect.arrayContaining(groupScopes),
        userType: "Super-agent connecté",
        isSuperAgent: true,
      });
    });
  });
});
