import { type IRGEResponse, mapToDomainObject } from "#/clients/rge";

const result = (
  overrides: Partial<IRGEResponse["results"][number]>
): IRGEResponse["results"][number] => ({
  adresse: "1 RUE DU TEST",
  code_postal: "75001",
  code_qualification: "QUAL-1",
  commune: "PARIS",
  domaine: "Isolation des murs",
  email: "contact@example.com",
  nom_certificat: "QUALIBAT-RGE",
  nom_entreprise: "ENTREPRISE TEST",
  nom_qualification: "Qualification test",
  organisme: "qualibat",
  particulier: true,
  siret: "12345678900001",
  site_internet: "https://example.com",
  telephone: "01 02 03 04 05",
  url_qualification: "https://example.com/certificat.pdf",
  ...overrides,
});

describe("mapToDomainObject", () => {
  it("groups certifications by SIRET before grouping them by name", () => {
    const mapped = mapToDomainObject({
      results: [
        result({ domaine: "Isolation des murs" }),
        result({
          domaine: "Pompe à chaleur",
          siret: "12345678900002",
        }),
        result({ domaine: "Isolation des combles" }),
        result({
          domaine: "Audit énergétique",
          nom_certificat: "Certificat OPQIBI",
        }),
      ],
    });

    expect(mapped.etablissements).toHaveLength(2);
    expect(mapped.etablissements[0].companyInfo.siret).toBe("12345678900001");
    expect(mapped.etablissements[0].certifications).toHaveLength(2);
    expect(mapped.etablissements[0].certifications[0].domaines).toEqual([
      "Isolation des murs",
      "Isolation des combles",
    ]);
    expect(mapped.etablissements[1].companyInfo.siret).toBe("12345678900002");
    expect(mapped.etablissements[1].certifications[0].domaines).toEqual([
      "Pompe à chaleur",
    ]);
  });
});
