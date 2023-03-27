const puppeteer = require('puppeteer-core');
const fse = require('fs-extra');
const dotenv = require('dotenv');
const getData = require('./getData');
const study = require('./study');
const config = require('../config');

const { executablePath, userAgent } = config;

dotenv.config();

(async () => {
  const { baseURL } = config

  // 学生账号数据
  const StudentArrary = [{
    'name': '钟海容',
    'account': '2143001465493',
    'session': 'V2-50000000001-a1615de2-dba0-4a2d-b86f-7932e98d14ce.NTAwMDAzMjE3Njk.1680010527984.5ehvxYpECRC5G0KYYLun2B0Boio'
  }, {
    'name': '刘芹',
    'account': '2143001465494',
    'session': 'V2-0af60e5c-e6f4-4790-9d2f-83588314f99c.MA.1679923951843.yPFP5c44TjUlQfI-5avE9laNhcQ'
  }, {
    'name': '吴梅燕',
    'account': '2143001465495',
    'session': 'V2-bde0244e-059e-4b67-bc0b-7c35694ed278.MA.1679924249289.3e-kL-UHb2EmHX8h257dcNmsEhU'
  }, {
    'name': '杨亚玲',
    'account': '2143001465496',
    'session': 'V2-56f03fc0-361d-4011-957c-b4fffb4d6de7.MA.1679924298729.nWPcv-JXBFXn5PsvR9nCEWouyJs'
  }, {
    'name': '骆兰英',
    'account': '2143001465497',
    'session': 'V2-7472a3ed-0987-42fd-b29e-43a7d830ef17.MA.1679924717133.vcHppv_t9OKQ4Eq_w_BGf7_vTf0'
  }, {
    'name': '谢志芳',
    'account': '2143001465498',
    'session': 'V2-d98845e6-5182-47d0-b4f3-f867ee1553c3.MA.1679924782126.TW_iu8Flh09nVLGFfIlGR_FW04k'
  }, {
    'name': '朱莎莎',
    'account': '2143001465499',
    'session': 'V2-286be647-22d7-4296-a490-e485c7df45d4.MA.1679924820062.nT3Zm4oYWIy8-s2WBfQG_78xRFg'
  }, {
    'name': '肖林美',
    'account': '2143001465507',
    'session': 'V2-efd90b7e-3f20-49cd-adb7-5c6dfe2fc2e7.MA.1679924878119.fcxgLit5hR7ZwwOISv5BO9jxgIo'
  }, {
    'name': '曾龙元',
    'account': '2143001465508',
    'session': 'V2-cdd27a23-3fd6-42c6-8443-c70cda66f21f.MA.1679924914482.-h9sDDzROqKuBxY0VgfOElO71SA'
  }, {
    'name': '黄翠娥',
    'account': '2143001465509',
    'session': 'V2-21f1309e-5088-4804-bec1-301933ae63c1.MA.1679924972177.YgPlgekcSS1N3JJXomv3SvE76n8'
  }, {
    'name': '骆静',
    'account': '2143001465510',
    'session': 'V2-98e2386d-70bc-422e-83ff-7fcd99b250ca.MA.1679925102898.IDNoebWxGZQ-SD6BuBl5fo4HvB4'
  }, {
    'name': '殷浩惠',
    'account': '2143001253397',
    'session': 'V2-dbb31be0-6362-45c0-ac1c-d34203548606.MA.1679925163097.zfQRoOf_sVR-m5NlPtJKm-afOCY'
  }];
  // const { SESSION } = process.env;

  const SESSIONARRAY = StudentArrary;
  let sLen = SESSIONARRAY.length;
  for (let i = 0; i < sLen; i++) {
    let SESSION = SESSIONARRAY[i]['session'];
    console.log(SESSION);
    if (!SESSION) {
      console.warn('缺少 SESSION 。')
      continue;
    }

    const browser = await puppeteer.launch({
      headless: false,
      executablePath,
      defaultViewport: {
        width: 1200,
        height: 900
      }
    });

    // setTimeout(async () => {
    //   await getData(page);
    //   await browser.close();
    // }, 60 * 60 * 1000);

    const page = await browser.newPage();

    await page.setDefaultTimeout(60 * 1000);

    await page.setCookie({
      url: baseURL,
      name: 'session',
      value: SESSION,
    });

    await page.setUserAgent(userAgent);

    let newData = await getData(page);
    // try {
    //   const data = await fse.readFile('./data.json');
    //   newData = JSON.parse(data.toString());
    //   console.log('使用 data.json 缓存');
    // } catch (err) {
    //   newData = await getData(page);
    // }

    await study(page, newData);

    // 获取最新进度
    // await getData(page);

    await browser.close();
  }

})();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
