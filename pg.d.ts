declare module "pg" {
  export interface QueryResult {
    rows: Array<Record<string, string>>;
  }

  export class Pool {
    constructor(config: {
      connectionString: string;
      ssl?: { rejectUnauthorized: boolean };
    });
    connect(): Promise<{
      query: (text: string, params?: Array<string | number | boolean | null | Date>) => Promise<QueryResult>;
      release: () => void;
    }>;
  }
}
