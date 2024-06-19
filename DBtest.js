//! 이거 내가 작성한 코드가 아닙니다. GPT를 사용해서 예제를 뽑아 테스트를 진행한 파일입니다.


const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 파일에 연결 (파일이 없으면 자동으로 생성됩니다)
let db = new sqlite3.Database('example.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the example.db database.');
});

// db.serialize()를 사용하여 작업을 직렬화합니다.
db.serialize(() => {
    // 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
    )`);

    // 데이터 삽입 (Create)
    let insertStmt = db.prepare(`INSERT INTO users (name, email) VALUES (?, ?)`);
    insertStmt.run('John Doe', 'john@example.com', function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`User John Doe added with ID ${this.lastID}`);
    });

    insertStmt.run('Jane Smith', 'jane@example.com', function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`User Jane Smith added with ID ${this.lastID}`);
    });

    insertStmt.finalize();

    // 데이터 읽기 (Read)
    db.each(`SELECT * FROM users`, (err, row) => {
        if (err) {
            throw err;
        }
        console.log(`${row.id}: ${row.name} - ${row.email}`);
    });

    // 데이터 수정 (Update)
    let updateStmt = db.prepare(`UPDATE users SET name = ?, email = ? WHERE id = ?`);
    updateStmt.run('John Updated', 'johnupdated@example.com', 1, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`User 1 updated`);
    });
    updateStmt.finalize();

    // 데이터 삭제 (Delete)
    let deleteStmt = db.prepare(`DELETE FROM users WHERE id = ?`);
    deleteStmt.run(2, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`User 2 deleted`);
    });
    deleteStmt.finalize();

    // 업데이트 후 데이터 읽기
    db.each(`SELECT * FROM users`, (err, row) => {
        if (err) {
            throw err;
        }
        console.log(`${row.id}: ${row.name} - ${row.email}`);
    });
});

// 연결 종료
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});