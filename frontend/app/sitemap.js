export default function sitemap() {
  const baseUrl = 'https://divyagyandhara.com';

  const routes = [
    '',
    '/about',
    '/courses',
    '/teachers',
    '/current-affairs',
    '/pyq',
    '/tests',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}
