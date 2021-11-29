const Puppeteer = require('./helpers/Pupperteer');
const CookieImporter = require('./helpers/CookieImporter');

(async () => {
  const args = process.argv.slice(2);
  const enter = args[0] || 'https://pixiv.net';
  const cookieImporter = new CookieImporter([
    { name: 'pixiv.net' },
  ]);
  const cookies = await cookieImporter.getCookiesOnBrowser();
  const engine = new Puppeteer();
  await engine.launch();
  const page = engine.page;
  const cookiePromises = cookies.map((i) => page.setCookie(...i));
  await Promise.all(cookiePromises);
  await engine.goto(enter);
  const images = await engine.getAllImages();
  const imagePaths = await engine.getAllImagePaths(images);
  await engine.getAllImagesDownload(imagePaths);
})();