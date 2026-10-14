import path from "path";

const REPO_ROOT = path.resolve(
  process.env.REPO_ROOT ||
  "../../../sample-repository"
);

export function resolveSafePath(requestedPath: string): string {
  const resolvedPath = path.resolve(
    REPO_ROOT,
    requestedPath
  );

  const relativePath = path.relative(
    REPO_ROOT,
    resolvedPath
  );

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(
      "Access denied: requested path is outside the allowed repository."
    );
  }

  return resolvedPath;
}

export function getRepoRoot(): string {
  return REPO_ROOT;
}
