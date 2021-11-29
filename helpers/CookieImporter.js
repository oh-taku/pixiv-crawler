const fs = require('fs');
const path = require('path');

class CookieImporter {
  files = [];
  directory = 'cookies';

  constructor(files, directory = 'cookies') {
    if (!files) throw new Error('불러올 쿠키의 데이터를 입력해주세요');
    if (!files.length) throw new Error('배열 형태로 입력해주세요.');
    this.files = files;
    this.directory = directory;
  }
  convertRealPaths(paths) {
    const result = [];
    if (!paths) throw new Error('불러올 쿠키의 데이터를 입력해주세요');
    for (let i = 0; i < paths.length; i += 1) {
      const item = paths[i];
      if (!item) continue;
      if (!item.name) continue;
      const realpath = path.join(`${process.env.PWD}/${this.directory}`, item.name ? `${item.name}.txt` : null);
      result.push(realpath);
    }
    return result;
  }
  async getFile(path, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
      fs.readFile(path, encoding, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      })
    });
  }
  async getCookies() {
    const paths = this.convertRealPaths(this.files);
    const promises = paths.map((path) => this.getFile(path));
    const results = await Promise.all(promises);
    const result = [];
    for (let i = 0; i < results.length; i += 1) {
      const value = this.format(results[i]);
      result.push(value);
    }
    return result;
  }
  format(cookie) {
    if (!cookie) throw new Error('쿠키를 입력해주세요.');
    if (typeof cookie !== 'string') throw new Error('올바른 형식의 쿠키가 아닙니다.');
    const rows = cookie.split('\n');
    return rows.map((item) => {
      const cols = item.split('\t');
      const [domain, subdomain, path, secure, expiry, name, value] = cols;
      const result = {
        domain,
        subdomain,
        path,
        secure,
        expiry,
        name,
        value,
      };
      return result;
    });
  }
  async getCookiesOnBrowser() {
    const cookies = await this.getCookies();
    const result = [];
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = (cookies[i]).filter((i) => i.name && i.domain).map((i) => {
        return {
          ...i,
          secure: i.secure === 'TRUE' ? true : false,
        };
      });
      result.push(cookie);
    }
    return result;
  }
};

module.exports = CookieImporter;
