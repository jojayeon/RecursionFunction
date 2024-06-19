// * 이 파일은 CRUD를 써보기위해 사용하는 js파일이며 대스트이기때문에 주석과 설명이 많은 예정이다.

const sqlite3 = require('sqlite3').verbose();
// * sqlite3가 불러와지는지 확인
// console.log(sqlite3)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    email TEXT NOT NULL
  )`);
});
//* 항목에 id name email 그리고 뒤에 오는 문자들은 조건 이다
//* NULL이 못들어가게 하거나 text만 들어가게 하는 등 기존적인 조건 설정임
//* 지워도 상관없지만 있는 것이 좋다



//? 왜 :id는 안 써두 되는 건가??????
function createUser(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
}
// createUser('John Doe', 'john.doe@example.com');


function getAllUsers() {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(`${row.id}: ${row.name} - ${row.email}`);
    });
  });
}
// 터미널에서 확인하러면 사용하면된다.
// GUI로 확인 할 때 - 터미널로 확인하지 않으면 필요할까?
// 생각 - 필요할 것 같다. gui를 쓰지 않는 환경에서 사용할 많은 것이다.

function updateUser(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
}
// updateUser(10 , "조자연", "whwkdus6152")
// 안에 내용 변경시 사용

function deleteUser(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted: ${this.changes}`);
  });
}
// deleteUser(10) id값이 10인 것을 삭제해줘

createUser('John Doe12', 'john.doe@example.com12');
createUser('John Doe11', 'john.doe@example.com11');
createUser('John Doe10', 'john.doe@example.com10');
// getAllUsers();
updateUser(3, 'Jane ', 'jane.doe@exampl');
deleteUser(7);
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});


















//새로운 내용이 있으면 저장 후 node test2.js를 터미널에 입력한 후 DB에서 새로 고침을 해줘야 보인다.
//지우고 다시 넣을거면 DB파일을 삭제하고 다시 열어야 하나???