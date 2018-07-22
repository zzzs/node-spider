/**
 * 爬虫小工具：爬 https://githubrank.com/ 上面的排名数据
 *  usage:
    node index.js [user/rankStart] [rankEnd]
    user/rankStart: 用户或者排名开始
    rankEnd: 结束排名，没有则只取一个
 * @type {[type]}
 */
const superagent = require('superagent');
const cheerio = require('cheerio');

const url = 'https://githubrank.com/';

const params = process.argv.splice(2);

if (params[0] === undefined) {
    console.log('try it: node index.js i5ting');
    console.log('try it: node index.js 1 10');
    return;
}

async function request(param1, param2) {
    let data = await superagent.get(url);
    let html = data.res.text;
    let $ = cheerio.load( html );
    let tableDom = $("table");
    let titleDom = tableDom.find("thead").find("tr").eq(1).find("th");
    const titleLength = titleDom.length;
    // 列名
    let titleArr = [];
    for (let i = 0; i < titleLength; i++) {
        titleArr.push(titleDom.eq(i).html());
    }

    let userList = [];
    let userItem = [];
    if (isNaN(param1)) { // 按名称来查
        let userDom = tableDom.find("a[href='https://github.com/" + 'i5ting' + "']").parents("tr").find("td");
        for (let i = 0; i < titleLength; i++) {
            userItem[titleArr[i]] = userDom.eq(i).text();
        }
        userList.push(userItem);
    } else { // 查一组数据
        let usersDom = tableDom.find("tbody").find("tr");
        let startIndex = parseInt(param1) - 1;
        if (param2 === undefined) { // 没有则只取一个
            for (let colI = 0; colI < titleLength; colI++) {
                userItem[titleArr[colI]] = usersDom.eq(startIndex).find("td").eq(colI).text();
            }
            userList.push(userItem);
        } else {
            let endIndex = parseInt(param2);
            for (let i = startIndex; i < endIndex; i++) {
                userItem = [];
                for (let colI = 0; colI < titleLength; colI++) {
                    userItem[titleArr[colI]] = usersDom.eq(i).find("td").eq(colI).text();
                }
                userList.push(userItem);
            }
        }
    }

    console.table(userList);
}
request(params[0], params[1]);
