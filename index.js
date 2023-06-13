const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors());
const { Sequelize } = require('sequelize');
const path = require('path')

// Create a connection to the MySQL database
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Jashwa@007',
  database: 'student',
});

// Connect to the database
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    // Handle the error gracefully, e.g., show an error message to the user
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});



// Start the server and listen on port 3000
app.listen(3000, function check(err) {
  if (err) {
    console.log("Error running server 3000",err)
  }
  else {
    console.log('Server listening on port 3000.');

  }
});
app.post("/api/quizcontent/add", (req, res) => {
  let course_name = req.body.course_name;
  let question = req.body.question;
  let answer = req.body.answer;
  let option1 = req.body.option1;
  let option2 = req.body.option2;
  let option3 = req.body.option3;
  let option4 = req.body.option4;
  // let module_no = req.body.module_no;
  let selectedtype = req.body.selectedtype;

  console.log(req.body)
  let module_no = `SELECT c.module_no FROM course_content c WHERE c.course_name = "${course_name}"`;
  let course_code = `SELECT c.course_code FROM course_content c WHERE c.course_name = "${course_name}"`;
  let sql = `INSERT INTO quiz_content (question, answer, option1, option2, option3, option4, course_code, module_no, selectedtype)
  VALUES (?, ?, ?, ?, ?, ?, (${course_code}), (${module_no}), ?)`;





  // const values = [ question, answer, option1,option2,option3,option4,course_code,module_no,selectedtype];




  // db.query(sql,values, (err, result) => {

  // let sql = `insert into quiz_content(question,answer,option1,option2,option3,option4,course_code,module_no,selectedtype) values(?,?,?,?,?,?,?,?,?)`;
  db.query(sql, [question, answer, option1, option2, option3, option4, selectedtype], (err) => {
    console.log(err);
    if (err) {
      res.send({
        status: false,
        message: "Course detail created failed"
      });
    }
    else {
      res.send({
        status: true,
        message: "Course detail created successfully"
      });
    }

  })


})
app.put("/api/content/updatequizdata", (req, res) => {
  course_code = req.body.course_code;
  question = req.body.question;
  answer = req.body.answer;
  option1 = req.body.option1;
  option2 = req.body.option2;
  option3 = req.body.option3;
  option4 = req.body.option4;
  module_no = req.body.module_no;
  selectedtype = req.body.selectedtype;

  console.log(req.body);
  console.log(module_no);
  console.log(answer);
  console.log(option1);
  console.log(option2);
  console.log(option3);
  console.log(option4);

  db.query("UPDATE quiz_content SET question = ?,answer=?,option1 =?,option2 =?,option3 =?,option4 =?,module_no = ?,selectedtype = ? WHERE course_code = ?;", [question, answer, option1,option2,option3,option4,module_no,selectedtype, course_code], (err) => {
    if (err) {
      console.log("------->error", err);
      res.send({
        status: false,
        message: "update failed"

      });
    }
    else {
      res.send({
        status: true,
        message: "updated successfully"
      });
    }

  })

})
app.delete("/api/deletequizdata", (req, res) => {
  let course_id = req.body.delete_data.course_id
  db.query("DELETE FROM quiz_content WHERE course_id=?;", [course_id], (err) => {
    if (err) {
      res.send({
        status: false,
        message: "Error"
      });
    }
    else {
      res.send({
        status: true,
        message: "Data deleted successfully"
      });
    }

  })
})
app.get("/api/quizcontent", (req, res) => {
  let data = `SELECT q.*, c.course_name FROM quiz_content q, course_content c WHERE q.course_code = c.course_code;`;
  // let data = "SELECT q* FROM quiz_content";
  db.query(data, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({
        message: "Successfull",
        data: results
      });
    };
  });
})
app.post("/api/content/add", (req, res) => {
    course_name = req.body.course_name,
    chapter_name = req.body.chapter_name,
    question = req.body.question,
    answer = req.body.answer,
    video_link = req.body.video_link,
    course_code = req.body.course_code,
    module_no = req.body.module_no


    console.log(req.body)
  let sql = `insert into course_content(course_name,chapter_name,question,answer,video_link,course_code,module_no) values("${course_name}","${chapter_name}","${question}","${answer}","${video_link}","${course_code}","${module_no}")`;
  db.query(sql, (err) => {
    console.log(err);
    if (err) {
      res.send({
        status: false,
        message: "Course detail created failed"
      });
    }
    else {
      res.send({
        status: true,
        message: "Course detail created successfully"
      });
    }

  })
})
app.post("/api/course/add", (req, res) => {
    course_code = req.body.course_code,
    course_name = req.body.course_name,
    course_description = req.body.course_description,

  console.log(req.body)
  let sql = `INSERT INTO course (course_code,course_name,course_description) values ("${course_code}","${course_name}","${course_description}")`;
  db.query(sql, (err) => {
    if (err) {
      res.send({
        status: false,
        message: "Course detail created failed"
      });
    }
    else {
      res.send({
        status: true,
        message: "Course detail created successfully"
      });
    }

  })
})
app.delete("/api/deletedata", (req, res) => {
  let course_code = req.body.delete_data.course_code
  db.query("DELETE FROM course_content WHERE course_code=?;", [course_code], (err) => {
    if (err) {
      res.send({
        status: false,
        message: "Course detail delete failed"
      });
    }
    else {
      res.send({
        status: true,
        message: "Course detail deleted successfully"
      });
    }

  })
})
app.get('/api/content_to_admin', (req, res) => {
  let sql1 = "SELECT * FROM course_content";
  db.query(sql1, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({
        message: "Successfull",
        data: results
      });
    };
  });
});
app.get('/api/sendmoduleno/:c_name', (req,res) => {
let course_name = req.params.c_name;
console.log(course_name);

let sql = `select c.course_name,c.course_code, c.module_no, p.p_question, p.sentence,p.hint, p.pc_answer,p.pc_id from course_content c inner  join practice_content p on p.course_code=c.course_code 
where c.course_name = "${course_name}"
order by c.module_no;`;
db.query(sql, (err, results) => {
  if (err) throw err;
  if (results.length > 0) {
    res.send({
      message: "Successfull",
      data: results
    });
  };
});
})

