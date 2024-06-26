const inquirer = require("inquirer");
const {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require("./queries");

const menu = async () => {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee Role",
      "Exit",
    ],
  });

  switch (action) {
    case "View All Departments":
      viewDepartments();
      break;
    case "View All Roles":
      viewRoles();
      break;
    case "View All Employees":
      viewEmployees();
      break;
    case "Add a Department":
      addNewDepartment();
      break;
    case "Add a Role":
      addNewRole();
      break;
    case "Add an Employee":
      addNewEmployee();
      break;
    case "Update an Employee Role":
      updateRole();
      break;
    case "Exit":
      console.log("Goodbye!");
      process.exit();
  }
};

const viewDepartments = async () => {
  const res = await getDepartments();
  console.table(res.rows);
  menu();
};

const viewRoles = async () => {
  const res = await getRoles();
  console.table(res.rows);
  menu();
};

const viewEmployees = async () => {
  const res = await getEmployees();
  console.table(res.rows);
  menu();
};

const addNewDepartment = async () => {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Enter the name of the department:",
  });
  await addDepartment(name);
  console.log(`Added department ${name}`);
  menu();
};

const addNewRole = async () => {
  const departments = await getDepartments();
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the name of the role:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary for the role:",
    },
    {
      type: "list",
      name: "department_id",
      message: "Select the department for the role:",
      choices: departments.rows.map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]);
  await addRole(title, salary, department_id);
  console.log(`Added role ${title}`);
  menu();
};

const addNewEmployee = async () => {
  const roles = await getRoles();
  const employees = await getEmployees();
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the first name of the employee:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the last name of the employee:",
    },
    {
      type: "list",
      name: "role_id",
      message: "Select the role for the employee:",
      choices: roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Select the manager for the employee:",
      choices: [{ name: "None", value: null }].concat(
        employees.rows.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }))
      ),
    },
  ]);
  await addEmployee(first_name, last_name, role_id, manager_id);
  console.log(`Added employee ${first_name} ${last_name}`);
  menu();
};

const updateRole = async () => {
  const employees = await getEmployees();
  const roles = await getRoles();
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: "list",
      name: "employee_id",
      message: "Select the employee to update:",
      choices: employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    },
    {
      type: "list",
      name: "role_id",
      message: "Select the new role for the employee:",
      choices: roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
  ]);
  await updateEmployeeRole(employee_id, role_id);
  console.log("Updated employee role");
  menu();
};

menu();
