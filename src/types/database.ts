
export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'mysql' | 'postgres' | 'sqlite' | 'mssql' | 'oracle';
  host: string;
  port: number;
  username: string;
  password?: string;
  database: string;
  lastConnected?: Date;
  status: 'connected' | 'disconnected' | 'error';
  favorite: boolean;
}

export interface DatabaseSchema {
  id: string;
  name: string;
  tables: DatabaseTable[];
}

export interface DatabaseTable {
  id: string;
  name: string;
  schema: string;
  columns: DatabaseColumn[];
  rowCount: number;
}

export interface DatabaseColumn {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  defaultValue?: string;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTime: number;
}
