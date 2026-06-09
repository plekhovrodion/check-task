import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/check-task";

const basePath = isGithubPages ? repoBasePath : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: isGithubPages ? `${repoBasePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