app.get('/api/sendcoursename/:c_name', (req,res) => {
let course_name = req.params.c_name;
console.log(course_name);

let sql = `SELECT q.*, c.course_name
           FROM quiz_content q
           INNER JOIN course_content c ON q.course_code = c.course_code
           WHERE c.course_name = ?`;

db.query(sql, [course_name], (err, results) => {
  if (err) throw err;
  if (results.length > 0) {
    res.send({
      message: "Successfull",
      data: results
    });
  };
});
})
app.get('/api/content', (req, res) => {
  let sql1 = `SELECT course_content.course_name, course_content.chapter_name, course_content.question, 
              course_content.answer, course_content.video_link, course_content.course_code, 
              course_content.module_no,'' as fillup_answer,'' as message,
              GROUP_CONCAT(practice_content.sentence SEPARATOR ',') as sentence, 
              GROUP_CONCAT(practice_content.pc_answer SEPARATOR ',') as pc_answer, 
              GROUP_CONCAT(practice_content.hint SEPARATOR ',') as hint,
              GROUP_CONCAT(practice_content.p_question SEPARATOR ',') as p_question 
              FROM course_content 
              INNER JOIN practice_content ON course_content.course_code = practice_content.course_code 
              GROUP BY course_content.course_code
              order by course_content.module_no;`;
  db.query(sql1, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({
        message: "Successfull",
        data: results
      });
    };
  });
});

app.put("/api/content/update", (req, res) => {
    course_code = req.body.course_code,
    course_name = req.body.course_name,
    chapter_name = req.body.chapter_name,
    question = req.body.question,
    answer = req.body.answer,
    module_no = req.body.module_no


    console.log(req.body)
  db.query("UPDATE course_content SET course_name = ?,chapter_name = ?,question = ?,answer=?,module_no = ? WHERE course_code =?;", [course_name, chapter_name, question, answer,module_no, course_code], (err) => {
    if (err) {
      res.send({
        status: false,
        message: "update failed"
      });
    }
    else {
      res.send({
        status: true,
        message: "updated successfully"
      });
    }

  })
})
app.put("/api/practicecontent/update" ,(req,res) =>{
sentence = req.body.sentence,
pc_answer = req.body.pc_answer,
hint = req.body.hint,
pc_id = req.body.pc_id
console.log(req.body)
db.query(`update practice_content set sentence = ?,pc_answer = ?,hint = ? where pc_id = ?;`,[sentence,pc_answer,hint,pc_id],(err) =>{
  console.log(err);
  if (err) {
    res.send({
      status: false,
      message: "update failed"
    });
  }
  else {
    res.send({
      status: true,
      message: "updated successfully"
    });
  }
})
})

