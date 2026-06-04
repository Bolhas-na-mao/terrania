import { drizzle } from "drizzle-orm/postgres-js";
import type { Logger as DrizzleLogger } from "drizzle-orm/logger";
import postgres from "postgres";

type QueryLoggerTarget = {
  debug: (object: Record<string, unknown>, message: string) => void;
};

type CreateDatabaseOptions = {
  connectionString: string;
  logger?: QueryLoggerTarget;
  logQueries?: boolean;
};

class QueryLogger implements DrizzleLogger {
  private readonly logger: QueryLoggerTarget;

  public constructor(logger: QueryLoggerTarget) {
    this.logger = logger;
  }

  public logQuery(query: string, params: unknown[]): void {
    this.logger.debug({ params, query }, "database query executed");
  }
}

export const createDatabase = ({
  connectionString,
  logger,
  logQueries = false,
}: CreateDatabaseOptions) => {
  const sql = postgres(connectionString, {
    debug: logQueries
      ? (connection, query, parameters) => {
          logger?.debug(
            {
              connection,
              parameters,
              query,
            },
            "postgres client query",
          );
        }
      : false,
  });

  return drizzle(sql, {
    logger: logger && logQueries ? new QueryLogger(logger) : false,
  });
};

export type DatabaseClient = ReturnType<typeof createDatabase>;
