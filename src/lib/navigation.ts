export function withBasePath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (!path.startsWith("/")) {
    return `${basePath}/${path}`;
  }

  return `${basePath}${path}`;
}

export function hardNavigate(path: string) {
  window.location.assign(withBasePath(path));
}