app.post("/api/notesdata/add", (req, res) => {

  title = req.body.title,
  content = req.body.value
  console.log(req.body)
  let sql = `INSERT INTO studentnotes (title,content) values ("${title}","${content}")`;
  db.query(sql, (err) => {
    if (err) {
      res.send({
        status: false,
        message: "Course detail created failed"
      });
    }
    else {
      res.send({
        status: true,
        message: "Course detail created successfully"
      });
    }

  })
})
app.get("/api/notesdata", (req, res) => {
  let sql = 'select * from studentnotes';
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({
        message: "Data fetched Successfull",
        data: results
      });
    };
  })
}
// "/api/practicecontent/add"
)

//Sample practice content
// , '' as message, '' as filled_answer
app.post("/api/practicecontent/add",(req,res) =>{
 let sentence = req.body.sentence;
 let pc_answer = req.body.answer;
 let hint = req.body.hint;
 let course_name = req.body.course_name;
 let p_question = req.body.p_question;
 let course_code = `SELECT c.course_code FROM course_content c WHERE c.course_name = "${course_name}"`;
 let sql = `INSERT INTO practice_content (sentence, pc_answer, hint, course_code,p_question)
  VALUES (?, ?, ?,  (${course_code}), ?)`;
  console.log(req.body)
  db.query(sql,[sentence,pc_answer,hint,p_question], (err) => {
    console.log(err);
    if (err) {
      res.send({
        status: false,
        message: "Course detail created failed"
      });
    }
    else {
      res.send({
        status: true,
        message: "Course detail created successfully"
      });
    }

  })
  })

app.get("/api/practicecontent", (req, res) => {
  let sql = `select c.course_name,c.course_code, c.module_no, p.p_question, p.sentence,p.hint, p.pc_answer,p.pc_id from course_content c
  inner  join practice_content p on p.course_code=c.course_code order by c.module_no;`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({
        message: "Data fetched Successfull",
        data: results
      });
    };
  });

}
)
// app.get("/api/practicecontent", (req, res) => {
//   let sql = `select p.*, c.course_name, '' as message,"false" as isCorrect, '' as filled_answer from practice_content p, course_content c WHERE p.course_code = c.course_code;`;
//   db.query(sql, (err, results) => {
//     if (err) throw err;
//     if (results.length > 0) {
//       res.send({
//         message: "Data fetched Successfull",
//         data: results
//       });
//     };
//   });

// }
// )
// select *, '' as message, False as isCorrect, '' as filled_answer from practice_content

  // app.get("/api/practicecontent",(res) =>{

  //   let sql = `select * from practice_content`;
  //   db.query(sql, (err, results) => {
  //     console.log(results[0].sentence);
  //     console.log(err);
  //     if (err) throw err;
  //     if (results.length > 0) {
  //       res.send({
  //         message: "Data fetched Successfull",
  //         data: results,
  //       });
  //       // console.log(d);
  //     };
  //   });
  
  // })
// api.put("/api/course/update/:course_id", (req, res) => {
//   let sql =
//     "UPDATE student SET course_id='" +
//     req.body.course_id +
//     "', course_name='" +
//     req.body.course_name +
//     "',course_description='" +
//     req.body.course_description +
//     "'  WHERE id=" +
//     req.params.course_id;

//   let a = db.query(sql, (error, result) => {
//     if (error) {
//       res.send({ status: false, message: "Student Updated Failed" });
//     } else {
//       res.send({ status: true, message: "Student Updated successfully" });
//     }
//   });
// });

app.get('/terminal', (req,res) =>{
  const filePath = path.resolve('/home/sandy/Downloads/git-terminal/git-master/index.html');
  // console.log(filePath)
  // res.send("");
  res.sendFile(filePath);
})