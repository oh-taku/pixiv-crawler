const Engine = require('puppeteer');
const { JSDOM } = require('jsdom');

class Puppeteer {
  browser = null;
  page = null;
  async launch(options) {
    const browser = await Engine.launch(options);
    this.browser = browser;
    await this.getPage();
    return this;
  }
  async getPage() {
    if (!this.browser) throw new Error('실행이 우선 되어야 합니다. [Puppeteer.launch(options)]');
    this.page = await this.browser.newPage();
    return this.page;
  }
  async goto(uri) {
    if (!this.page) throw new Error('페이지가 생성되지 않았습니다. [Puppeteer.launch(options)]');
    if (!uri) throw new Error('URI를 입력해주세요. [Puppeteer.goto(uri)]');
    await this.page.goto(uri);
    return this.page;
  }
  async getAllImages() {
    if (!this.page) throw new Error('페이지가 로드되지 않았습니다.');
    const content = await this.page.content();
    const dom = new JSDOM(content);
    return dom.window.document.querySelectorAll('img');
  }
  async getAllImagePaths(images) {
    return [...images].map((image) => image.getAttribute('src'))
  }
  async getAllImagesDownload(imagePaths) {
    if (!imagePaths) throw new Error('이미지 경로를 배열 형태로 전달해주세요.');
    console.log(imagePaths);
    const promises = [...imagePaths].map((path) => this.browser.newPage(path));
    const results = await Promise.all(promises);
    return results;
  }
}

module.exports = Puppeteer;
