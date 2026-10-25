import { apiRequest } from "../core/api.js";

const el = document.querySelector("#api-status");

try {
  const result = await apiRequest("/health");
  el.textContent = `${result.message} | Database: ${result.database} | Environment: ${result.environment}`;
} catch (error) {
  el.textContent = `API check failed: ${error.message}`;
}
