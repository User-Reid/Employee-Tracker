CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER REFERENCES department(id)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER REFERENCES role(id),
  manager_id INTEGER REFERENCES employee(id)
);