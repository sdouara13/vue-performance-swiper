const fs = require('fs');
const pageItemCount = 8;
const data = {
  list: [],
  total_page: 100,
  cur_page: 1,
};

for(let i = 0; i < pageItemCount * data.total_page; i ++) {
  data.list.push({
    data: i,
  })
}

for(let i = 0; i < 5; i ++) {
  let obj = {
    list: data.list.slice(i * pageItemCount * data.total_page / 5, (i + 1) * pageItemCount * data.total_page / 5),
    cur_page: i * 20 + 1,
    total_page: 100,
  }
  fs.writeFileSync(`mock-data${i * 20 + 1}.json`, JSON.stringify(obj));
}
