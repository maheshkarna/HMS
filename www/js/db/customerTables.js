let todolist =
  "CREATE TABLE IF NOT EXISTS todolist \
              ( \
                  ID                         INTEGER PRIMARY KEY  AUTOINCREMENT, \
                  TASKNAME                   TEXT NOT NULL \
              );";

let logins =
  "CREATE TABLE IF NOT EXISTS logins \
              ( \
                  ID                         INTEGER PRIMARY KEY  AUTOINCREMENT, \
                  USERNAME                   TEXT NOT NULL, \
                  PASSWORD                   TEXT NOT NULL \
              );";

let rooms = `CREATE TABLE IF NOT EXISTS rooms (
  room_id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_number TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  fee_per_month REAL NOT NULL
);`;


// let fee_details = `CREATE TABLE IF NOT EXISTS fee_details (
//   fee_id INTEGER PRIMARY KEY AUTOINCREMENT,
//   student_id INTEGER NOT NULL,
//   amount REAL NOT NULL,
//   payment_date TEXT NOT NULL,  /* Use TEXT for date storage */
//   status TEXT CHECK(status IN ('Paid', 'Pending')) DEFAULT 'Pending',
//   FOREIGN KEY (student_id) REFERENCES students(student_id)
// );`;

let fee_details = `CREATE TABLE IF NOT EXISTS fee_details (
  fee_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  fee_date TEXT NOT NULL,       /* Date corresponding to the fee month */
  fee_per_month REAL NOT NULL,  /* Monthly fee amount */
  status TEXT NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);`;


let payments = `CREATE TABLE IF NOT EXISTS payments (
  payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fee_id INTEGER NOT NULL,        /* Link to fee_details */
  payment_amount REAL NOT NULL,   /* Amount paid in each payment */
  payment_date TEXT NOT NULL,     /* Date when payment was made */
  FOREIGN KEY (fee_id) REFERENCES fee_details(fee_id)
);`;

let room_allocations = `CREATE TABLE IF NOT EXISTS room_allocations (
  allocation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL,
  allocation_date TEXT NOT NULL,  /* Use TEXT for date storage */
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);`;


let students = `CREATE TABLE IF NOT EXISTS students (
  student_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  contact TEXT NOT NULL,
  adhaar TEXT NOT NULL,  -- Aadhar number as text for flexibility
  address TEXT NOT NULL,
  purpose TEXT NOT NULL,  -- Reason for joining or purpose of stay
  company_or_college TEXT,  -- Name of company or college (optional)
  status TEXT NOT NULL,  -- Status of the student (e.g., active, graduated, etc.)
  join_date TEXT NOT NULL,  -- Date of joining
  fee INTEGER NOT NULL,
  room_no INTEGER NOT NULL,  -- Room number
  description TEXT  -- Additional description if needed
);`;


let expCategory = `CREATE TABLE IF NOT EXISTS expCategory (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL);`;

let expSubcategory = `CREATE TABLE IF NOT EXISTS expSubcategory (
  subcategory_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  subcategory_name TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES category(category_id)
);`;

let expenses = `CREATE TABLE IF NOT EXISTS expenses (
  expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  expense_date TEXT NOT NULL,  /* Use TEXT for date storage */
  category_id INTEGER,
  subcategory_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES category(category_id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategory(subcategory_id)
);`;


// /* Don't forget to enable foreign key enforcement in SQLite */
// db.run("PRAGMA foreign_keys = ON;");
