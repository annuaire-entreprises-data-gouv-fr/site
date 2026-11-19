import { HttpResponse, type HttpResponseResolver } from "msw/http";

const protectedDirigeant = {
  nom: "LE-MOINE",
  prenoms: "ELODIE Marie",
  date_de_naissance: "1978-04-01",
};

export const gristHandler: HttpResponseResolver = ({ request }) => {
  if (
    new URL(request.url).pathname.endsWith(
      "/Protected_Siren_Dirigeants/records"
    )
  ) {
    const records = [
      { siren: "908595879", legacy: true, ...protectedDirigeant },
      { siren: "990000010", legacy: false, ...protectedDirigeant },
      {
        siren: "990000028",
        legacy: true,
        nom: "",
        prenoms: "",
        date_de_naissance: null,
      },
      { siren: "990000036", legacy: false, ...protectedDirigeant },
    ];
    return HttpResponse.json({
      records: records.map((fields) => ({ fields })),
    });
  }
  return HttpResponse.json({ records: [] });
};
