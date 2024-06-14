import mysql from 'mysql2';
import con from "./connection.js"
import createDB from "./createMyDB.js"
import createUsersTable from "./createUsersTable.js"
import createPhotosTable from "./createPhotosTable.js";
import createCoursesTable from "./createCoursesTable.js";
import createCoursesPTable from "./createCoursesPTable.js";
import createTasksTable from "./createTasksTable.js";
import createHWTable from "./createHWTable.js";
import clearDBTables from "./clearDB.js";
import createLessonsTable from './createLessonsTable.js';
import createPasswordsTable from './createPasswordsTable.js';

//initialize the DB and its tables.
const initialization = async function(result) {

  try {
    await createDB();
    await clearDBTables();
    await createUsersTable();
    await createPhotosTable();
    await createCoursesTable();
    await createCoursesPTable();
    await createLessonsTable();
    await createHWTable();
    await createTasksTable();
    await createPasswordsTable()
    console.log("Database and tables created successfully.")
    result(null, "Database and tables created successfully");
  } catch (error) {
    console.error('Initialization error:', error);
    result(error, null);
  }
}

export default initialization;