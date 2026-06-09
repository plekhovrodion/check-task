import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/check-task";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? repoBasePath : "",
  assetPrefix: isGithubPages ? `${repoBasePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
