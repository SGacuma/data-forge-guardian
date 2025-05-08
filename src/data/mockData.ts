import { DatabaseConnection, DatabaseSchema, DatabaseTable, QueryResult } from "../types/database";

export const mockConnections: DatabaseConnection[] = [
  {
    id: "1",
    name: "Production Database",
    type: "postgres",
    host: "db.example.com",
    port: 5432,
    username: "admin",
    database: "production_db",
    lastConnected: new Date(2023, 4, 15, 10, 30),
    status: "connected",
    favorite: true
  },
  {
    id: "2",
    name: "Development Server",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "dev",
    database: "dev_database",
    lastConnected: new Date(2023, 5, 20, 14, 45),
    status: "disconnected",
    favorite: false
  },
  {
    id: "3",
    name: "Staging Environment",
    type: "postgres",
    host: "staging.example.com",
    port: 5432,
    username: "stage_user",
    database: "staging_db",
    lastConnected: new Date(2023, 5, 18, 9, 15),
    status: "error",
    favorite: true
  }
];

// Define schemas and tables for each connection by connection ID
export const connectionSchemas: Record<string, DatabaseSchema[]> = {
  // Production Database (connection id: 1)
  "1": [
    {
      id: "schema1_prod",
      name: "public",
      tables: [
        {
          id: "table1_prod",
          name: "users",
          schema: "public",
          columns: [
            { id: "col1", name: "id", type: "serial", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "col2", name: "username", type: "varchar(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "col3", name: "email", type: "varchar(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "col4", name: "created_at", type: "timestamp", nullable: false, isPrimaryKey: false, isForeignKey: false, defaultValue: "CURRENT_TIMESTAMP" }
          ],
          rowCount: 1250
        },
        {
          id: "table2_prod",
          name: "orders",
          schema: "public",
          columns: [
            { id: "col5", name: "id", type: "serial", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "col6", name: "user_id", type: "integer", nullable: false, isPrimaryKey: false, isForeignKey: true },
            { id: "col7", name: "total", type: "decimal(10,2)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "col8", name: "status", type: "varchar(50)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "col9", name: "created_at", type: "timestamp", nullable: false, isPrimaryKey: false, isForeignKey: false, defaultValue: "CURRENT_TIMESTAMP" }
          ],
          rowCount: 5432
        }
      ]
    },
    {
      id: "schema2_prod",
      name: "analytics",
      tables: [
        {
          id: "table4_prod",
          name: "user_sessions",
          schema: "analytics",
          columns: [
            { id: "col15", name: "id", type: "serial", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "col16", name: "user_id", type: "integer", nullable: false, isPrimaryKey: false, isForeignKey: true },
            { id: "col17", name: "session_start", type: "timestamp", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "col18", name: "session_end", type: "timestamp", nullable: true, isPrimaryKey: false, isForeignKey: false },
            { id: "col19", name: "device", type: "varchar(100)", nullable: true, isPrimaryKey: false, isForeignKey: false }
          ],
          rowCount: 45678
        }
      ]
    }
  ],
  
  // Development Server (connection id: 2)
  "2": [
    {
      id: "schema1_dev",
      name: "main",
      tables: [
        {
          id: "table1_dev",
          name: "customers",
          schema: "main",
          columns: [
            { id: "devcol1", name: "customer_id", type: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "devcol2", name: "first_name", type: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "devcol3", name: "last_name", type: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "devcol4", name: "signup_date", type: "datetime", nullable: false, isPrimaryKey: false, isForeignKey: false }
          ],
          rowCount: 523
        },
        {
          id: "table2_dev",
          name: "products",
          schema: "main",
          columns: [
            { id: "devcol5", name: "product_id", type: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "devcol6", name: "name", type: "varchar(200)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "devcol7", name: "category", type: "varchar(100)", nullable: true, isPrimaryKey: false, isForeignKey: false },
            { id: "devcol8", name: "price", type: "decimal(10,2)", nullable: false, isPrimaryKey: false, isForeignKey: false }
          ],
          rowCount: 178
        }
      ]
    },
    {
      id: "schema2_dev",
      name: "test",
      tables: [
        {
          id: "table3_dev",
          name: "test_users",
          schema: "test",
          columns: [
            { id: "devcol9", name: "id", type: "int", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "devcol10", name: "email", type: "varchar(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "devcol11", name: "test_group", type: "char(1)", nullable: false, isPrimaryKey: false, isForeignKey: false }
          ],
          rowCount: 50
        }
      ]
    }
  ],
  
  // Staging Environment (connection id: 3)
  "3": [
    {
      id: "schema1_staging",
      name: "public",
      tables: [
        {
          id: "table1_staging",
          name: "employees",
          schema: "public",
          columns: [
            { id: "stagecol1", name: "employee_id", type: "serial", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "stagecol2", name: "name", type: "varchar(200)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "stagecol3", name: "department", type: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "stagecol4", name: "hire_date", type: "date", nullable: false, isPrimaryKey: false, isForeignKey: false }
          ],
          rowCount: 87
        },
        {
          id: "table2_staging",
          name: "departments",
          schema: "public",
          columns: [
            { id: "stagecol5", name: "dept_id", type: "serial", nullable: false, isPrimaryKey: true, isForeignKey: false },
            { id: "stagecol6", name: "name", type: "varchar(100)", nullable: false, isPrimaryKey: false, isForeignKey: false },
            { id: "stagecol7", name: "budget", type: "decimal(15,2)", nullable: true, isPrimaryKey: false, isForeignKey: false }
          ],
          rowCount: 12
        }
      ]
    }
  ]
};

// Keep the original mockSchemas for backward compatibility
export const mockSchemas = connectionSchemas["1"];

// Mock table data for different tables in different connections
export const mockTableData = {
  // Production database tables
  "users": {
    columns: ["id", "username", "email", "created_at"],
    rows: [
      { id: 1, username: "johndoe", email: "john@example.com", created_at: "2023-01-15 08:30:45" },
      { id: 2, username: "janedoe", email: "jane@example.com", created_at: "2023-02-20 14:15:32" },
      { id: 3, username: "bobsmith", email: "bob@example.com", created_at: "2023-03-10 11:45:08" },
      { id: 4, username: "alicejones", email: "alice@example.com", created_at: "2023-04-05 16:22:19" },
      { id: 5, username: "mikebrown", email: "mike@example.com", created_at: "2023-05-12 09:10:56" }
    ],
    rowCount: 5,
    executionTime: 0.015
  },
  "orders": {
    columns: ["id", "user_id", "total", "status", "created_at"],
    rows: [
      { id: 1, user_id: 1, total: "125.99", status: "completed", created_at: "2023-02-10 14:30:00" },
      { id: 2, user_id: 1, total: "89.50", status: "completed", created_at: "2023-03-15 11:15:22" },
      { id: 3, user_id: 2, total: "245.00", status: "processing", created_at: "2023-05-08 09:45:18" },
      { id: 4, user_id: 3, total: "55.25", status: "completed", created_at: "2023-04-28 16:20:45" },
      { id: 5, user_id: 4, total: "198.75", status: "shipped", created_at: "2023-05-14 10:05:33" }
    ],
    rowCount: 5,
    executionTime: 0.018
  },
  
  // Development database tables
  "customers": {
    columns: ["customer_id", "first_name", "last_name", "signup_date"],
    rows: [
      { customer_id: 1, first_name: "Alex", last_name: "Wilson", signup_date: "2022-11-05 09:32:10" },
      { customer_id: 2, first_name: "Taylor", last_name: "Smith", signup_date: "2022-12-15 14:22:30" },
      { customer_id: 3, first_name: "Jordan", last_name: "Lee", signup_date: "2023-01-20 11:05:45" }
    ],
    rowCount: 3,
    executionTime: 0.012
  },
  "products": {
    columns: ["product_id", "name", "category", "price"],
    rows: [
      { product_id: 101, name: "Basic Widget", category: "Widgets", price: "19.99" },
      { product_id: 102, name: "Advanced Widget", category: "Widgets", price: "49.99" },
      { product_id: 103, name: "Premium Gadget", category: "Gadgets", price: "99.99" }
    ],
    rowCount: 3,
    executionTime: 0.010
  },
  
  // Staging database tables
  "employees": {
    columns: ["employee_id", "name", "department", "hire_date"],
    rows: [
      { employee_id: 1, name: "Sam Johnson", department: "Engineering", hire_date: "2022-06-15" },
      { employee_id: 2, name: "Emily Chen", department: "Marketing", hire_date: "2022-09-01" },
      { employee_id: 3, name: "David Kim", department: "Engineering", hire_date: "2023-01-10" }
    ],
    rowCount: 3,
    executionTime: 0.008
  },
  "departments": {
    columns: ["dept_id", "name", "budget"],
    rows: [
      { dept_id: 1, name: "Engineering", budget: "500000.00" },
      { dept_id: 2, name: "Marketing", budget: "350000.00" },
      { dept_id: 3, name: "Finance", budget: "250000.00" }
    ],
    rowCount: 3,
    executionTime: 0.007
  }
} as Record<string, QueryResult>;

export const mockQueries = [
  "SELECT * FROM users WHERE created_at > '2023-01-01'",
  "SELECT users.username, COUNT(orders.id) as order_count FROM users JOIN orders ON users.id = orders.user_id GROUP BY users.username ORDER BY order_count DESC",
  "SELECT products.name, SUM(orders.total) as revenue FROM products JOIN order_items ON products.id = order_items.product_id JOIN orders ON order_items.order_id = orders.id WHERE orders.status = 'completed' GROUP BY products.name ORDER BY revenue DESC LIMIT 10"
];
