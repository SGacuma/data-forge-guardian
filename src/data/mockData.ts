
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

export const mockSchemas: DatabaseSchema[] = [
  {
    id: "schema1",
    name: "public",
    tables: [
      {
        id: "table1",
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
        id: "table2",
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
      },
      {
        id: "table3",
        name: "products",
        schema: "public",
        columns: [
          { id: "col10", name: "id", type: "serial", nullable: false, isPrimaryKey: true, isForeignKey: false },
          { id: "col11", name: "name", type: "varchar(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
          { id: "col12", name: "price", type: "decimal(10,2)", nullable: false, isPrimaryKey: false, isForeignKey: false },
          { id: "col13", name: "stock", type: "integer", nullable: false, isPrimaryKey: false, isForeignKey: false },
          { id: "col14", name: "category_id", type: "integer", nullable: true, isPrimaryKey: false, isForeignKey: true }
        ],
        rowCount: 867
      }
    ]
  },
  {
    id: "schema2",
    name: "analytics",
    tables: [
      {
        id: "table4",
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
];

export const mockTableData = {
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
  }
} as Record<string, QueryResult>;

export const mockQueries = [
  "SELECT * FROM users WHERE created_at > '2023-01-01'",
  "SELECT users.username, COUNT(orders.id) as order_count FROM users JOIN orders ON users.id = orders.user_id GROUP BY users.username ORDER BY order_count DESC",
  "SELECT products.name, SUM(orders.total) as revenue FROM products JOIN order_items ON products.id = order_items.product_id JOIN orders ON order_items.order_id = orders.id WHERE orders.status = 'completed' GROUP BY products.name ORDER BY revenue DESC LIMIT 10"
];
