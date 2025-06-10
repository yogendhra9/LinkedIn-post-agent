import { log } from "console";
import stringSimilarity from "string-similarity";

export function matchDescription(description, repo) {
  const candidates = repo.map((repo) => `${repo.name} ${repo.description}`);
  const result = stringSimilarity.findBestMatch(description, candidates);
  // console.log("Full result:", result);
  
  // Find the index of the best match in our candidates array
  const bestMatchIndex = candidates.indexOf(result.bestMatch.target);
  console.log("Best match index:", bestMatchIndex);
  return repo[bestMatchIndex];
}
