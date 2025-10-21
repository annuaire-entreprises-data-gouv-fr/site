import { HttpResponse, type HttpResponseResolver } from "msw";

export const matomoReportHandler: HttpResponseResolver = ({ request }) => {
  if (request.url.includes("Events.getCategory")) {
    return HttpResponse.json(
      Array.from({ length: 12 }, () => [{ label: "action", nb_events: 101 }])
    );
  }
  if (request.url.includes("Events.getNameFromCategoryId")) {
    return HttpResponse.json(
      Array.from({ length: 12 }, () => ({ label: "action", nb_events: 104 }))
    );
  }

  return HttpResponse.json(
    Array.from({ length: 12 }, () => ({
      nb_uniq_visitors_new: 100,
      nb_uniq_visitors_returning: 100,
      nb_visits_new: 100,
      nb_visits_returning: 100,
      nb_actions_returning: 100,
      nb_actions_new: 100,
    }))
  );
};
