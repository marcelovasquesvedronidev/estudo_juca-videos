import { httpRequest } from "../lib/http";

export type HealthResponse = {
  status: "ok" | "degraded" | "down";
  timestamp: string;
};

export function getApiHealth() {
  return httpRequest<HealthResponse>("/health");
}
