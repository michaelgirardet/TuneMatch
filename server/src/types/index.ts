export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface ServerConfig {
  port: number;
}

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: Date;
} 