import fs from "fs";
import { HttpResponse, type HttpResponseResolver } from "msw";
import path from "path";

function getProjectRoot() {
  const cwd = process.cwd();
  // When running from .next/standalone, go back to actual project root
  if (cwd.endsWith(path.join(".next", "standalone"))) {
    return path.resolve(cwd, "..", "..");
  }
  return cwd;
}

function getSnapshots() {
  try {
    const folderPath = path.join(
      getProjectRoot(),
      "cypress",
      "fixtures",
      "recherche-entreprise"
    );
    const files = fs.readdirSync(folderPath);

    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const jsonData = jsonFiles.map((file) => {
      const filePath = path.join(folderPath, file);
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    });

    return jsonData;
  } catch (error) {
    console.error("Error reading JSON files:", error);
    return [];
  }
}

export const rechercheEntrepriseHandler: HttpResponseResolver = async ({
  request,
}) => {
  const q = new URL(request.url).searchParams.get("q");

  const snapshots = await getSnapshots();

  const snapshot = snapshots.find((snapshot) => snapshot.searchTerms === q);

  if (!snapshot) {
    throw new Error("No snapshot found");
  }

  return HttpResponse.json(snapshot.result);
};
