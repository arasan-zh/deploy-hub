import "server-only";

const API_URL = process.env.COOLIFY_API_URL!;
const API_TOKEN = process.env.COOLIFY_API_TOKEN!;
const SERVER_UUID = process.env.COOLIFY_SERVER_UUID!;
const PROJECT_UUID = process.env.COOLIFY_PROJECT_UUID!;
const ENVIRONMENT_NAME = process.env.COOLIFY_ENVIRONMENT_NAME!;
const ENVIRONMENT_UUID = process.env.COOLIFY_ENVIRONMENT_UUID!;
const DESTINATION_UUID = process.env.COOLIFY_DESTINATION_UUID!;
const PUBLIC_DOMAIN_SUFFIX = process.env.COOLIFY_PUBLIC_DOMAIN_SUFFIX || "ela.kazhugu.cloud";

export class CoolifyError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "CoolifyError";
  }
}

async function coolifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new CoolifyError(
      body?.message ?? `Coolify API error (${res.status})`,
      res.status,
      body,
    );
  }

  return body as T;
}

const sharedFields = {
  project_uuid: PROJECT_UUID,
  server_uuid: SERVER_UUID,
  environment_name: ENVIRONMENT_NAME,
  environment_uuid: ENVIRONMENT_UUID,
  destination_uuid: DESTINATION_UUID,
};

export type BuildPack = "nixpacks" | "static" | "dockerfile";

export interface Deployment {
  uuid: string;
  name: string;
  status: string;
  url: string | null;
  createdAt: string;
  buildPack: string;
  source: "static-html" | "git";
}

function toDeployment(app: Record<string, unknown>): Deployment {
  const fqdn = (app.fqdn as string | null) ?? null;
  return {
    uuid: app.uuid as string,
    name: app.name as string,
    status: (app.status as string) ?? "unknown",
    url: fqdn ? fqdn.split(",")[0] : null,
    createdAt: app.created_at as string,
    buildPack: (app.build_pack as string) ?? "unknown",
    source: app.build_pack === "dockerfile" && app.git_repository === "coollabsio/coolify"
      ? "static-html"
      : "git",
  };
}

function buildStaticHtmlDockerfile(htmlContent: string): string {
  // A COPY heredoc keeps the file as normal multi-line text instead of one giant
  // base64 blob crammed into a single shell command — the latter blew past a
  // command-length limit in Coolify's remote SSH execution for anything but a
  // trivial file (ProcessStartFailedException, reproducible, not transient).
  const delimiter = `DEPLOYHUB_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  return [
    "# syntax=docker/dockerfile:1",
    "FROM nginx:alpine",
    `COPY <<'${delimiter}' /usr/share/nginx/html/index.html`,
    htmlContent,
    delimiter,
    "EXPOSE 80",
    "",
  ].join("\n");
}

export async function createStaticDeployment(opts: {
  name: string;
  htmlContent: string;
}): Promise<{ uuid: string; url: string | null }> {
  const dockerfile = buildStaticHtmlDockerfile(opts.htmlContent);
  const dockerfileBase64 = Buffer.from(dockerfile, "utf-8").toString("base64");

  const result = await coolifyFetch<{ uuid: string; domains: string | null }>(
    "/applications/dockerfile",
    {
      method: "POST",
      body: JSON.stringify({
        ...sharedFields,
        name: opts.name,
        dockerfile: dockerfileBase64,
        domains: `https://${opts.name}.${PUBLIC_DOMAIN_SUFFIX}`,
        instant_deploy: true,
      }),
    },
  );

  return { uuid: result.uuid, url: result.domains?.split(",")[0] ?? null };
}

export async function createGitDeployment(opts: {
  name: string;
  repoUrl: string;
  branch: string;
  buildPack: BuildPack;
  buildCommand?: string;
  publishDirectory?: string;
  dockerfileLocation?: string;
}): Promise<{ uuid: string; url: string | null }> {
  const body: Record<string, unknown> = {
    ...sharedFields,
    name: opts.name,
    git_repository: opts.repoUrl,
    git_branch: opts.branch,
    build_pack: opts.buildPack,
    ports_exposes: "3000",
    domains: `https://${opts.name}.${PUBLIC_DOMAIN_SUFFIX}`,
    instant_deploy: true,
  };

  if (opts.buildPack === "static") {
    body.is_static = true;
    body.build_command = opts.buildCommand || "npm run build";
    body.publish_directory = opts.publishDirectory || "dist";
  }

  if (opts.buildPack === "dockerfile") {
    body.dockerfile_location = opts.dockerfileLocation || "/Dockerfile";
  }

  const result = await coolifyFetch<{ uuid: string; domains: string | null }>(
    "/applications/public",
    { method: "POST", body: JSON.stringify(body) },
  );

  return { uuid: result.uuid, url: result.domains?.split(",")[0] ?? null };
}

function hasPublicDomain(fqdn: unknown): boolean {
  if (typeof fqdn !== "string" || !fqdn) return false;
  return fqdn.split(",").some((url) => {
    try {
      const host = new URL(url.trim()).hostname;
      return host === PUBLIC_DOMAIN_SUFFIX || host.endsWith(`.${PUBLIC_DOMAIN_SUFFIX}`);
    } catch {
      return false;
    }
  });
}

export async function listDeployments(): Promise<Deployment[]> {
  const apps = await coolifyFetch<Record<string, unknown>[]>("/applications");
  return apps.filter((a) => hasPublicDomain(a.fqdn)).map(toDeployment);
}

/** Checks every app on the instance (not just this tool's) — a name collides if it's already live anywhere under our domain. */
export async function isNameTaken(name: string): Promise<boolean> {
  const apps = await coolifyFetch<Record<string, unknown>[]>("/applications");
  const target = `${name}.${PUBLIC_DOMAIN_SUFFIX}`;
  return apps.some((a) => {
    const fqdn = a.fqdn;
    if (typeof fqdn !== "string" || !fqdn) return false;
    return fqdn.split(",").some((url) => {
      try {
        return new URL(url.trim()).hostname === target;
      } catch {
        return false;
      }
    });
  });
}

export async function getDeployment(uuid: string): Promise<Deployment> {
  const app = await coolifyFetch<Record<string, unknown>>(`/applications/${uuid}`);
  return toDeployment(app);
}

export async function deleteDeployment(uuid: string): Promise<void> {
  await coolifyFetch(
    `/applications/${uuid}?delete_configurations=true&delete_volumes=true&docker_cleanup=true`,
    { method: "DELETE" },
  );
}

/** Turns a Coolify domain-conflict (409) into a message a user can act on; other errors pass through as-is. */
export function friendlyDeployError(err: unknown): { message: string; status: number } {
  if (err instanceof CoolifyError) {
    if (err.status === 409) {
      return { message: "That name is already taken. Try a different one.", status: 409 };
    }
    return { message: err.message, status: err.status };
  }
  return { message: "Deployment failed.", status: 500 };
}
