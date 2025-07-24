
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Plugin
 * 
 */
export type Plugin = $Result.DefaultSelection<Prisma.$PluginPayload>
/**
 * Model Device
 * 
 */
export type Device = $Result.DefaultSelection<Prisma.$DevicePayload>
/**
 * Model UserPlugin
 * 
 */
export type UserPlugin = $Result.DefaultSelection<Prisma.$UserPluginPayload>
/**
 * Model UserPresence
 * 
 */
export type UserPresence = $Result.DefaultSelection<Prisma.$UserPresencePayload>
/**
 * Model ActivityLog
 * 
 */
export type ActivityLog = $Result.DefaultSelection<Prisma.$ActivityLogPayload>
/**
 * Model CrashReport
 * 
 */
export type CrashReport = $Result.DefaultSelection<Prisma.$CrashReportPayload>
/**
 * Model WebRtcMetric
 * 
 */
export type WebRtcMetric = $Result.DefaultSelection<Prisma.$WebRtcMetricPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Snapshot
 * 
 */
export type Snapshot = $Result.DefaultSelection<Prisma.$SnapshotPayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model EntityTag
 * 
 */
export type EntityTag = $Result.DefaultSelection<Prisma.$EntityTagPayload>
/**
 * Model FileTransfer
 * 
 */
export type FileTransfer = $Result.DefaultSelection<Prisma.$FileTransferPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.plugin`: Exposes CRUD operations for the **Plugin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plugins
    * const plugins = await prisma.plugin.findMany()
    * ```
    */
  get plugin(): Prisma.PluginDelegate<ExtArgs>;

  /**
   * `prisma.device`: Exposes CRUD operations for the **Device** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devices
    * const devices = await prisma.device.findMany()
    * ```
    */
  get device(): Prisma.DeviceDelegate<ExtArgs>;

  /**
   * `prisma.userPlugin`: Exposes CRUD operations for the **UserPlugin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPlugins
    * const userPlugins = await prisma.userPlugin.findMany()
    * ```
    */
  get userPlugin(): Prisma.UserPluginDelegate<ExtArgs>;

  /**
   * `prisma.userPresence`: Exposes CRUD operations for the **UserPresence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPresences
    * const userPresences = await prisma.userPresence.findMany()
    * ```
    */
  get userPresence(): Prisma.UserPresenceDelegate<ExtArgs>;

  /**
   * `prisma.activityLog`: Exposes CRUD operations for the **ActivityLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActivityLogs
    * const activityLogs = await prisma.activityLog.findMany()
    * ```
    */
  get activityLog(): Prisma.ActivityLogDelegate<ExtArgs>;

  /**
   * `prisma.crashReport`: Exposes CRUD operations for the **CrashReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CrashReports
    * const crashReports = await prisma.crashReport.findMany()
    * ```
    */
  get crashReport(): Prisma.CrashReportDelegate<ExtArgs>;

  /**
   * `prisma.webRtcMetric`: Exposes CRUD operations for the **WebRtcMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WebRtcMetrics
    * const webRtcMetrics = await prisma.webRtcMetric.findMany()
    * ```
    */
  get webRtcMetric(): Prisma.WebRtcMetricDelegate<ExtArgs>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs>;

  /**
   * `prisma.snapshot`: Exposes CRUD operations for the **Snapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Snapshots
    * const snapshots = await prisma.snapshot.findMany()
    * ```
    */
  get snapshot(): Prisma.SnapshotDelegate<ExtArgs>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs>;

  /**
   * `prisma.entityTag`: Exposes CRUD operations for the **EntityTag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EntityTags
    * const entityTags = await prisma.entityTag.findMany()
    * ```
    */
  get entityTag(): Prisma.EntityTagDelegate<ExtArgs>;

  /**
   * `prisma.fileTransfer`: Exposes CRUD operations for the **FileTransfer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileTransfers
    * const fileTransfers = await prisma.fileTransfer.findMany()
    * ```
    */
  get fileTransfer(): Prisma.FileTransferDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Plugin: 'Plugin',
    Device: 'Device',
    UserPlugin: 'UserPlugin',
    UserPresence: 'UserPresence',
    ActivityLog: 'ActivityLog',
    CrashReport: 'CrashReport',
    WebRtcMetric: 'WebRtcMetric',
    Project: 'Project',
    Snapshot: 'Snapshot',
    Tag: 'Tag',
    EntityTag: 'EntityTag',
    FileTransfer: 'FileTransfer'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "plugin" | "device" | "userPlugin" | "userPresence" | "activityLog" | "crashReport" | "webRtcMetric" | "project" | "snapshot" | "tag" | "entityTag" | "fileTransfer"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Plugin: {
        payload: Prisma.$PluginPayload<ExtArgs>
        fields: Prisma.PluginFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PluginFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PluginFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>
          }
          findFirst: {
            args: Prisma.PluginFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PluginFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>
          }
          findMany: {
            args: Prisma.PluginFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>[]
          }
          create: {
            args: Prisma.PluginCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>
          }
          createMany: {
            args: Prisma.PluginCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PluginCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>[]
          }
          delete: {
            args: Prisma.PluginDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>
          }
          update: {
            args: Prisma.PluginUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>
          }
          deleteMany: {
            args: Prisma.PluginDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PluginUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PluginUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PluginPayload>
          }
          aggregate: {
            args: Prisma.PluginAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlugin>
          }
          groupBy: {
            args: Prisma.PluginGroupByArgs<ExtArgs>
            result: $Utils.Optional<PluginGroupByOutputType>[]
          }
          count: {
            args: Prisma.PluginCountArgs<ExtArgs>
            result: $Utils.Optional<PluginCountAggregateOutputType> | number
          }
        }
      }
      Device: {
        payload: Prisma.$DevicePayload<ExtArgs>
        fields: Prisma.DeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findFirst: {
            args: Prisma.DeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findMany: {
            args: Prisma.DeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          create: {
            args: Prisma.DeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          createMany: {
            args: Prisma.DeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          delete: {
            args: Prisma.DeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          update: {
            args: Prisma.DeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          deleteMany: {
            args: Prisma.DeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          aggregate: {
            args: Prisma.DeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevice>
          }
          groupBy: {
            args: Prisma.DeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeviceCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceCountAggregateOutputType> | number
          }
        }
      }
      UserPlugin: {
        payload: Prisma.$UserPluginPayload<ExtArgs>
        fields: Prisma.UserPluginFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPluginFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPluginFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>
          }
          findFirst: {
            args: Prisma.UserPluginFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPluginFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>
          }
          findMany: {
            args: Prisma.UserPluginFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>[]
          }
          create: {
            args: Prisma.UserPluginCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>
          }
          createMany: {
            args: Prisma.UserPluginCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserPluginCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>[]
          }
          delete: {
            args: Prisma.UserPluginDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>
          }
          update: {
            args: Prisma.UserPluginUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>
          }
          deleteMany: {
            args: Prisma.UserPluginDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPluginUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserPluginUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPluginPayload>
          }
          aggregate: {
            args: Prisma.UserPluginAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPlugin>
          }
          groupBy: {
            args: Prisma.UserPluginGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPluginGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPluginCountArgs<ExtArgs>
            result: $Utils.Optional<UserPluginCountAggregateOutputType> | number
          }
        }
      }
      UserPresence: {
        payload: Prisma.$UserPresencePayload<ExtArgs>
        fields: Prisma.UserPresenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPresenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPresenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>
          }
          findFirst: {
            args: Prisma.UserPresenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPresenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>
          }
          findMany: {
            args: Prisma.UserPresenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>[]
          }
          create: {
            args: Prisma.UserPresenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>
          }
          createMany: {
            args: Prisma.UserPresenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserPresenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>[]
          }
          delete: {
            args: Prisma.UserPresenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>
          }
          update: {
            args: Prisma.UserPresenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>
          }
          deleteMany: {
            args: Prisma.UserPresenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPresenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserPresenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPresencePayload>
          }
          aggregate: {
            args: Prisma.UserPresenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPresence>
          }
          groupBy: {
            args: Prisma.UserPresenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPresenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPresenceCountArgs<ExtArgs>
            result: $Utils.Optional<UserPresenceCountAggregateOutputType> | number
          }
        }
      }
      ActivityLog: {
        payload: Prisma.$ActivityLogPayload<ExtArgs>
        fields: Prisma.ActivityLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActivityLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActivityLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          findFirst: {
            args: Prisma.ActivityLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActivityLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          findMany: {
            args: Prisma.ActivityLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>[]
          }
          create: {
            args: Prisma.ActivityLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          createMany: {
            args: Prisma.ActivityLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActivityLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>[]
          }
          delete: {
            args: Prisma.ActivityLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          update: {
            args: Prisma.ActivityLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          deleteMany: {
            args: Prisma.ActivityLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActivityLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActivityLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivityLogPayload>
          }
          aggregate: {
            args: Prisma.ActivityLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActivityLog>
          }
          groupBy: {
            args: Prisma.ActivityLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActivityLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActivityLogCountArgs<ExtArgs>
            result: $Utils.Optional<ActivityLogCountAggregateOutputType> | number
          }
        }
      }
      CrashReport: {
        payload: Prisma.$CrashReportPayload<ExtArgs>
        fields: Prisma.CrashReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CrashReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CrashReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>
          }
          findFirst: {
            args: Prisma.CrashReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CrashReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>
          }
          findMany: {
            args: Prisma.CrashReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>[]
          }
          create: {
            args: Prisma.CrashReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>
          }
          createMany: {
            args: Prisma.CrashReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CrashReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>[]
          }
          delete: {
            args: Prisma.CrashReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>
          }
          update: {
            args: Prisma.CrashReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>
          }
          deleteMany: {
            args: Prisma.CrashReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CrashReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CrashReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashReportPayload>
          }
          aggregate: {
            args: Prisma.CrashReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCrashReport>
          }
          groupBy: {
            args: Prisma.CrashReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<CrashReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.CrashReportCountArgs<ExtArgs>
            result: $Utils.Optional<CrashReportCountAggregateOutputType> | number
          }
        }
      }
      WebRtcMetric: {
        payload: Prisma.$WebRtcMetricPayload<ExtArgs>
        fields: Prisma.WebRtcMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebRtcMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebRtcMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>
          }
          findFirst: {
            args: Prisma.WebRtcMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebRtcMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>
          }
          findMany: {
            args: Prisma.WebRtcMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>[]
          }
          create: {
            args: Prisma.WebRtcMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>
          }
          createMany: {
            args: Prisma.WebRtcMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebRtcMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>[]
          }
          delete: {
            args: Prisma.WebRtcMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>
          }
          update: {
            args: Prisma.WebRtcMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>
          }
          deleteMany: {
            args: Prisma.WebRtcMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebRtcMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WebRtcMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebRtcMetricPayload>
          }
          aggregate: {
            args: Prisma.WebRtcMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebRtcMetric>
          }
          groupBy: {
            args: Prisma.WebRtcMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebRtcMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebRtcMetricCountArgs<ExtArgs>
            result: $Utils.Optional<WebRtcMetricCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Snapshot: {
        payload: Prisma.$SnapshotPayload<ExtArgs>
        fields: Prisma.SnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          findFirst: {
            args: Prisma.SnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          findMany: {
            args: Prisma.SnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>[]
          }
          create: {
            args: Prisma.SnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          createMany: {
            args: Prisma.SnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>[]
          }
          delete: {
            args: Prisma.SnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          update: {
            args: Prisma.SnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          deleteMany: {
            args: Prisma.SnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          aggregate: {
            args: Prisma.SnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapshot>
          }
          groupBy: {
            args: Prisma.SnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<SnapshotCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      EntityTag: {
        payload: Prisma.$EntityTagPayload<ExtArgs>
        fields: Prisma.EntityTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EntityTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EntityTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>
          }
          findFirst: {
            args: Prisma.EntityTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EntityTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>
          }
          findMany: {
            args: Prisma.EntityTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>[]
          }
          create: {
            args: Prisma.EntityTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>
          }
          createMany: {
            args: Prisma.EntityTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EntityTagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>[]
          }
          delete: {
            args: Prisma.EntityTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>
          }
          update: {
            args: Prisma.EntityTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>
          }
          deleteMany: {
            args: Prisma.EntityTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EntityTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EntityTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityTagPayload>
          }
          aggregate: {
            args: Prisma.EntityTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEntityTag>
          }
          groupBy: {
            args: Prisma.EntityTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<EntityTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.EntityTagCountArgs<ExtArgs>
            result: $Utils.Optional<EntityTagCountAggregateOutputType> | number
          }
        }
      }
      FileTransfer: {
        payload: Prisma.$FileTransferPayload<ExtArgs>
        fields: Prisma.FileTransferFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileTransferFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileTransferFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>
          }
          findFirst: {
            args: Prisma.FileTransferFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileTransferFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>
          }
          findMany: {
            args: Prisma.FileTransferFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>[]
          }
          create: {
            args: Prisma.FileTransferCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>
          }
          createMany: {
            args: Prisma.FileTransferCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileTransferCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>[]
          }
          delete: {
            args: Prisma.FileTransferDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>
          }
          update: {
            args: Prisma.FileTransferUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>
          }
          deleteMany: {
            args: Prisma.FileTransferDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileTransferUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FileTransferUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileTransferPayload>
          }
          aggregate: {
            args: Prisma.FileTransferAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileTransfer>
          }
          groupBy: {
            args: Prisma.FileTransferGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileTransferGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileTransferCountArgs<ExtArgs>
            result: $Utils.Optional<FileTransferCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    userPlugins: number
    presence: number
    activityLogs: number
    crashReports: number
    webRtcMetrics: number
    devices: number
    fromTransfers: number
    toTransfers: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userPlugins?: boolean | UserCountOutputTypeCountUserPluginsArgs
    presence?: boolean | UserCountOutputTypeCountPresenceArgs
    activityLogs?: boolean | UserCountOutputTypeCountActivityLogsArgs
    crashReports?: boolean | UserCountOutputTypeCountCrashReportsArgs
    webRtcMetrics?: boolean | UserCountOutputTypeCountWebRtcMetricsArgs
    devices?: boolean | UserCountOutputTypeCountDevicesArgs
    fromTransfers?: boolean | UserCountOutputTypeCountFromTransfersArgs
    toTransfers?: boolean | UserCountOutputTypeCountToTransfersArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserPluginsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPluginWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPresenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPresenceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActivityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCrashReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrashReportWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWebRtcMetricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebRtcMetricWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFromTransfersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileTransferWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountToTransfersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileTransferWhereInput
  }


  /**
   * Count Type PluginCountOutputType
   */

  export type PluginCountOutputType = {
    userPlugins: number
  }

  export type PluginCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userPlugins?: boolean | PluginCountOutputTypeCountUserPluginsArgs
  }

  // Custom InputTypes
  /**
   * PluginCountOutputType without action
   */
  export type PluginCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PluginCountOutputType
     */
    select?: PluginCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PluginCountOutputType without action
   */
  export type PluginCountOutputTypeCountUserPluginsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPluginWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    snapshots: number
    activityLogs: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshots?: boolean | ProjectCountOutputTypeCountSnapshotsArgs
    activityLogs?: boolean | ProjectCountOutputTypeCountActivityLogsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountSnapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapshotWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountActivityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityLogWhereInput
  }


  /**
   * Count Type SnapshotCountOutputType
   */

  export type SnapshotCountOutputType = {
    tags: number
  }

  export type SnapshotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tags?: boolean | SnapshotCountOutputTypeCountTagsArgs
  }

  // Custom InputTypes
  /**
   * SnapshotCountOutputType without action
   */
  export type SnapshotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotCountOutputType
     */
    select?: SnapshotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SnapshotCountOutputType without action
   */
  export type SnapshotCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntityTagWhereInput
  }


  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    entityTags: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entityTags?: boolean | TagCountOutputTypeCountEntityTagsArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountEntityTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntityTagWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    password: string | null
    refreshToken: string | null
    isApproved: boolean | null
    inventoryHash: string | null
    lastLoginAt: Date | null
    lastInventorySync: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    password: string | null
    refreshToken: string | null
    isApproved: boolean | null
    inventoryHash: string | null
    lastLoginAt: Date | null
    lastInventorySync: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    displayName: number
    bio: number
    avatarUrl: number
    password: number
    refreshToken: number
    isApproved: number
    inventoryHash: number
    lastLoginAt: number
    lastInventorySync: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    displayName?: true
    bio?: true
    avatarUrl?: true
    password?: true
    refreshToken?: true
    isApproved?: true
    inventoryHash?: true
    lastLoginAt?: true
    lastInventorySync?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    displayName?: true
    bio?: true
    avatarUrl?: true
    password?: true
    refreshToken?: true
    isApproved?: true
    inventoryHash?: true
    lastLoginAt?: true
    lastInventorySync?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    displayName?: true
    bio?: true
    avatarUrl?: true
    password?: true
    refreshToken?: true
    isApproved?: true
    inventoryHash?: true
    lastLoginAt?: true
    lastInventorySync?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    password: string
    refreshToken: string | null
    isApproved: boolean
    inventoryHash: string | null
    lastLoginAt: Date | null
    lastInventorySync: Date | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    displayName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    password?: boolean
    refreshToken?: boolean
    isApproved?: boolean
    inventoryHash?: boolean
    lastLoginAt?: boolean
    lastInventorySync?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    userPlugins?: boolean | User$userPluginsArgs<ExtArgs>
    presence?: boolean | User$presenceArgs<ExtArgs>
    activityLogs?: boolean | User$activityLogsArgs<ExtArgs>
    crashReports?: boolean | User$crashReportsArgs<ExtArgs>
    webRtcMetrics?: boolean | User$webRtcMetricsArgs<ExtArgs>
    devices?: boolean | User$devicesArgs<ExtArgs>
    fromTransfers?: boolean | User$fromTransfersArgs<ExtArgs>
    toTransfers?: boolean | User$toTransfersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    displayName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    password?: boolean
    refreshToken?: boolean
    isApproved?: boolean
    inventoryHash?: boolean
    lastLoginAt?: boolean
    lastInventorySync?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    displayName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    password?: boolean
    refreshToken?: boolean
    isApproved?: boolean
    inventoryHash?: boolean
    lastLoginAt?: boolean
    lastInventorySync?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userPlugins?: boolean | User$userPluginsArgs<ExtArgs>
    presence?: boolean | User$presenceArgs<ExtArgs>
    activityLogs?: boolean | User$activityLogsArgs<ExtArgs>
    crashReports?: boolean | User$crashReportsArgs<ExtArgs>
    webRtcMetrics?: boolean | User$webRtcMetricsArgs<ExtArgs>
    devices?: boolean | User$devicesArgs<ExtArgs>
    fromTransfers?: boolean | User$fromTransfersArgs<ExtArgs>
    toTransfers?: boolean | User$toTransfersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      userPlugins: Prisma.$UserPluginPayload<ExtArgs>[]
      presence: Prisma.$UserPresencePayload<ExtArgs>[]
      activityLogs: Prisma.$ActivityLogPayload<ExtArgs>[]
      crashReports: Prisma.$CrashReportPayload<ExtArgs>[]
      webRtcMetrics: Prisma.$WebRtcMetricPayload<ExtArgs>[]
      devices: Prisma.$DevicePayload<ExtArgs>[]
      fromTransfers: Prisma.$FileTransferPayload<ExtArgs>[]
      toTransfers: Prisma.$FileTransferPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      displayName: string | null
      bio: string | null
      avatarUrl: string | null
      password: string
      refreshToken: string | null
      isApproved: boolean
      inventoryHash: string | null
      lastLoginAt: Date | null
      lastInventorySync: Date | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userPlugins<T extends User$userPluginsArgs<ExtArgs> = {}>(args?: Subset<T, User$userPluginsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "findMany"> | Null>
    presence<T extends User$presenceArgs<ExtArgs> = {}>(args?: Subset<T, User$presenceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "findMany"> | Null>
    activityLogs<T extends User$activityLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany"> | Null>
    crashReports<T extends User$crashReportsArgs<ExtArgs> = {}>(args?: Subset<T, User$crashReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "findMany"> | Null>
    webRtcMetrics<T extends User$webRtcMetricsArgs<ExtArgs> = {}>(args?: Subset<T, User$webRtcMetricsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "findMany"> | Null>
    devices<T extends User$devicesArgs<ExtArgs> = {}>(args?: Subset<T, User$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany"> | Null>
    fromTransfers<T extends User$fromTransfersArgs<ExtArgs> = {}>(args?: Subset<T, User$fromTransfersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "findMany"> | Null>
    toTransfers<T extends User$toTransfersArgs<ExtArgs> = {}>(args?: Subset<T, User$toTransfersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly refreshToken: FieldRef<"User", 'String'>
    readonly isApproved: FieldRef<"User", 'Boolean'>
    readonly inventoryHash: FieldRef<"User", 'String'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly lastInventorySync: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.userPlugins
   */
  export type User$userPluginsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    where?: UserPluginWhereInput
    orderBy?: UserPluginOrderByWithRelationInput | UserPluginOrderByWithRelationInput[]
    cursor?: UserPluginWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPluginScalarFieldEnum | UserPluginScalarFieldEnum[]
  }

  /**
   * User.presence
   */
  export type User$presenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    where?: UserPresenceWhereInput
    orderBy?: UserPresenceOrderByWithRelationInput | UserPresenceOrderByWithRelationInput[]
    cursor?: UserPresenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPresenceScalarFieldEnum | UserPresenceScalarFieldEnum[]
  }

  /**
   * User.activityLogs
   */
  export type User$activityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    where?: ActivityLogWhereInput
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    cursor?: ActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * User.crashReports
   */
  export type User$crashReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    where?: CrashReportWhereInput
    orderBy?: CrashReportOrderByWithRelationInput | CrashReportOrderByWithRelationInput[]
    cursor?: CrashReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CrashReportScalarFieldEnum | CrashReportScalarFieldEnum[]
  }

  /**
   * User.webRtcMetrics
   */
  export type User$webRtcMetricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    where?: WebRtcMetricWhereInput
    orderBy?: WebRtcMetricOrderByWithRelationInput | WebRtcMetricOrderByWithRelationInput[]
    cursor?: WebRtcMetricWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WebRtcMetricScalarFieldEnum | WebRtcMetricScalarFieldEnum[]
  }

  /**
   * User.devices
   */
  export type User$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    cursor?: DeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * User.fromTransfers
   */
  export type User$fromTransfersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    where?: FileTransferWhereInput
    orderBy?: FileTransferOrderByWithRelationInput | FileTransferOrderByWithRelationInput[]
    cursor?: FileTransferWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileTransferScalarFieldEnum | FileTransferScalarFieldEnum[]
  }

  /**
   * User.toTransfers
   */
  export type User$toTransfersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    where?: FileTransferWhereInput
    orderBy?: FileTransferOrderByWithRelationInput | FileTransferOrderByWithRelationInput[]
    cursor?: FileTransferWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileTransferScalarFieldEnum | FileTransferScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Plugin
   */

  export type AggregatePlugin = {
    _count: PluginCountAggregateOutputType | null
    _min: PluginMinAggregateOutputType | null
    _max: PluginMaxAggregateOutputType | null
  }

  export type PluginMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    version: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PluginMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    version: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PluginCountAggregateOutputType = {
    id: number
    name: number
    description: number
    version: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type PluginMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PluginMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PluginCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type PluginAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plugin to aggregate.
     */
    where?: PluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plugins to fetch.
     */
    orderBy?: PluginOrderByWithRelationInput | PluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plugins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plugins
    **/
    _count?: true | PluginCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PluginMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PluginMaxAggregateInputType
  }

  export type GetPluginAggregateType<T extends PluginAggregateArgs> = {
        [P in keyof T & keyof AggregatePlugin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlugin[P]>
      : GetScalarType<T[P], AggregatePlugin[P]>
  }




  export type PluginGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PluginWhereInput
    orderBy?: PluginOrderByWithAggregationInput | PluginOrderByWithAggregationInput[]
    by: PluginScalarFieldEnum[] | PluginScalarFieldEnum
    having?: PluginScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PluginCountAggregateInputType | true
    _min?: PluginMinAggregateInputType
    _max?: PluginMaxAggregateInputType
  }

  export type PluginGroupByOutputType = {
    id: string
    name: string
    description: string | null
    version: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: PluginCountAggregateOutputType | null
    _min: PluginMinAggregateOutputType | null
    _max: PluginMaxAggregateOutputType | null
  }

  type GetPluginGroupByPayload<T extends PluginGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PluginGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PluginGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PluginGroupByOutputType[P]>
            : GetScalarType<T[P], PluginGroupByOutputType[P]>
        }
      >
    >


  export type PluginSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    userPlugins?: boolean | Plugin$userPluginsArgs<ExtArgs>
    _count?: boolean | PluginCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plugin"]>

  export type PluginSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["plugin"]>

  export type PluginSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type PluginInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userPlugins?: boolean | Plugin$userPluginsArgs<ExtArgs>
    _count?: boolean | PluginCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PluginIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PluginPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plugin"
    objects: {
      userPlugins: Prisma.$UserPluginPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      version: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["plugin"]>
    composites: {}
  }

  type PluginGetPayload<S extends boolean | null | undefined | PluginDefaultArgs> = $Result.GetResult<Prisma.$PluginPayload, S>

  type PluginCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PluginFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PluginCountAggregateInputType | true
    }

  export interface PluginDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plugin'], meta: { name: 'Plugin' } }
    /**
     * Find zero or one Plugin that matches the filter.
     * @param {PluginFindUniqueArgs} args - Arguments to find a Plugin
     * @example
     * // Get one Plugin
     * const plugin = await prisma.plugin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PluginFindUniqueArgs>(args: SelectSubset<T, PluginFindUniqueArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Plugin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PluginFindUniqueOrThrowArgs} args - Arguments to find a Plugin
     * @example
     * // Get one Plugin
     * const plugin = await prisma.plugin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PluginFindUniqueOrThrowArgs>(args: SelectSubset<T, PluginFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Plugin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginFindFirstArgs} args - Arguments to find a Plugin
     * @example
     * // Get one Plugin
     * const plugin = await prisma.plugin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PluginFindFirstArgs>(args?: SelectSubset<T, PluginFindFirstArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Plugin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginFindFirstOrThrowArgs} args - Arguments to find a Plugin
     * @example
     * // Get one Plugin
     * const plugin = await prisma.plugin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PluginFindFirstOrThrowArgs>(args?: SelectSubset<T, PluginFindFirstOrThrowArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Plugins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plugins
     * const plugins = await prisma.plugin.findMany()
     * 
     * // Get first 10 Plugins
     * const plugins = await prisma.plugin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pluginWithIdOnly = await prisma.plugin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PluginFindManyArgs>(args?: SelectSubset<T, PluginFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Plugin.
     * @param {PluginCreateArgs} args - Arguments to create a Plugin.
     * @example
     * // Create one Plugin
     * const Plugin = await prisma.plugin.create({
     *   data: {
     *     // ... data to create a Plugin
     *   }
     * })
     * 
     */
    create<T extends PluginCreateArgs>(args: SelectSubset<T, PluginCreateArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Plugins.
     * @param {PluginCreateManyArgs} args - Arguments to create many Plugins.
     * @example
     * // Create many Plugins
     * const plugin = await prisma.plugin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PluginCreateManyArgs>(args?: SelectSubset<T, PluginCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plugins and returns the data saved in the database.
     * @param {PluginCreateManyAndReturnArgs} args - Arguments to create many Plugins.
     * @example
     * // Create many Plugins
     * const plugin = await prisma.plugin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plugins and only return the `id`
     * const pluginWithIdOnly = await prisma.plugin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PluginCreateManyAndReturnArgs>(args?: SelectSubset<T, PluginCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Plugin.
     * @param {PluginDeleteArgs} args - Arguments to delete one Plugin.
     * @example
     * // Delete one Plugin
     * const Plugin = await prisma.plugin.delete({
     *   where: {
     *     // ... filter to delete one Plugin
     *   }
     * })
     * 
     */
    delete<T extends PluginDeleteArgs>(args: SelectSubset<T, PluginDeleteArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Plugin.
     * @param {PluginUpdateArgs} args - Arguments to update one Plugin.
     * @example
     * // Update one Plugin
     * const plugin = await prisma.plugin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PluginUpdateArgs>(args: SelectSubset<T, PluginUpdateArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Plugins.
     * @param {PluginDeleteManyArgs} args - Arguments to filter Plugins to delete.
     * @example
     * // Delete a few Plugins
     * const { count } = await prisma.plugin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PluginDeleteManyArgs>(args?: SelectSubset<T, PluginDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plugins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plugins
     * const plugin = await prisma.plugin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PluginUpdateManyArgs>(args: SelectSubset<T, PluginUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Plugin.
     * @param {PluginUpsertArgs} args - Arguments to update or create a Plugin.
     * @example
     * // Update or create a Plugin
     * const plugin = await prisma.plugin.upsert({
     *   create: {
     *     // ... data to create a Plugin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plugin we want to update
     *   }
     * })
     */
    upsert<T extends PluginUpsertArgs>(args: SelectSubset<T, PluginUpsertArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Plugins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginCountArgs} args - Arguments to filter Plugins to count.
     * @example
     * // Count the number of Plugins
     * const count = await prisma.plugin.count({
     *   where: {
     *     // ... the filter for the Plugins we want to count
     *   }
     * })
    **/
    count<T extends PluginCountArgs>(
      args?: Subset<T, PluginCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PluginCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plugin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PluginAggregateArgs>(args: Subset<T, PluginAggregateArgs>): Prisma.PrismaPromise<GetPluginAggregateType<T>>

    /**
     * Group by Plugin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PluginGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PluginGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PluginGroupByArgs['orderBy'] }
        : { orderBy?: PluginGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PluginGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPluginGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plugin model
   */
  readonly fields: PluginFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plugin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PluginClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userPlugins<T extends Plugin$userPluginsArgs<ExtArgs> = {}>(args?: Subset<T, Plugin$userPluginsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Plugin model
   */ 
  interface PluginFieldRefs {
    readonly id: FieldRef<"Plugin", 'String'>
    readonly name: FieldRef<"Plugin", 'String'>
    readonly description: FieldRef<"Plugin", 'String'>
    readonly version: FieldRef<"Plugin", 'String'>
    readonly createdAt: FieldRef<"Plugin", 'DateTime'>
    readonly updatedAt: FieldRef<"Plugin", 'DateTime'>
    readonly deletedAt: FieldRef<"Plugin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Plugin findUnique
   */
  export type PluginFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * Filter, which Plugin to fetch.
     */
    where: PluginWhereUniqueInput
  }

  /**
   * Plugin findUniqueOrThrow
   */
  export type PluginFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * Filter, which Plugin to fetch.
     */
    where: PluginWhereUniqueInput
  }

  /**
   * Plugin findFirst
   */
  export type PluginFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * Filter, which Plugin to fetch.
     */
    where?: PluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plugins to fetch.
     */
    orderBy?: PluginOrderByWithRelationInput | PluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plugins.
     */
    cursor?: PluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plugins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plugins.
     */
    distinct?: PluginScalarFieldEnum | PluginScalarFieldEnum[]
  }

  /**
   * Plugin findFirstOrThrow
   */
  export type PluginFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * Filter, which Plugin to fetch.
     */
    where?: PluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plugins to fetch.
     */
    orderBy?: PluginOrderByWithRelationInput | PluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plugins.
     */
    cursor?: PluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plugins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plugins.
     */
    distinct?: PluginScalarFieldEnum | PluginScalarFieldEnum[]
  }

  /**
   * Plugin findMany
   */
  export type PluginFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * Filter, which Plugins to fetch.
     */
    where?: PluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plugins to fetch.
     */
    orderBy?: PluginOrderByWithRelationInput | PluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plugins.
     */
    cursor?: PluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plugins.
     */
    skip?: number
    distinct?: PluginScalarFieldEnum | PluginScalarFieldEnum[]
  }

  /**
   * Plugin create
   */
  export type PluginCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * The data needed to create a Plugin.
     */
    data: XOR<PluginCreateInput, PluginUncheckedCreateInput>
  }

  /**
   * Plugin createMany
   */
  export type PluginCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plugins.
     */
    data: PluginCreateManyInput | PluginCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plugin createManyAndReturn
   */
  export type PluginCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Plugins.
     */
    data: PluginCreateManyInput | PluginCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plugin update
   */
  export type PluginUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * The data needed to update a Plugin.
     */
    data: XOR<PluginUpdateInput, PluginUncheckedUpdateInput>
    /**
     * Choose, which Plugin to update.
     */
    where: PluginWhereUniqueInput
  }

  /**
   * Plugin updateMany
   */
  export type PluginUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plugins.
     */
    data: XOR<PluginUpdateManyMutationInput, PluginUncheckedUpdateManyInput>
    /**
     * Filter which Plugins to update
     */
    where?: PluginWhereInput
  }

  /**
   * Plugin upsert
   */
  export type PluginUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * The filter to search for the Plugin to update in case it exists.
     */
    where: PluginWhereUniqueInput
    /**
     * In case the Plugin found by the `where` argument doesn't exist, create a new Plugin with this data.
     */
    create: XOR<PluginCreateInput, PluginUncheckedCreateInput>
    /**
     * In case the Plugin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PluginUpdateInput, PluginUncheckedUpdateInput>
  }

  /**
   * Plugin delete
   */
  export type PluginDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
    /**
     * Filter which Plugin to delete.
     */
    where: PluginWhereUniqueInput
  }

  /**
   * Plugin deleteMany
   */
  export type PluginDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plugins to delete
     */
    where?: PluginWhereInput
  }

  /**
   * Plugin.userPlugins
   */
  export type Plugin$userPluginsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    where?: UserPluginWhereInput
    orderBy?: UserPluginOrderByWithRelationInput | UserPluginOrderByWithRelationInput[]
    cursor?: UserPluginWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPluginScalarFieldEnum | UserPluginScalarFieldEnum[]
  }

  /**
   * Plugin without action
   */
  export type PluginDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plugin
     */
    select?: PluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PluginInclude<ExtArgs> | null
  }


  /**
   * Model Device
   */

  export type AggregateDevice = {
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  export type DeviceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    type: string | null
    info: string | null
    lastActiveAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeviceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    type: string | null
    info: string | null
    lastActiveAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeviceCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    type: number
    info: number
    lastActiveAt: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeviceMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    type?: true
    info?: true
    lastActiveAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeviceMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    type?: true
    info?: true
    lastActiveAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeviceCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    type?: true
    info?: true
    lastActiveAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Device to aggregate.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Devices
    **/
    _count?: true | DeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceMaxAggregateInputType
  }

  export type GetDeviceAggregateType<T extends DeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevice[P]>
      : GetScalarType<T[P], AggregateDevice[P]>
  }




  export type DeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithAggregationInput | DeviceOrderByWithAggregationInput[]
    by: DeviceScalarFieldEnum[] | DeviceScalarFieldEnum
    having?: DeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceCountAggregateInputType | true
    _min?: DeviceMinAggregateInputType
    _max?: DeviceMaxAggregateInputType
  }

  export type DeviceGroupByOutputType = {
    id: string
    userId: string
    name: string
    type: string
    info: string | null
    lastActiveAt: Date
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  type GetDeviceGroupByPayload<T extends DeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceGroupByOutputType[P]>
        }
      >
    >


  export type DeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    type?: boolean
    info?: boolean
    lastActiveAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    type?: boolean
    info?: boolean
    lastActiveAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    type?: boolean
    info?: boolean
    lastActiveAt?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Device"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      type: string
      info: string | null
      lastActiveAt: Date
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["device"]>
    composites: {}
  }

  type DeviceGetPayload<S extends boolean | null | undefined | DeviceDefaultArgs> = $Result.GetResult<Prisma.$DevicePayload, S>

  type DeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DeviceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeviceCountAggregateInputType | true
    }

  export interface DeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Device'], meta: { name: 'Device' } }
    /**
     * Find zero or one Device that matches the filter.
     * @param {DeviceFindUniqueArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeviceFindUniqueArgs>(args: SelectSubset<T, DeviceFindUniqueArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Device that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DeviceFindUniqueOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, DeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Device that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeviceFindFirstArgs>(args?: SelectSubset<T, DeviceFindFirstArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Device that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, DeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devices
     * const devices = await prisma.device.findMany()
     * 
     * // Get first 10 Devices
     * const devices = await prisma.device.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceWithIdOnly = await prisma.device.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeviceFindManyArgs>(args?: SelectSubset<T, DeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Device.
     * @param {DeviceCreateArgs} args - Arguments to create a Device.
     * @example
     * // Create one Device
     * const Device = await prisma.device.create({
     *   data: {
     *     // ... data to create a Device
     *   }
     * })
     * 
     */
    create<T extends DeviceCreateArgs>(args: SelectSubset<T, DeviceCreateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Devices.
     * @param {DeviceCreateManyArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeviceCreateManyArgs>(args?: SelectSubset<T, DeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devices and returns the data saved in the database.
     * @param {DeviceCreateManyAndReturnArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, DeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Device.
     * @param {DeviceDeleteArgs} args - Arguments to delete one Device.
     * @example
     * // Delete one Device
     * const Device = await prisma.device.delete({
     *   where: {
     *     // ... filter to delete one Device
     *   }
     * })
     * 
     */
    delete<T extends DeviceDeleteArgs>(args: SelectSubset<T, DeviceDeleteArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Device.
     * @param {DeviceUpdateArgs} args - Arguments to update one Device.
     * @example
     * // Update one Device
     * const device = await prisma.device.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeviceUpdateArgs>(args: SelectSubset<T, DeviceUpdateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Devices.
     * @param {DeviceDeleteManyArgs} args - Arguments to filter Devices to delete.
     * @example
     * // Delete a few Devices
     * const { count } = await prisma.device.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeviceDeleteManyArgs>(args?: SelectSubset<T, DeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeviceUpdateManyArgs>(args: SelectSubset<T, DeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Device.
     * @param {DeviceUpsertArgs} args - Arguments to update or create a Device.
     * @example
     * // Update or create a Device
     * const device = await prisma.device.upsert({
     *   create: {
     *     // ... data to create a Device
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Device we want to update
     *   }
     * })
     */
    upsert<T extends DeviceUpsertArgs>(args: SelectSubset<T, DeviceUpsertArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceCountArgs} args - Arguments to filter Devices to count.
     * @example
     * // Count the number of Devices
     * const count = await prisma.device.count({
     *   where: {
     *     // ... the filter for the Devices we want to count
     *   }
     * })
    **/
    count<T extends DeviceCountArgs>(
      args?: Subset<T, DeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeviceAggregateArgs>(args: Subset<T, DeviceAggregateArgs>): Prisma.PrismaPromise<GetDeviceAggregateType<T>>

    /**
     * Group by Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeviceGroupByArgs['orderBy'] }
        : { orderBy?: DeviceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Device model
   */
  readonly fields: DeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Device.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Device model
   */ 
  interface DeviceFieldRefs {
    readonly id: FieldRef<"Device", 'String'>
    readonly userId: FieldRef<"Device", 'String'>
    readonly name: FieldRef<"Device", 'String'>
    readonly type: FieldRef<"Device", 'String'>
    readonly info: FieldRef<"Device", 'String'>
    readonly lastActiveAt: FieldRef<"Device", 'DateTime'>
    readonly isActive: FieldRef<"Device", 'Boolean'>
    readonly createdAt: FieldRef<"Device", 'DateTime'>
    readonly updatedAt: FieldRef<"Device", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Device findUnique
   */
  export type DeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findUniqueOrThrow
   */
  export type DeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findFirst
   */
  export type DeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findFirstOrThrow
   */
  export type DeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findMany
   */
  export type DeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Devices to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device create
   */
  export type DeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a Device.
     */
    data: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
  }

  /**
   * Device createMany
   */
  export type DeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Device createManyAndReturn
   */
  export type DeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device update
   */
  export type DeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a Device.
     */
    data: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
    /**
     * Choose, which Device to update.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device updateMany
   */
  export type DeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
  }

  /**
   * Device upsert
   */
  export type DeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the Device to update in case it exists.
     */
    where: DeviceWhereUniqueInput
    /**
     * In case the Device found by the `where` argument doesn't exist, create a new Device with this data.
     */
    create: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
    /**
     * In case the Device was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
  }

  /**
   * Device delete
   */
  export type DeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter which Device to delete.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device deleteMany
   */
  export type DeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Devices to delete
     */
    where?: DeviceWhereInput
  }

  /**
   * Device without action
   */
  export type DeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
  }


  /**
   * Model UserPlugin
   */

  export type AggregateUserPlugin = {
    _count: UserPluginCountAggregateOutputType | null
    _min: UserPluginMinAggregateOutputType | null
    _max: UserPluginMaxAggregateOutputType | null
  }

  export type UserPluginMinAggregateOutputType = {
    id: string | null
    userId: string | null
    pluginId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserPluginMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    pluginId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserPluginCountAggregateOutputType = {
    id: number
    userId: number
    pluginId: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserPluginMinAggregateInputType = {
    id?: true
    userId?: true
    pluginId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserPluginMaxAggregateInputType = {
    id?: true
    userId?: true
    pluginId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserPluginCountAggregateInputType = {
    id?: true
    userId?: true
    pluginId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserPluginAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPlugin to aggregate.
     */
    where?: UserPluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPlugins to fetch.
     */
    orderBy?: UserPluginOrderByWithRelationInput | UserPluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPlugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPlugins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPlugins
    **/
    _count?: true | UserPluginCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPluginMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPluginMaxAggregateInputType
  }

  export type GetUserPluginAggregateType<T extends UserPluginAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPlugin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPlugin[P]>
      : GetScalarType<T[P], AggregateUserPlugin[P]>
  }




  export type UserPluginGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPluginWhereInput
    orderBy?: UserPluginOrderByWithAggregationInput | UserPluginOrderByWithAggregationInput[]
    by: UserPluginScalarFieldEnum[] | UserPluginScalarFieldEnum
    having?: UserPluginScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPluginCountAggregateInputType | true
    _min?: UserPluginMinAggregateInputType
    _max?: UserPluginMaxAggregateInputType
  }

  export type UserPluginGroupByOutputType = {
    id: string
    userId: string
    pluginId: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserPluginCountAggregateOutputType | null
    _min: UserPluginMinAggregateOutputType | null
    _max: UserPluginMaxAggregateOutputType | null
  }

  type GetUserPluginGroupByPayload<T extends UserPluginGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPluginGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPluginGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPluginGroupByOutputType[P]>
            : GetScalarType<T[P], UserPluginGroupByOutputType[P]>
        }
      >
    >


  export type UserPluginSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pluginId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    plugin?: boolean | PluginDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPlugin"]>

  export type UserPluginSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    pluginId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    plugin?: boolean | PluginDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPlugin"]>

  export type UserPluginSelectScalar = {
    id?: boolean
    userId?: boolean
    pluginId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserPluginInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    plugin?: boolean | PluginDefaultArgs<ExtArgs>
  }
  export type UserPluginIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    plugin?: boolean | PluginDefaultArgs<ExtArgs>
  }

  export type $UserPluginPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPlugin"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      plugin: Prisma.$PluginPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      pluginId: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userPlugin"]>
    composites: {}
  }

  type UserPluginGetPayload<S extends boolean | null | undefined | UserPluginDefaultArgs> = $Result.GetResult<Prisma.$UserPluginPayload, S>

  type UserPluginCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserPluginFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserPluginCountAggregateInputType | true
    }

  export interface UserPluginDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPlugin'], meta: { name: 'UserPlugin' } }
    /**
     * Find zero or one UserPlugin that matches the filter.
     * @param {UserPluginFindUniqueArgs} args - Arguments to find a UserPlugin
     * @example
     * // Get one UserPlugin
     * const userPlugin = await prisma.userPlugin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPluginFindUniqueArgs>(args: SelectSubset<T, UserPluginFindUniqueArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserPlugin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserPluginFindUniqueOrThrowArgs} args - Arguments to find a UserPlugin
     * @example
     * // Get one UserPlugin
     * const userPlugin = await prisma.userPlugin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPluginFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPluginFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserPlugin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPluginFindFirstArgs} args - Arguments to find a UserPlugin
     * @example
     * // Get one UserPlugin
     * const userPlugin = await prisma.userPlugin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPluginFindFirstArgs>(args?: SelectSubset<T, UserPluginFindFirstArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserPlugin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPluginFindFirstOrThrowArgs} args - Arguments to find a UserPlugin
     * @example
     * // Get one UserPlugin
     * const userPlugin = await prisma.userPlugin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPluginFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPluginFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserPlugins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPluginFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPlugins
     * const userPlugins = await prisma.userPlugin.findMany()
     * 
     * // Get first 10 UserPlugins
     * const userPlugins = await prisma.userPlugin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userPluginWithIdOnly = await prisma.userPlugin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserPluginFindManyArgs>(args?: SelectSubset<T, UserPluginFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserPlugin.
     * @param {UserPluginCreateArgs} args - Arguments to create a UserPlugin.
     * @example
     * // Create one UserPlugin
     * const UserPlugin = await prisma.userPlugin.create({
     *   data: {
     *     // ... data to create a UserPlugin
     *   }
     * })
     * 
     */
    create<T extends UserPluginCreateArgs>(args: SelectSubset<T, UserPluginCreateArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserPlugins.
     * @param {UserPluginCreateManyArgs} args - Arguments to create many UserPlugins.
     * @example
     * // Create many UserPlugins
     * const userPlugin = await prisma.userPlugin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPluginCreateManyArgs>(args?: SelectSubset<T, UserPluginCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPlugins and returns the data saved in the database.
     * @param {UserPluginCreateManyAndReturnArgs} args - Arguments to create many UserPlugins.
     * @example
     * // Create many UserPlugins
     * const userPlugin = await prisma.userPlugin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPlugins and only return the `id`
     * const userPluginWithIdOnly = await prisma.userPlugin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserPluginCreateManyAndReturnArgs>(args?: SelectSubset<T, UserPluginCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserPlugin.
     * @param {UserPluginDeleteArgs} args - Arguments to delete one UserPlugin.
     * @example
     * // Delete one UserPlugin
     * const UserPlugin = await prisma.userPlugin.delete({
     *   where: {
     *     // ... filter to delete one UserPlugin
     *   }
     * })
     * 
     */
    delete<T extends UserPluginDeleteArgs>(args: SelectSubset<T, UserPluginDeleteArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserPlugin.
     * @param {UserPluginUpdateArgs} args - Arguments to update one UserPlugin.
     * @example
     * // Update one UserPlugin
     * const userPlugin = await prisma.userPlugin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPluginUpdateArgs>(args: SelectSubset<T, UserPluginUpdateArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserPlugins.
     * @param {UserPluginDeleteManyArgs} args - Arguments to filter UserPlugins to delete.
     * @example
     * // Delete a few UserPlugins
     * const { count } = await prisma.userPlugin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPluginDeleteManyArgs>(args?: SelectSubset<T, UserPluginDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPlugins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPluginUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPlugins
     * const userPlugin = await prisma.userPlugin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPluginUpdateManyArgs>(args: SelectSubset<T, UserPluginUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserPlugin.
     * @param {UserPluginUpsertArgs} args - Arguments to update or create a UserPlugin.
     * @example
     * // Update or create a UserPlugin
     * const userPlugin = await prisma.userPlugin.upsert({
     *   create: {
     *     // ... data to create a UserPlugin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPlugin we want to update
     *   }
     * })
     */
    upsert<T extends UserPluginUpsertArgs>(args: SelectSubset<T, UserPluginUpsertArgs<ExtArgs>>): Prisma__UserPluginClient<$Result.GetResult<Prisma.$UserPluginPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserPlugins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPluginCountArgs} args - Arguments to filter UserPlugins to count.
     * @example
     * // Count the number of UserPlugins
     * const count = await prisma.userPlugin.count({
     *   where: {
     *     // ... the filter for the UserPlugins we want to count
     *   }
     * })
    **/
    count<T extends UserPluginCountArgs>(
      args?: Subset<T, UserPluginCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPluginCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPlugin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPluginAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPluginAggregateArgs>(args: Subset<T, UserPluginAggregateArgs>): Prisma.PrismaPromise<GetUserPluginAggregateType<T>>

    /**
     * Group by UserPlugin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPluginGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPluginGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPluginGroupByArgs['orderBy'] }
        : { orderBy?: UserPluginGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPluginGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPluginGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPlugin model
   */
  readonly fields: UserPluginFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPlugin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPluginClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    plugin<T extends PluginDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PluginDefaultArgs<ExtArgs>>): Prisma__PluginClient<$Result.GetResult<Prisma.$PluginPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserPlugin model
   */ 
  interface UserPluginFieldRefs {
    readonly id: FieldRef<"UserPlugin", 'String'>
    readonly userId: FieldRef<"UserPlugin", 'String'>
    readonly pluginId: FieldRef<"UserPlugin", 'String'>
    readonly isActive: FieldRef<"UserPlugin", 'Boolean'>
    readonly createdAt: FieldRef<"UserPlugin", 'DateTime'>
    readonly updatedAt: FieldRef<"UserPlugin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserPlugin findUnique
   */
  export type UserPluginFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * Filter, which UserPlugin to fetch.
     */
    where: UserPluginWhereUniqueInput
  }

  /**
   * UserPlugin findUniqueOrThrow
   */
  export type UserPluginFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * Filter, which UserPlugin to fetch.
     */
    where: UserPluginWhereUniqueInput
  }

  /**
   * UserPlugin findFirst
   */
  export type UserPluginFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * Filter, which UserPlugin to fetch.
     */
    where?: UserPluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPlugins to fetch.
     */
    orderBy?: UserPluginOrderByWithRelationInput | UserPluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPlugins.
     */
    cursor?: UserPluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPlugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPlugins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPlugins.
     */
    distinct?: UserPluginScalarFieldEnum | UserPluginScalarFieldEnum[]
  }

  /**
   * UserPlugin findFirstOrThrow
   */
  export type UserPluginFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * Filter, which UserPlugin to fetch.
     */
    where?: UserPluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPlugins to fetch.
     */
    orderBy?: UserPluginOrderByWithRelationInput | UserPluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPlugins.
     */
    cursor?: UserPluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPlugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPlugins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPlugins.
     */
    distinct?: UserPluginScalarFieldEnum | UserPluginScalarFieldEnum[]
  }

  /**
   * UserPlugin findMany
   */
  export type UserPluginFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * Filter, which UserPlugins to fetch.
     */
    where?: UserPluginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPlugins to fetch.
     */
    orderBy?: UserPluginOrderByWithRelationInput | UserPluginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPlugins.
     */
    cursor?: UserPluginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPlugins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPlugins.
     */
    skip?: number
    distinct?: UserPluginScalarFieldEnum | UserPluginScalarFieldEnum[]
  }

  /**
   * UserPlugin create
   */
  export type UserPluginCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * The data needed to create a UserPlugin.
     */
    data: XOR<UserPluginCreateInput, UserPluginUncheckedCreateInput>
  }

  /**
   * UserPlugin createMany
   */
  export type UserPluginCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPlugins.
     */
    data: UserPluginCreateManyInput | UserPluginCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPlugin createManyAndReturn
   */
  export type UserPluginCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserPlugins.
     */
    data: UserPluginCreateManyInput | UserPluginCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPlugin update
   */
  export type UserPluginUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * The data needed to update a UserPlugin.
     */
    data: XOR<UserPluginUpdateInput, UserPluginUncheckedUpdateInput>
    /**
     * Choose, which UserPlugin to update.
     */
    where: UserPluginWhereUniqueInput
  }

  /**
   * UserPlugin updateMany
   */
  export type UserPluginUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPlugins.
     */
    data: XOR<UserPluginUpdateManyMutationInput, UserPluginUncheckedUpdateManyInput>
    /**
     * Filter which UserPlugins to update
     */
    where?: UserPluginWhereInput
  }

  /**
   * UserPlugin upsert
   */
  export type UserPluginUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * The filter to search for the UserPlugin to update in case it exists.
     */
    where: UserPluginWhereUniqueInput
    /**
     * In case the UserPlugin found by the `where` argument doesn't exist, create a new UserPlugin with this data.
     */
    create: XOR<UserPluginCreateInput, UserPluginUncheckedCreateInput>
    /**
     * In case the UserPlugin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPluginUpdateInput, UserPluginUncheckedUpdateInput>
  }

  /**
   * UserPlugin delete
   */
  export type UserPluginDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
    /**
     * Filter which UserPlugin to delete.
     */
    where: UserPluginWhereUniqueInput
  }

  /**
   * UserPlugin deleteMany
   */
  export type UserPluginDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPlugins to delete
     */
    where?: UserPluginWhereInput
  }

  /**
   * UserPlugin without action
   */
  export type UserPluginDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlugin
     */
    select?: UserPluginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPluginInclude<ExtArgs> | null
  }


  /**
   * Model UserPresence
   */

  export type AggregateUserPresence = {
    _count: UserPresenceCountAggregateOutputType | null
    _min: UserPresenceMinAggregateOutputType | null
    _max: UserPresenceMaxAggregateOutputType | null
  }

  export type UserPresenceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    projectId: string | null
    status: string | null
    expiresAt: Date | null
    lastSeen: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserPresenceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    projectId: string | null
    status: string | null
    expiresAt: Date | null
    lastSeen: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserPresenceCountAggregateOutputType = {
    id: number
    userId: number
    projectId: number
    status: number
    expiresAt: number
    lastSeen: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserPresenceMinAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    status?: true
    expiresAt?: true
    lastSeen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserPresenceMaxAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    status?: true
    expiresAt?: true
    lastSeen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserPresenceCountAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    status?: true
    expiresAt?: true
    lastSeen?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserPresenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPresence to aggregate.
     */
    where?: UserPresenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPresences to fetch.
     */
    orderBy?: UserPresenceOrderByWithRelationInput | UserPresenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPresenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPresences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPresences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPresences
    **/
    _count?: true | UserPresenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPresenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPresenceMaxAggregateInputType
  }

  export type GetUserPresenceAggregateType<T extends UserPresenceAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPresence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPresence[P]>
      : GetScalarType<T[P], AggregateUserPresence[P]>
  }




  export type UserPresenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPresenceWhereInput
    orderBy?: UserPresenceOrderByWithAggregationInput | UserPresenceOrderByWithAggregationInput[]
    by: UserPresenceScalarFieldEnum[] | UserPresenceScalarFieldEnum
    having?: UserPresenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPresenceCountAggregateInputType | true
    _min?: UserPresenceMinAggregateInputType
    _max?: UserPresenceMaxAggregateInputType
  }

  export type UserPresenceGroupByOutputType = {
    id: string
    userId: string
    projectId: string | null
    status: string
    expiresAt: Date
    lastSeen: Date
    createdAt: Date
    updatedAt: Date
    _count: UserPresenceCountAggregateOutputType | null
    _min: UserPresenceMinAggregateOutputType | null
    _max: UserPresenceMaxAggregateOutputType | null
  }

  type GetUserPresenceGroupByPayload<T extends UserPresenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPresenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPresenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPresenceGroupByOutputType[P]>
            : GetScalarType<T[P], UserPresenceGroupByOutputType[P]>
        }
      >
    >


  export type UserPresenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    status?: boolean
    expiresAt?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPresence"]>

  export type UserPresenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    status?: boolean
    expiresAt?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPresence"]>

  export type UserPresenceSelectScalar = {
    id?: boolean
    userId?: boolean
    projectId?: boolean
    status?: boolean
    expiresAt?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserPresenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserPresenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserPresencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPresence"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      projectId: string | null
      status: string
      expiresAt: Date
      lastSeen: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userPresence"]>
    composites: {}
  }

  type UserPresenceGetPayload<S extends boolean | null | undefined | UserPresenceDefaultArgs> = $Result.GetResult<Prisma.$UserPresencePayload, S>

  type UserPresenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserPresenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserPresenceCountAggregateInputType | true
    }

  export interface UserPresenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPresence'], meta: { name: 'UserPresence' } }
    /**
     * Find zero or one UserPresence that matches the filter.
     * @param {UserPresenceFindUniqueArgs} args - Arguments to find a UserPresence
     * @example
     * // Get one UserPresence
     * const userPresence = await prisma.userPresence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPresenceFindUniqueArgs>(args: SelectSubset<T, UserPresenceFindUniqueArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserPresence that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserPresenceFindUniqueOrThrowArgs} args - Arguments to find a UserPresence
     * @example
     * // Get one UserPresence
     * const userPresence = await prisma.userPresence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPresenceFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPresenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserPresence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPresenceFindFirstArgs} args - Arguments to find a UserPresence
     * @example
     * // Get one UserPresence
     * const userPresence = await prisma.userPresence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPresenceFindFirstArgs>(args?: SelectSubset<T, UserPresenceFindFirstArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserPresence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPresenceFindFirstOrThrowArgs} args - Arguments to find a UserPresence
     * @example
     * // Get one UserPresence
     * const userPresence = await prisma.userPresence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPresenceFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPresenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserPresences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPresenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPresences
     * const userPresences = await prisma.userPresence.findMany()
     * 
     * // Get first 10 UserPresences
     * const userPresences = await prisma.userPresence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userPresenceWithIdOnly = await prisma.userPresence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserPresenceFindManyArgs>(args?: SelectSubset<T, UserPresenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserPresence.
     * @param {UserPresenceCreateArgs} args - Arguments to create a UserPresence.
     * @example
     * // Create one UserPresence
     * const UserPresence = await prisma.userPresence.create({
     *   data: {
     *     // ... data to create a UserPresence
     *   }
     * })
     * 
     */
    create<T extends UserPresenceCreateArgs>(args: SelectSubset<T, UserPresenceCreateArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserPresences.
     * @param {UserPresenceCreateManyArgs} args - Arguments to create many UserPresences.
     * @example
     * // Create many UserPresences
     * const userPresence = await prisma.userPresence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPresenceCreateManyArgs>(args?: SelectSubset<T, UserPresenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPresences and returns the data saved in the database.
     * @param {UserPresenceCreateManyAndReturnArgs} args - Arguments to create many UserPresences.
     * @example
     * // Create many UserPresences
     * const userPresence = await prisma.userPresence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPresences and only return the `id`
     * const userPresenceWithIdOnly = await prisma.userPresence.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserPresenceCreateManyAndReturnArgs>(args?: SelectSubset<T, UserPresenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserPresence.
     * @param {UserPresenceDeleteArgs} args - Arguments to delete one UserPresence.
     * @example
     * // Delete one UserPresence
     * const UserPresence = await prisma.userPresence.delete({
     *   where: {
     *     // ... filter to delete one UserPresence
     *   }
     * })
     * 
     */
    delete<T extends UserPresenceDeleteArgs>(args: SelectSubset<T, UserPresenceDeleteArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserPresence.
     * @param {UserPresenceUpdateArgs} args - Arguments to update one UserPresence.
     * @example
     * // Update one UserPresence
     * const userPresence = await prisma.userPresence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPresenceUpdateArgs>(args: SelectSubset<T, UserPresenceUpdateArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserPresences.
     * @param {UserPresenceDeleteManyArgs} args - Arguments to filter UserPresences to delete.
     * @example
     * // Delete a few UserPresences
     * const { count } = await prisma.userPresence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPresenceDeleteManyArgs>(args?: SelectSubset<T, UserPresenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPresences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPresenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPresences
     * const userPresence = await prisma.userPresence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPresenceUpdateManyArgs>(args: SelectSubset<T, UserPresenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserPresence.
     * @param {UserPresenceUpsertArgs} args - Arguments to update or create a UserPresence.
     * @example
     * // Update or create a UserPresence
     * const userPresence = await prisma.userPresence.upsert({
     *   create: {
     *     // ... data to create a UserPresence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPresence we want to update
     *   }
     * })
     */
    upsert<T extends UserPresenceUpsertArgs>(args: SelectSubset<T, UserPresenceUpsertArgs<ExtArgs>>): Prisma__UserPresenceClient<$Result.GetResult<Prisma.$UserPresencePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserPresences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPresenceCountArgs} args - Arguments to filter UserPresences to count.
     * @example
     * // Count the number of UserPresences
     * const count = await prisma.userPresence.count({
     *   where: {
     *     // ... the filter for the UserPresences we want to count
     *   }
     * })
    **/
    count<T extends UserPresenceCountArgs>(
      args?: Subset<T, UserPresenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPresenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPresence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPresenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPresenceAggregateArgs>(args: Subset<T, UserPresenceAggregateArgs>): Prisma.PrismaPromise<GetUserPresenceAggregateType<T>>

    /**
     * Group by UserPresence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPresenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPresenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPresenceGroupByArgs['orderBy'] }
        : { orderBy?: UserPresenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPresenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPresenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPresence model
   */
  readonly fields: UserPresenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPresence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPresenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserPresence model
   */ 
  interface UserPresenceFieldRefs {
    readonly id: FieldRef<"UserPresence", 'String'>
    readonly userId: FieldRef<"UserPresence", 'String'>
    readonly projectId: FieldRef<"UserPresence", 'String'>
    readonly status: FieldRef<"UserPresence", 'String'>
    readonly expiresAt: FieldRef<"UserPresence", 'DateTime'>
    readonly lastSeen: FieldRef<"UserPresence", 'DateTime'>
    readonly createdAt: FieldRef<"UserPresence", 'DateTime'>
    readonly updatedAt: FieldRef<"UserPresence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserPresence findUnique
   */
  export type UserPresenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPresence to fetch.
     */
    where: UserPresenceWhereUniqueInput
  }

  /**
   * UserPresence findUniqueOrThrow
   */
  export type UserPresenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPresence to fetch.
     */
    where: UserPresenceWhereUniqueInput
  }

  /**
   * UserPresence findFirst
   */
  export type UserPresenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPresence to fetch.
     */
    where?: UserPresenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPresences to fetch.
     */
    orderBy?: UserPresenceOrderByWithRelationInput | UserPresenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPresences.
     */
    cursor?: UserPresenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPresences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPresences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPresences.
     */
    distinct?: UserPresenceScalarFieldEnum | UserPresenceScalarFieldEnum[]
  }

  /**
   * UserPresence findFirstOrThrow
   */
  export type UserPresenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPresence to fetch.
     */
    where?: UserPresenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPresences to fetch.
     */
    orderBy?: UserPresenceOrderByWithRelationInput | UserPresenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPresences.
     */
    cursor?: UserPresenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPresences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPresences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPresences.
     */
    distinct?: UserPresenceScalarFieldEnum | UserPresenceScalarFieldEnum[]
  }

  /**
   * UserPresence findMany
   */
  export type UserPresenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * Filter, which UserPresences to fetch.
     */
    where?: UserPresenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPresences to fetch.
     */
    orderBy?: UserPresenceOrderByWithRelationInput | UserPresenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPresences.
     */
    cursor?: UserPresenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPresences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPresences.
     */
    skip?: number
    distinct?: UserPresenceScalarFieldEnum | UserPresenceScalarFieldEnum[]
  }

  /**
   * UserPresence create
   */
  export type UserPresenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * The data needed to create a UserPresence.
     */
    data: XOR<UserPresenceCreateInput, UserPresenceUncheckedCreateInput>
  }

  /**
   * UserPresence createMany
   */
  export type UserPresenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPresences.
     */
    data: UserPresenceCreateManyInput | UserPresenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPresence createManyAndReturn
   */
  export type UserPresenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserPresences.
     */
    data: UserPresenceCreateManyInput | UserPresenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPresence update
   */
  export type UserPresenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * The data needed to update a UserPresence.
     */
    data: XOR<UserPresenceUpdateInput, UserPresenceUncheckedUpdateInput>
    /**
     * Choose, which UserPresence to update.
     */
    where: UserPresenceWhereUniqueInput
  }

  /**
   * UserPresence updateMany
   */
  export type UserPresenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPresences.
     */
    data: XOR<UserPresenceUpdateManyMutationInput, UserPresenceUncheckedUpdateManyInput>
    /**
     * Filter which UserPresences to update
     */
    where?: UserPresenceWhereInput
  }

  /**
   * UserPresence upsert
   */
  export type UserPresenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * The filter to search for the UserPresence to update in case it exists.
     */
    where: UserPresenceWhereUniqueInput
    /**
     * In case the UserPresence found by the `where` argument doesn't exist, create a new UserPresence with this data.
     */
    create: XOR<UserPresenceCreateInput, UserPresenceUncheckedCreateInput>
    /**
     * In case the UserPresence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPresenceUpdateInput, UserPresenceUncheckedUpdateInput>
  }

  /**
   * UserPresence delete
   */
  export type UserPresenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
    /**
     * Filter which UserPresence to delete.
     */
    where: UserPresenceWhereUniqueInput
  }

  /**
   * UserPresence deleteMany
   */
  export type UserPresenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPresences to delete
     */
    where?: UserPresenceWhereInput
  }

  /**
   * UserPresence without action
   */
  export type UserPresenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPresence
     */
    select?: UserPresenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPresenceInclude<ExtArgs> | null
  }


  /**
   * Model ActivityLog
   */

  export type AggregateActivityLog = {
    _count: ActivityLogCountAggregateOutputType | null
    _min: ActivityLogMinAggregateOutputType | null
    _max: ActivityLogMaxAggregateOutputType | null
  }

  export type ActivityLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    projectId: string | null
    metadata: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type ActivityLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    projectId: string | null
    metadata: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type ActivityLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    entityType: number
    entityId: number
    projectId: number
    metadata: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type ActivityLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    projectId?: true
    metadata?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type ActivityLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    projectId?: true
    metadata?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type ActivityLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    projectId?: true
    metadata?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type ActivityLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivityLog to aggregate.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActivityLogs
    **/
    _count?: true | ActivityLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActivityLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActivityLogMaxAggregateInputType
  }

  export type GetActivityLogAggregateType<T extends ActivityLogAggregateArgs> = {
        [P in keyof T & keyof AggregateActivityLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActivityLog[P]>
      : GetScalarType<T[P], AggregateActivityLog[P]>
  }




  export type ActivityLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivityLogWhereInput
    orderBy?: ActivityLogOrderByWithAggregationInput | ActivityLogOrderByWithAggregationInput[]
    by: ActivityLogScalarFieldEnum[] | ActivityLogScalarFieldEnum
    having?: ActivityLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActivityLogCountAggregateInputType | true
    _min?: ActivityLogMinAggregateInputType
    _max?: ActivityLogMaxAggregateInputType
  }

  export type ActivityLogGroupByOutputType = {
    id: string
    userId: string
    action: string
    entityType: string
    entityId: string
    projectId: string | null
    metadata: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: ActivityLogCountAggregateOutputType | null
    _min: ActivityLogMinAggregateOutputType | null
    _max: ActivityLogMaxAggregateOutputType | null
  }

  type GetActivityLogGroupByPayload<T extends ActivityLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActivityLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActivityLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActivityLogGroupByOutputType[P]>
            : GetScalarType<T[P], ActivityLogGroupByOutputType[P]>
        }
      >
    >


  export type ActivityLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    projectId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ActivityLog$projectArgs<ExtArgs>
  }, ExtArgs["result"]["activityLog"]>

  export type ActivityLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    projectId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ActivityLog$projectArgs<ExtArgs>
  }, ExtArgs["result"]["activityLog"]>

  export type ActivityLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    projectId?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type ActivityLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ActivityLog$projectArgs<ExtArgs>
  }
  export type ActivityLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ActivityLog$projectArgs<ExtArgs>
  }

  export type $ActivityLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActivityLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      action: string
      entityType: string
      entityId: string
      projectId: string | null
      metadata: string | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["activityLog"]>
    composites: {}
  }

  type ActivityLogGetPayload<S extends boolean | null | undefined | ActivityLogDefaultArgs> = $Result.GetResult<Prisma.$ActivityLogPayload, S>

  type ActivityLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActivityLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActivityLogCountAggregateInputType | true
    }

  export interface ActivityLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActivityLog'], meta: { name: 'ActivityLog' } }
    /**
     * Find zero or one ActivityLog that matches the filter.
     * @param {ActivityLogFindUniqueArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActivityLogFindUniqueArgs>(args: SelectSubset<T, ActivityLogFindUniqueArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActivityLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActivityLogFindUniqueOrThrowArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActivityLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ActivityLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActivityLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogFindFirstArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActivityLogFindFirstArgs>(args?: SelectSubset<T, ActivityLogFindFirstArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActivityLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogFindFirstOrThrowArgs} args - Arguments to find a ActivityLog
     * @example
     * // Get one ActivityLog
     * const activityLog = await prisma.activityLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActivityLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ActivityLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActivityLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActivityLogs
     * const activityLogs = await prisma.activityLog.findMany()
     * 
     * // Get first 10 ActivityLogs
     * const activityLogs = await prisma.activityLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activityLogWithIdOnly = await prisma.activityLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActivityLogFindManyArgs>(args?: SelectSubset<T, ActivityLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActivityLog.
     * @param {ActivityLogCreateArgs} args - Arguments to create a ActivityLog.
     * @example
     * // Create one ActivityLog
     * const ActivityLog = await prisma.activityLog.create({
     *   data: {
     *     // ... data to create a ActivityLog
     *   }
     * })
     * 
     */
    create<T extends ActivityLogCreateArgs>(args: SelectSubset<T, ActivityLogCreateArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActivityLogs.
     * @param {ActivityLogCreateManyArgs} args - Arguments to create many ActivityLogs.
     * @example
     * // Create many ActivityLogs
     * const activityLog = await prisma.activityLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActivityLogCreateManyArgs>(args?: SelectSubset<T, ActivityLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActivityLogs and returns the data saved in the database.
     * @param {ActivityLogCreateManyAndReturnArgs} args - Arguments to create many ActivityLogs.
     * @example
     * // Create many ActivityLogs
     * const activityLog = await prisma.activityLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActivityLogs and only return the `id`
     * const activityLogWithIdOnly = await prisma.activityLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActivityLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ActivityLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActivityLog.
     * @param {ActivityLogDeleteArgs} args - Arguments to delete one ActivityLog.
     * @example
     * // Delete one ActivityLog
     * const ActivityLog = await prisma.activityLog.delete({
     *   where: {
     *     // ... filter to delete one ActivityLog
     *   }
     * })
     * 
     */
    delete<T extends ActivityLogDeleteArgs>(args: SelectSubset<T, ActivityLogDeleteArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActivityLog.
     * @param {ActivityLogUpdateArgs} args - Arguments to update one ActivityLog.
     * @example
     * // Update one ActivityLog
     * const activityLog = await prisma.activityLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActivityLogUpdateArgs>(args: SelectSubset<T, ActivityLogUpdateArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActivityLogs.
     * @param {ActivityLogDeleteManyArgs} args - Arguments to filter ActivityLogs to delete.
     * @example
     * // Delete a few ActivityLogs
     * const { count } = await prisma.activityLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActivityLogDeleteManyArgs>(args?: SelectSubset<T, ActivityLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActivityLogs
     * const activityLog = await prisma.activityLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActivityLogUpdateManyArgs>(args: SelectSubset<T, ActivityLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActivityLog.
     * @param {ActivityLogUpsertArgs} args - Arguments to update or create a ActivityLog.
     * @example
     * // Update or create a ActivityLog
     * const activityLog = await prisma.activityLog.upsert({
     *   create: {
     *     // ... data to create a ActivityLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActivityLog we want to update
     *   }
     * })
     */
    upsert<T extends ActivityLogUpsertArgs>(args: SelectSubset<T, ActivityLogUpsertArgs<ExtArgs>>): Prisma__ActivityLogClient<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogCountArgs} args - Arguments to filter ActivityLogs to count.
     * @example
     * // Count the number of ActivityLogs
     * const count = await prisma.activityLog.count({
     *   where: {
     *     // ... the filter for the ActivityLogs we want to count
     *   }
     * })
    **/
    count<T extends ActivityLogCountArgs>(
      args?: Subset<T, ActivityLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActivityLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActivityLogAggregateArgs>(args: Subset<T, ActivityLogAggregateArgs>): Prisma.PrismaPromise<GetActivityLogAggregateType<T>>

    /**
     * Group by ActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivityLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActivityLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActivityLogGroupByArgs['orderBy'] }
        : { orderBy?: ActivityLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActivityLog model
   */
  readonly fields: ActivityLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActivityLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActivityLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    project<T extends ActivityLog$projectArgs<ExtArgs> = {}>(args?: Subset<T, ActivityLog$projectArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActivityLog model
   */ 
  interface ActivityLogFieldRefs {
    readonly id: FieldRef<"ActivityLog", 'String'>
    readonly userId: FieldRef<"ActivityLog", 'String'>
    readonly action: FieldRef<"ActivityLog", 'String'>
    readonly entityType: FieldRef<"ActivityLog", 'String'>
    readonly entityId: FieldRef<"ActivityLog", 'String'>
    readonly projectId: FieldRef<"ActivityLog", 'String'>
    readonly metadata: FieldRef<"ActivityLog", 'String'>
    readonly ipAddress: FieldRef<"ActivityLog", 'String'>
    readonly userAgent: FieldRef<"ActivityLog", 'String'>
    readonly createdAt: FieldRef<"ActivityLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActivityLog findUnique
   */
  export type ActivityLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog findUniqueOrThrow
   */
  export type ActivityLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog findFirst
   */
  export type ActivityLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivityLogs.
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivityLogs.
     */
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * ActivityLog findFirstOrThrow
   */
  export type ActivityLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLog to fetch.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivityLogs.
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivityLogs.
     */
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * ActivityLog findMany
   */
  export type ActivityLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ActivityLogs to fetch.
     */
    where?: ActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivityLogs to fetch.
     */
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActivityLogs.
     */
    cursor?: ActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivityLogs.
     */
    skip?: number
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * ActivityLog create
   */
  export type ActivityLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ActivityLog.
     */
    data: XOR<ActivityLogCreateInput, ActivityLogUncheckedCreateInput>
  }

  /**
   * ActivityLog createMany
   */
  export type ActivityLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActivityLogs.
     */
    data: ActivityLogCreateManyInput | ActivityLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActivityLog createManyAndReturn
   */
  export type ActivityLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActivityLogs.
     */
    data: ActivityLogCreateManyInput | ActivityLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActivityLog update
   */
  export type ActivityLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ActivityLog.
     */
    data: XOR<ActivityLogUpdateInput, ActivityLogUncheckedUpdateInput>
    /**
     * Choose, which ActivityLog to update.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog updateMany
   */
  export type ActivityLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActivityLogs.
     */
    data: XOR<ActivityLogUpdateManyMutationInput, ActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which ActivityLogs to update
     */
    where?: ActivityLogWhereInput
  }

  /**
   * ActivityLog upsert
   */
  export type ActivityLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ActivityLog to update in case it exists.
     */
    where: ActivityLogWhereUniqueInput
    /**
     * In case the ActivityLog found by the `where` argument doesn't exist, create a new ActivityLog with this data.
     */
    create: XOR<ActivityLogCreateInput, ActivityLogUncheckedCreateInput>
    /**
     * In case the ActivityLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActivityLogUpdateInput, ActivityLogUncheckedUpdateInput>
  }

  /**
   * ActivityLog delete
   */
  export type ActivityLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    /**
     * Filter which ActivityLog to delete.
     */
    where: ActivityLogWhereUniqueInput
  }

  /**
   * ActivityLog deleteMany
   */
  export type ActivityLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivityLogs to delete
     */
    where?: ActivityLogWhereInput
  }

  /**
   * ActivityLog.project
   */
  export type ActivityLog$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
  }

  /**
   * ActivityLog without action
   */
  export type ActivityLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
  }


  /**
   * Model CrashReport
   */

  export type AggregateCrashReport = {
    _count: CrashReportCountAggregateOutputType | null
    _min: CrashReportMinAggregateOutputType | null
    _max: CrashReportMaxAggregateOutputType | null
  }

  export type CrashReportMinAggregateOutputType = {
    id: string | null
    userId: string | null
    error: string | null
    stackTrace: string | null
    stack: string | null
    breadcrumbs: string | null
    context: string | null
    projectId: string | null
    metadata: string | null
    createdAt: Date | null
  }

  export type CrashReportMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    error: string | null
    stackTrace: string | null
    stack: string | null
    breadcrumbs: string | null
    context: string | null
    projectId: string | null
    metadata: string | null
    createdAt: Date | null
  }

  export type CrashReportCountAggregateOutputType = {
    id: number
    userId: number
    error: number
    stackTrace: number
    stack: number
    breadcrumbs: number
    context: number
    projectId: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type CrashReportMinAggregateInputType = {
    id?: true
    userId?: true
    error?: true
    stackTrace?: true
    stack?: true
    breadcrumbs?: true
    context?: true
    projectId?: true
    metadata?: true
    createdAt?: true
  }

  export type CrashReportMaxAggregateInputType = {
    id?: true
    userId?: true
    error?: true
    stackTrace?: true
    stack?: true
    breadcrumbs?: true
    context?: true
    projectId?: true
    metadata?: true
    createdAt?: true
  }

  export type CrashReportCountAggregateInputType = {
    id?: true
    userId?: true
    error?: true
    stackTrace?: true
    stack?: true
    breadcrumbs?: true
    context?: true
    projectId?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type CrashReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrashReport to aggregate.
     */
    where?: CrashReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashReports to fetch.
     */
    orderBy?: CrashReportOrderByWithRelationInput | CrashReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CrashReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CrashReports
    **/
    _count?: true | CrashReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CrashReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CrashReportMaxAggregateInputType
  }

  export type GetCrashReportAggregateType<T extends CrashReportAggregateArgs> = {
        [P in keyof T & keyof AggregateCrashReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCrashReport[P]>
      : GetScalarType<T[P], AggregateCrashReport[P]>
  }




  export type CrashReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrashReportWhereInput
    orderBy?: CrashReportOrderByWithAggregationInput | CrashReportOrderByWithAggregationInput[]
    by: CrashReportScalarFieldEnum[] | CrashReportScalarFieldEnum
    having?: CrashReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CrashReportCountAggregateInputType | true
    _min?: CrashReportMinAggregateInputType
    _max?: CrashReportMaxAggregateInputType
  }

  export type CrashReportGroupByOutputType = {
    id: string
    userId: string
    error: string
    stackTrace: string
    stack: string | null
    breadcrumbs: string | null
    context: string | null
    projectId: string | null
    metadata: string | null
    createdAt: Date
    _count: CrashReportCountAggregateOutputType | null
    _min: CrashReportMinAggregateOutputType | null
    _max: CrashReportMaxAggregateOutputType | null
  }

  type GetCrashReportGroupByPayload<T extends CrashReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CrashReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CrashReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CrashReportGroupByOutputType[P]>
            : GetScalarType<T[P], CrashReportGroupByOutputType[P]>
        }
      >
    >


  export type CrashReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    error?: boolean
    stackTrace?: boolean
    stack?: boolean
    breadcrumbs?: boolean
    context?: boolean
    projectId?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crashReport"]>

  export type CrashReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    error?: boolean
    stackTrace?: boolean
    stack?: boolean
    breadcrumbs?: boolean
    context?: boolean
    projectId?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crashReport"]>

  export type CrashReportSelectScalar = {
    id?: boolean
    userId?: boolean
    error?: boolean
    stackTrace?: boolean
    stack?: boolean
    breadcrumbs?: boolean
    context?: boolean
    projectId?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type CrashReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CrashReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CrashReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CrashReport"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      error: string
      stackTrace: string
      stack: string | null
      breadcrumbs: string | null
      context: string | null
      projectId: string | null
      metadata: string | null
      createdAt: Date
    }, ExtArgs["result"]["crashReport"]>
    composites: {}
  }

  type CrashReportGetPayload<S extends boolean | null | undefined | CrashReportDefaultArgs> = $Result.GetResult<Prisma.$CrashReportPayload, S>

  type CrashReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CrashReportFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CrashReportCountAggregateInputType | true
    }

  export interface CrashReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CrashReport'], meta: { name: 'CrashReport' } }
    /**
     * Find zero or one CrashReport that matches the filter.
     * @param {CrashReportFindUniqueArgs} args - Arguments to find a CrashReport
     * @example
     * // Get one CrashReport
     * const crashReport = await prisma.crashReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CrashReportFindUniqueArgs>(args: SelectSubset<T, CrashReportFindUniqueArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CrashReport that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CrashReportFindUniqueOrThrowArgs} args - Arguments to find a CrashReport
     * @example
     * // Get one CrashReport
     * const crashReport = await prisma.crashReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CrashReportFindUniqueOrThrowArgs>(args: SelectSubset<T, CrashReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CrashReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashReportFindFirstArgs} args - Arguments to find a CrashReport
     * @example
     * // Get one CrashReport
     * const crashReport = await prisma.crashReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CrashReportFindFirstArgs>(args?: SelectSubset<T, CrashReportFindFirstArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CrashReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashReportFindFirstOrThrowArgs} args - Arguments to find a CrashReport
     * @example
     * // Get one CrashReport
     * const crashReport = await prisma.crashReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CrashReportFindFirstOrThrowArgs>(args?: SelectSubset<T, CrashReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CrashReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CrashReports
     * const crashReports = await prisma.crashReport.findMany()
     * 
     * // Get first 10 CrashReports
     * const crashReports = await prisma.crashReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const crashReportWithIdOnly = await prisma.crashReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CrashReportFindManyArgs>(args?: SelectSubset<T, CrashReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CrashReport.
     * @param {CrashReportCreateArgs} args - Arguments to create a CrashReport.
     * @example
     * // Create one CrashReport
     * const CrashReport = await prisma.crashReport.create({
     *   data: {
     *     // ... data to create a CrashReport
     *   }
     * })
     * 
     */
    create<T extends CrashReportCreateArgs>(args: SelectSubset<T, CrashReportCreateArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CrashReports.
     * @param {CrashReportCreateManyArgs} args - Arguments to create many CrashReports.
     * @example
     * // Create many CrashReports
     * const crashReport = await prisma.crashReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CrashReportCreateManyArgs>(args?: SelectSubset<T, CrashReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CrashReports and returns the data saved in the database.
     * @param {CrashReportCreateManyAndReturnArgs} args - Arguments to create many CrashReports.
     * @example
     * // Create many CrashReports
     * const crashReport = await prisma.crashReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CrashReports and only return the `id`
     * const crashReportWithIdOnly = await prisma.crashReport.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CrashReportCreateManyAndReturnArgs>(args?: SelectSubset<T, CrashReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CrashReport.
     * @param {CrashReportDeleteArgs} args - Arguments to delete one CrashReport.
     * @example
     * // Delete one CrashReport
     * const CrashReport = await prisma.crashReport.delete({
     *   where: {
     *     // ... filter to delete one CrashReport
     *   }
     * })
     * 
     */
    delete<T extends CrashReportDeleteArgs>(args: SelectSubset<T, CrashReportDeleteArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CrashReport.
     * @param {CrashReportUpdateArgs} args - Arguments to update one CrashReport.
     * @example
     * // Update one CrashReport
     * const crashReport = await prisma.crashReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CrashReportUpdateArgs>(args: SelectSubset<T, CrashReportUpdateArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CrashReports.
     * @param {CrashReportDeleteManyArgs} args - Arguments to filter CrashReports to delete.
     * @example
     * // Delete a few CrashReports
     * const { count } = await prisma.crashReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CrashReportDeleteManyArgs>(args?: SelectSubset<T, CrashReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrashReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CrashReports
     * const crashReport = await prisma.crashReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CrashReportUpdateManyArgs>(args: SelectSubset<T, CrashReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CrashReport.
     * @param {CrashReportUpsertArgs} args - Arguments to update or create a CrashReport.
     * @example
     * // Update or create a CrashReport
     * const crashReport = await prisma.crashReport.upsert({
     *   create: {
     *     // ... data to create a CrashReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CrashReport we want to update
     *   }
     * })
     */
    upsert<T extends CrashReportUpsertArgs>(args: SelectSubset<T, CrashReportUpsertArgs<ExtArgs>>): Prisma__CrashReportClient<$Result.GetResult<Prisma.$CrashReportPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CrashReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashReportCountArgs} args - Arguments to filter CrashReports to count.
     * @example
     * // Count the number of CrashReports
     * const count = await prisma.crashReport.count({
     *   where: {
     *     // ... the filter for the CrashReports we want to count
     *   }
     * })
    **/
    count<T extends CrashReportCountArgs>(
      args?: Subset<T, CrashReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CrashReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CrashReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CrashReportAggregateArgs>(args: Subset<T, CrashReportAggregateArgs>): Prisma.PrismaPromise<GetCrashReportAggregateType<T>>

    /**
     * Group by CrashReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CrashReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CrashReportGroupByArgs['orderBy'] }
        : { orderBy?: CrashReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CrashReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrashReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CrashReport model
   */
  readonly fields: CrashReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CrashReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CrashReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CrashReport model
   */ 
  interface CrashReportFieldRefs {
    readonly id: FieldRef<"CrashReport", 'String'>
    readonly userId: FieldRef<"CrashReport", 'String'>
    readonly error: FieldRef<"CrashReport", 'String'>
    readonly stackTrace: FieldRef<"CrashReport", 'String'>
    readonly stack: FieldRef<"CrashReport", 'String'>
    readonly breadcrumbs: FieldRef<"CrashReport", 'String'>
    readonly context: FieldRef<"CrashReport", 'String'>
    readonly projectId: FieldRef<"CrashReport", 'String'>
    readonly metadata: FieldRef<"CrashReport", 'String'>
    readonly createdAt: FieldRef<"CrashReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CrashReport findUnique
   */
  export type CrashReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * Filter, which CrashReport to fetch.
     */
    where: CrashReportWhereUniqueInput
  }

  /**
   * CrashReport findUniqueOrThrow
   */
  export type CrashReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * Filter, which CrashReport to fetch.
     */
    where: CrashReportWhereUniqueInput
  }

  /**
   * CrashReport findFirst
   */
  export type CrashReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * Filter, which CrashReport to fetch.
     */
    where?: CrashReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashReports to fetch.
     */
    orderBy?: CrashReportOrderByWithRelationInput | CrashReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrashReports.
     */
    cursor?: CrashReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrashReports.
     */
    distinct?: CrashReportScalarFieldEnum | CrashReportScalarFieldEnum[]
  }

  /**
   * CrashReport findFirstOrThrow
   */
  export type CrashReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * Filter, which CrashReport to fetch.
     */
    where?: CrashReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashReports to fetch.
     */
    orderBy?: CrashReportOrderByWithRelationInput | CrashReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrashReports.
     */
    cursor?: CrashReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrashReports.
     */
    distinct?: CrashReportScalarFieldEnum | CrashReportScalarFieldEnum[]
  }

  /**
   * CrashReport findMany
   */
  export type CrashReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * Filter, which CrashReports to fetch.
     */
    where?: CrashReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashReports to fetch.
     */
    orderBy?: CrashReportOrderByWithRelationInput | CrashReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CrashReports.
     */
    cursor?: CrashReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashReports.
     */
    skip?: number
    distinct?: CrashReportScalarFieldEnum | CrashReportScalarFieldEnum[]
  }

  /**
   * CrashReport create
   */
  export type CrashReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * The data needed to create a CrashReport.
     */
    data: XOR<CrashReportCreateInput, CrashReportUncheckedCreateInput>
  }

  /**
   * CrashReport createMany
   */
  export type CrashReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CrashReports.
     */
    data: CrashReportCreateManyInput | CrashReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrashReport createManyAndReturn
   */
  export type CrashReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CrashReports.
     */
    data: CrashReportCreateManyInput | CrashReportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CrashReport update
   */
  export type CrashReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * The data needed to update a CrashReport.
     */
    data: XOR<CrashReportUpdateInput, CrashReportUncheckedUpdateInput>
    /**
     * Choose, which CrashReport to update.
     */
    where: CrashReportWhereUniqueInput
  }

  /**
   * CrashReport updateMany
   */
  export type CrashReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CrashReports.
     */
    data: XOR<CrashReportUpdateManyMutationInput, CrashReportUncheckedUpdateManyInput>
    /**
     * Filter which CrashReports to update
     */
    where?: CrashReportWhereInput
  }

  /**
   * CrashReport upsert
   */
  export type CrashReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * The filter to search for the CrashReport to update in case it exists.
     */
    where: CrashReportWhereUniqueInput
    /**
     * In case the CrashReport found by the `where` argument doesn't exist, create a new CrashReport with this data.
     */
    create: XOR<CrashReportCreateInput, CrashReportUncheckedCreateInput>
    /**
     * In case the CrashReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CrashReportUpdateInput, CrashReportUncheckedUpdateInput>
  }

  /**
   * CrashReport delete
   */
  export type CrashReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
    /**
     * Filter which CrashReport to delete.
     */
    where: CrashReportWhereUniqueInput
  }

  /**
   * CrashReport deleteMany
   */
  export type CrashReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrashReports to delete
     */
    where?: CrashReportWhereInput
  }

  /**
   * CrashReport without action
   */
  export type CrashReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashReport
     */
    select?: CrashReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashReportInclude<ExtArgs> | null
  }


  /**
   * Model WebRtcMetric
   */

  export type AggregateWebRtcMetric = {
    _count: WebRtcMetricCountAggregateOutputType | null
    _avg: WebRtcMetricAvgAggregateOutputType | null
    _sum: WebRtcMetricSumAggregateOutputType | null
    _min: WebRtcMetricMinAggregateOutputType | null
    _max: WebRtcMetricMaxAggregateOutputType | null
  }

  export type WebRtcMetricAvgAggregateOutputType = {
    value: number | null
    rttMs: number | null
    jitterMs: number | null
    packetLoss: number | null
    downlinkMbps: number | null
  }

  export type WebRtcMetricSumAggregateOutputType = {
    value: number | null
    rttMs: number | null
    jitterMs: number | null
    packetLoss: number | null
    downlinkMbps: number | null
  }

  export type WebRtcMetricMinAggregateOutputType = {
    id: string | null
    userId: string | null
    projectId: string | null
    metricType: string | null
    value: number | null
    peerConnectionId: string | null
    rttMs: number | null
    jitterMs: number | null
    packetLoss: number | null
    networkType: string | null
    effectiveType: string | null
    downlinkMbps: number | null
    iceCandidatePairId: string | null
    localCandidateId: string | null
    remoteCandidateId: string | null
    timestamp: Date | null
    metadata: string | null
    createdAt: Date | null
  }

  export type WebRtcMetricMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    projectId: string | null
    metricType: string | null
    value: number | null
    peerConnectionId: string | null
    rttMs: number | null
    jitterMs: number | null
    packetLoss: number | null
    networkType: string | null
    effectiveType: string | null
    downlinkMbps: number | null
    iceCandidatePairId: string | null
    localCandidateId: string | null
    remoteCandidateId: string | null
    timestamp: Date | null
    metadata: string | null
    createdAt: Date | null
  }

  export type WebRtcMetricCountAggregateOutputType = {
    id: number
    userId: number
    projectId: number
    metricType: number
    value: number
    peerConnectionId: number
    rttMs: number
    jitterMs: number
    packetLoss: number
    networkType: number
    effectiveType: number
    downlinkMbps: number
    iceCandidatePairId: number
    localCandidateId: number
    remoteCandidateId: number
    timestamp: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type WebRtcMetricAvgAggregateInputType = {
    value?: true
    rttMs?: true
    jitterMs?: true
    packetLoss?: true
    downlinkMbps?: true
  }

  export type WebRtcMetricSumAggregateInputType = {
    value?: true
    rttMs?: true
    jitterMs?: true
    packetLoss?: true
    downlinkMbps?: true
  }

  export type WebRtcMetricMinAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    metricType?: true
    value?: true
    peerConnectionId?: true
    rttMs?: true
    jitterMs?: true
    packetLoss?: true
    networkType?: true
    effectiveType?: true
    downlinkMbps?: true
    iceCandidatePairId?: true
    localCandidateId?: true
    remoteCandidateId?: true
    timestamp?: true
    metadata?: true
    createdAt?: true
  }

  export type WebRtcMetricMaxAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    metricType?: true
    value?: true
    peerConnectionId?: true
    rttMs?: true
    jitterMs?: true
    packetLoss?: true
    networkType?: true
    effectiveType?: true
    downlinkMbps?: true
    iceCandidatePairId?: true
    localCandidateId?: true
    remoteCandidateId?: true
    timestamp?: true
    metadata?: true
    createdAt?: true
  }

  export type WebRtcMetricCountAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    metricType?: true
    value?: true
    peerConnectionId?: true
    rttMs?: true
    jitterMs?: true
    packetLoss?: true
    networkType?: true
    effectiveType?: true
    downlinkMbps?: true
    iceCandidatePairId?: true
    localCandidateId?: true
    remoteCandidateId?: true
    timestamp?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type WebRtcMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebRtcMetric to aggregate.
     */
    where?: WebRtcMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebRtcMetrics to fetch.
     */
    orderBy?: WebRtcMetricOrderByWithRelationInput | WebRtcMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebRtcMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebRtcMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebRtcMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WebRtcMetrics
    **/
    _count?: true | WebRtcMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WebRtcMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WebRtcMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebRtcMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebRtcMetricMaxAggregateInputType
  }

  export type GetWebRtcMetricAggregateType<T extends WebRtcMetricAggregateArgs> = {
        [P in keyof T & keyof AggregateWebRtcMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebRtcMetric[P]>
      : GetScalarType<T[P], AggregateWebRtcMetric[P]>
  }




  export type WebRtcMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebRtcMetricWhereInput
    orderBy?: WebRtcMetricOrderByWithAggregationInput | WebRtcMetricOrderByWithAggregationInput[]
    by: WebRtcMetricScalarFieldEnum[] | WebRtcMetricScalarFieldEnum
    having?: WebRtcMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebRtcMetricCountAggregateInputType | true
    _avg?: WebRtcMetricAvgAggregateInputType
    _sum?: WebRtcMetricSumAggregateInputType
    _min?: WebRtcMetricMinAggregateInputType
    _max?: WebRtcMetricMaxAggregateInputType
  }

  export type WebRtcMetricGroupByOutputType = {
    id: string
    userId: string
    projectId: string | null
    metricType: string
    value: number
    peerConnectionId: string | null
    rttMs: number | null
    jitterMs: number | null
    packetLoss: number | null
    networkType: string | null
    effectiveType: string | null
    downlinkMbps: number | null
    iceCandidatePairId: string | null
    localCandidateId: string | null
    remoteCandidateId: string | null
    timestamp: Date
    metadata: string | null
    createdAt: Date
    _count: WebRtcMetricCountAggregateOutputType | null
    _avg: WebRtcMetricAvgAggregateOutputType | null
    _sum: WebRtcMetricSumAggregateOutputType | null
    _min: WebRtcMetricMinAggregateOutputType | null
    _max: WebRtcMetricMaxAggregateOutputType | null
  }

  type GetWebRtcMetricGroupByPayload<T extends WebRtcMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebRtcMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebRtcMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebRtcMetricGroupByOutputType[P]>
            : GetScalarType<T[P], WebRtcMetricGroupByOutputType[P]>
        }
      >
    >


  export type WebRtcMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    metricType?: boolean
    value?: boolean
    peerConnectionId?: boolean
    rttMs?: boolean
    jitterMs?: boolean
    packetLoss?: boolean
    networkType?: boolean
    effectiveType?: boolean
    downlinkMbps?: boolean
    iceCandidatePairId?: boolean
    localCandidateId?: boolean
    remoteCandidateId?: boolean
    timestamp?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webRtcMetric"]>

  export type WebRtcMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    metricType?: boolean
    value?: boolean
    peerConnectionId?: boolean
    rttMs?: boolean
    jitterMs?: boolean
    packetLoss?: boolean
    networkType?: boolean
    effectiveType?: boolean
    downlinkMbps?: boolean
    iceCandidatePairId?: boolean
    localCandidateId?: boolean
    remoteCandidateId?: boolean
    timestamp?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webRtcMetric"]>

  export type WebRtcMetricSelectScalar = {
    id?: boolean
    userId?: boolean
    projectId?: boolean
    metricType?: boolean
    value?: boolean
    peerConnectionId?: boolean
    rttMs?: boolean
    jitterMs?: boolean
    packetLoss?: boolean
    networkType?: boolean
    effectiveType?: boolean
    downlinkMbps?: boolean
    iceCandidatePairId?: boolean
    localCandidateId?: boolean
    remoteCandidateId?: boolean
    timestamp?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type WebRtcMetricInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WebRtcMetricIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WebRtcMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WebRtcMetric"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      projectId: string | null
      metricType: string
      value: number
      peerConnectionId: string | null
      rttMs: number | null
      jitterMs: number | null
      packetLoss: number | null
      networkType: string | null
      effectiveType: string | null
      downlinkMbps: number | null
      iceCandidatePairId: string | null
      localCandidateId: string | null
      remoteCandidateId: string | null
      timestamp: Date
      metadata: string | null
      createdAt: Date
    }, ExtArgs["result"]["webRtcMetric"]>
    composites: {}
  }

  type WebRtcMetricGetPayload<S extends boolean | null | undefined | WebRtcMetricDefaultArgs> = $Result.GetResult<Prisma.$WebRtcMetricPayload, S>

  type WebRtcMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WebRtcMetricFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WebRtcMetricCountAggregateInputType | true
    }

  export interface WebRtcMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WebRtcMetric'], meta: { name: 'WebRtcMetric' } }
    /**
     * Find zero or one WebRtcMetric that matches the filter.
     * @param {WebRtcMetricFindUniqueArgs} args - Arguments to find a WebRtcMetric
     * @example
     * // Get one WebRtcMetric
     * const webRtcMetric = await prisma.webRtcMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebRtcMetricFindUniqueArgs>(args: SelectSubset<T, WebRtcMetricFindUniqueArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WebRtcMetric that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WebRtcMetricFindUniqueOrThrowArgs} args - Arguments to find a WebRtcMetric
     * @example
     * // Get one WebRtcMetric
     * const webRtcMetric = await prisma.webRtcMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebRtcMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, WebRtcMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WebRtcMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebRtcMetricFindFirstArgs} args - Arguments to find a WebRtcMetric
     * @example
     * // Get one WebRtcMetric
     * const webRtcMetric = await prisma.webRtcMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebRtcMetricFindFirstArgs>(args?: SelectSubset<T, WebRtcMetricFindFirstArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WebRtcMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebRtcMetricFindFirstOrThrowArgs} args - Arguments to find a WebRtcMetric
     * @example
     * // Get one WebRtcMetric
     * const webRtcMetric = await prisma.webRtcMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebRtcMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, WebRtcMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WebRtcMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebRtcMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WebRtcMetrics
     * const webRtcMetrics = await prisma.webRtcMetric.findMany()
     * 
     * // Get first 10 WebRtcMetrics
     * const webRtcMetrics = await prisma.webRtcMetric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webRtcMetricWithIdOnly = await prisma.webRtcMetric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebRtcMetricFindManyArgs>(args?: SelectSubset<T, WebRtcMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WebRtcMetric.
     * @param {WebRtcMetricCreateArgs} args - Arguments to create a WebRtcMetric.
     * @example
     * // Create one WebRtcMetric
     * const WebRtcMetric = await prisma.webRtcMetric.create({
     *   data: {
     *     // ... data to create a WebRtcMetric
     *   }
     * })
     * 
     */
    create<T extends WebRtcMetricCreateArgs>(args: SelectSubset<T, WebRtcMetricCreateArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WebRtcMetrics.
     * @param {WebRtcMetricCreateManyArgs} args - Arguments to create many WebRtcMetrics.
     * @example
     * // Create many WebRtcMetrics
     * const webRtcMetric = await prisma.webRtcMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebRtcMetricCreateManyArgs>(args?: SelectSubset<T, WebRtcMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WebRtcMetrics and returns the data saved in the database.
     * @param {WebRtcMetricCreateManyAndReturnArgs} args - Arguments to create many WebRtcMetrics.
     * @example
     * // Create many WebRtcMetrics
     * const webRtcMetric = await prisma.webRtcMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WebRtcMetrics and only return the `id`
     * const webRtcMetricWithIdOnly = await prisma.webRtcMetric.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebRtcMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, WebRtcMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WebRtcMetric.
     * @param {WebRtcMetricDeleteArgs} args - Arguments to delete one WebRtcMetric.
     * @example
     * // Delete one WebRtcMetric
     * const WebRtcMetric = await prisma.webRtcMetric.delete({
     *   where: {
     *     // ... filter to delete one WebRtcMetric
     *   }
     * })
     * 
     */
    delete<T extends WebRtcMetricDeleteArgs>(args: SelectSubset<T, WebRtcMetricDeleteArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WebRtcMetric.
     * @param {WebRtcMetricUpdateArgs} args - Arguments to update one WebRtcMetric.
     * @example
     * // Update one WebRtcMetric
     * const webRtcMetric = await prisma.webRtcMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebRtcMetricUpdateArgs>(args: SelectSubset<T, WebRtcMetricUpdateArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WebRtcMetrics.
     * @param {WebRtcMetricDeleteManyArgs} args - Arguments to filter WebRtcMetrics to delete.
     * @example
     * // Delete a few WebRtcMetrics
     * const { count } = await prisma.webRtcMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebRtcMetricDeleteManyArgs>(args?: SelectSubset<T, WebRtcMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebRtcMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebRtcMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WebRtcMetrics
     * const webRtcMetric = await prisma.webRtcMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebRtcMetricUpdateManyArgs>(args: SelectSubset<T, WebRtcMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WebRtcMetric.
     * @param {WebRtcMetricUpsertArgs} args - Arguments to update or create a WebRtcMetric.
     * @example
     * // Update or create a WebRtcMetric
     * const webRtcMetric = await prisma.webRtcMetric.upsert({
     *   create: {
     *     // ... data to create a WebRtcMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WebRtcMetric we want to update
     *   }
     * })
     */
    upsert<T extends WebRtcMetricUpsertArgs>(args: SelectSubset<T, WebRtcMetricUpsertArgs<ExtArgs>>): Prisma__WebRtcMetricClient<$Result.GetResult<Prisma.$WebRtcMetricPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WebRtcMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebRtcMetricCountArgs} args - Arguments to filter WebRtcMetrics to count.
     * @example
     * // Count the number of WebRtcMetrics
     * const count = await prisma.webRtcMetric.count({
     *   where: {
     *     // ... the filter for the WebRtcMetrics we want to count
     *   }
     * })
    **/
    count<T extends WebRtcMetricCountArgs>(
      args?: Subset<T, WebRtcMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebRtcMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WebRtcMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebRtcMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebRtcMetricAggregateArgs>(args: Subset<T, WebRtcMetricAggregateArgs>): Prisma.PrismaPromise<GetWebRtcMetricAggregateType<T>>

    /**
     * Group by WebRtcMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebRtcMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebRtcMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebRtcMetricGroupByArgs['orderBy'] }
        : { orderBy?: WebRtcMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebRtcMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebRtcMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WebRtcMetric model
   */
  readonly fields: WebRtcMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WebRtcMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebRtcMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WebRtcMetric model
   */ 
  interface WebRtcMetricFieldRefs {
    readonly id: FieldRef<"WebRtcMetric", 'String'>
    readonly userId: FieldRef<"WebRtcMetric", 'String'>
    readonly projectId: FieldRef<"WebRtcMetric", 'String'>
    readonly metricType: FieldRef<"WebRtcMetric", 'String'>
    readonly value: FieldRef<"WebRtcMetric", 'Float'>
    readonly peerConnectionId: FieldRef<"WebRtcMetric", 'String'>
    readonly rttMs: FieldRef<"WebRtcMetric", 'Float'>
    readonly jitterMs: FieldRef<"WebRtcMetric", 'Float'>
    readonly packetLoss: FieldRef<"WebRtcMetric", 'Float'>
    readonly networkType: FieldRef<"WebRtcMetric", 'String'>
    readonly effectiveType: FieldRef<"WebRtcMetric", 'String'>
    readonly downlinkMbps: FieldRef<"WebRtcMetric", 'Float'>
    readonly iceCandidatePairId: FieldRef<"WebRtcMetric", 'String'>
    readonly localCandidateId: FieldRef<"WebRtcMetric", 'String'>
    readonly remoteCandidateId: FieldRef<"WebRtcMetric", 'String'>
    readonly timestamp: FieldRef<"WebRtcMetric", 'DateTime'>
    readonly metadata: FieldRef<"WebRtcMetric", 'String'>
    readonly createdAt: FieldRef<"WebRtcMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WebRtcMetric findUnique
   */
  export type WebRtcMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * Filter, which WebRtcMetric to fetch.
     */
    where: WebRtcMetricWhereUniqueInput
  }

  /**
   * WebRtcMetric findUniqueOrThrow
   */
  export type WebRtcMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * Filter, which WebRtcMetric to fetch.
     */
    where: WebRtcMetricWhereUniqueInput
  }

  /**
   * WebRtcMetric findFirst
   */
  export type WebRtcMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * Filter, which WebRtcMetric to fetch.
     */
    where?: WebRtcMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebRtcMetrics to fetch.
     */
    orderBy?: WebRtcMetricOrderByWithRelationInput | WebRtcMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebRtcMetrics.
     */
    cursor?: WebRtcMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebRtcMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebRtcMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebRtcMetrics.
     */
    distinct?: WebRtcMetricScalarFieldEnum | WebRtcMetricScalarFieldEnum[]
  }

  /**
   * WebRtcMetric findFirstOrThrow
   */
  export type WebRtcMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * Filter, which WebRtcMetric to fetch.
     */
    where?: WebRtcMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebRtcMetrics to fetch.
     */
    orderBy?: WebRtcMetricOrderByWithRelationInput | WebRtcMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebRtcMetrics.
     */
    cursor?: WebRtcMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebRtcMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebRtcMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebRtcMetrics.
     */
    distinct?: WebRtcMetricScalarFieldEnum | WebRtcMetricScalarFieldEnum[]
  }

  /**
   * WebRtcMetric findMany
   */
  export type WebRtcMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * Filter, which WebRtcMetrics to fetch.
     */
    where?: WebRtcMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebRtcMetrics to fetch.
     */
    orderBy?: WebRtcMetricOrderByWithRelationInput | WebRtcMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WebRtcMetrics.
     */
    cursor?: WebRtcMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebRtcMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebRtcMetrics.
     */
    skip?: number
    distinct?: WebRtcMetricScalarFieldEnum | WebRtcMetricScalarFieldEnum[]
  }

  /**
   * WebRtcMetric create
   */
  export type WebRtcMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * The data needed to create a WebRtcMetric.
     */
    data: XOR<WebRtcMetricCreateInput, WebRtcMetricUncheckedCreateInput>
  }

  /**
   * WebRtcMetric createMany
   */
  export type WebRtcMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WebRtcMetrics.
     */
    data: WebRtcMetricCreateManyInput | WebRtcMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebRtcMetric createManyAndReturn
   */
  export type WebRtcMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WebRtcMetrics.
     */
    data: WebRtcMetricCreateManyInput | WebRtcMetricCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WebRtcMetric update
   */
  export type WebRtcMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * The data needed to update a WebRtcMetric.
     */
    data: XOR<WebRtcMetricUpdateInput, WebRtcMetricUncheckedUpdateInput>
    /**
     * Choose, which WebRtcMetric to update.
     */
    where: WebRtcMetricWhereUniqueInput
  }

  /**
   * WebRtcMetric updateMany
   */
  export type WebRtcMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WebRtcMetrics.
     */
    data: XOR<WebRtcMetricUpdateManyMutationInput, WebRtcMetricUncheckedUpdateManyInput>
    /**
     * Filter which WebRtcMetrics to update
     */
    where?: WebRtcMetricWhereInput
  }

  /**
   * WebRtcMetric upsert
   */
  export type WebRtcMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * The filter to search for the WebRtcMetric to update in case it exists.
     */
    where: WebRtcMetricWhereUniqueInput
    /**
     * In case the WebRtcMetric found by the `where` argument doesn't exist, create a new WebRtcMetric with this data.
     */
    create: XOR<WebRtcMetricCreateInput, WebRtcMetricUncheckedCreateInput>
    /**
     * In case the WebRtcMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebRtcMetricUpdateInput, WebRtcMetricUncheckedUpdateInput>
  }

  /**
   * WebRtcMetric delete
   */
  export type WebRtcMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
    /**
     * Filter which WebRtcMetric to delete.
     */
    where: WebRtcMetricWhereUniqueInput
  }

  /**
   * WebRtcMetric deleteMany
   */
  export type WebRtcMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebRtcMetrics to delete
     */
    where?: WebRtcMetricWhereInput
  }

  /**
   * WebRtcMetric without action
   */
  export type WebRtcMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebRtcMetric
     */
    select?: WebRtcMetricSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebRtcMetricInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isPublic: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isPublic: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    description: number
    isPublic: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    description: string | null
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    snapshots?: boolean | Project$snapshotsArgs<ExtArgs>
    activityLogs?: boolean | Project$activityLogsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshots?: boolean | Project$snapshotsArgs<ExtArgs>
    activityLogs?: boolean | Project$activityLogsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      snapshots: Prisma.$SnapshotPayload<ExtArgs>[]
      activityLogs: Prisma.$ActivityLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      isPublic: boolean
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    snapshots<T extends Project$snapshotsArgs<ExtArgs> = {}>(args?: Subset<T, Project$snapshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findMany"> | Null>
    activityLogs<T extends Project$activityLogsArgs<ExtArgs> = {}>(args?: Subset<T, Project$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */ 
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly isPublic: FieldRef<"Project", 'Boolean'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
    readonly deletedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
  }

  /**
   * Project.snapshots
   */
  export type Project$snapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    where?: SnapshotWhereInput
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    cursor?: SnapshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Project.activityLogs
   */
  export type Project$activityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivityLog
     */
    select?: ActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActivityLogInclude<ExtArgs> | null
    where?: ActivityLogWhereInput
    orderBy?: ActivityLogOrderByWithRelationInput | ActivityLogOrderByWithRelationInput[]
    cursor?: ActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActivityLogScalarFieldEnum | ActivityLogScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Snapshot
   */

  export type AggregateSnapshot = {
    _count: SnapshotCountAggregateOutputType | null
    _min: SnapshotMinAggregateOutputType | null
    _max: SnapshotMaxAggregateOutputType | null
  }

  export type SnapshotMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    description: string | null
    data: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapshotMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    description: string | null
    data: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SnapshotCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    description: number
    data: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SnapshotMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    description?: true
    data?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapshotMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    description?: true
    data?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SnapshotCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    description?: true
    data?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snapshot to aggregate.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Snapshots
    **/
    _count?: true | SnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapshotMaxAggregateInputType
  }

  export type GetSnapshotAggregateType<T extends SnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapshot[P]>
      : GetScalarType<T[P], AggregateSnapshot[P]>
  }




  export type SnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapshotWhereInput
    orderBy?: SnapshotOrderByWithAggregationInput | SnapshotOrderByWithAggregationInput[]
    by: SnapshotScalarFieldEnum[] | SnapshotScalarFieldEnum
    having?: SnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapshotCountAggregateInputType | true
    _min?: SnapshotMinAggregateInputType
    _max?: SnapshotMaxAggregateInputType
  }

  export type SnapshotGroupByOutputType = {
    id: string
    projectId: string
    name: string
    description: string | null
    data: string
    createdAt: Date
    updatedAt: Date
    _count: SnapshotCountAggregateOutputType | null
    _min: SnapshotMinAggregateOutputType | null
    _max: SnapshotMaxAggregateOutputType | null
  }

  type GetSnapshotGroupByPayload<T extends SnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], SnapshotGroupByOutputType[P]>
        }
      >
    >


  export type SnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    description?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    tags?: boolean | Snapshot$tagsArgs<ExtArgs>
    _count?: boolean | SnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["snapshot"]>

  export type SnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    description?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["snapshot"]>

  export type SnapshotSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    description?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    tags?: boolean | Snapshot$tagsArgs<ExtArgs>
    _count?: boolean | SnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SnapshotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $SnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Snapshot"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      tags: Prisma.$EntityTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      name: string
      description: string | null
      data: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["snapshot"]>
    composites: {}
  }

  type SnapshotGetPayload<S extends boolean | null | undefined | SnapshotDefaultArgs> = $Result.GetResult<Prisma.$SnapshotPayload, S>

  type SnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SnapshotFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SnapshotCountAggregateInputType | true
    }

  export interface SnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Snapshot'], meta: { name: 'Snapshot' } }
    /**
     * Find zero or one Snapshot that matches the filter.
     * @param {SnapshotFindUniqueArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapshotFindUniqueArgs>(args: SelectSubset<T, SnapshotFindUniqueArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Snapshot that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SnapshotFindUniqueOrThrowArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Snapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindFirstArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapshotFindFirstArgs>(args?: SelectSubset<T, SnapshotFindFirstArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Snapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindFirstOrThrowArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Snapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Snapshots
     * const snapshots = await prisma.snapshot.findMany()
     * 
     * // Get first 10 Snapshots
     * const snapshots = await prisma.snapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snapshotWithIdOnly = await prisma.snapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnapshotFindManyArgs>(args?: SelectSubset<T, SnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Snapshot.
     * @param {SnapshotCreateArgs} args - Arguments to create a Snapshot.
     * @example
     * // Create one Snapshot
     * const Snapshot = await prisma.snapshot.create({
     *   data: {
     *     // ... data to create a Snapshot
     *   }
     * })
     * 
     */
    create<T extends SnapshotCreateArgs>(args: SelectSubset<T, SnapshotCreateArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Snapshots.
     * @param {SnapshotCreateManyArgs} args - Arguments to create many Snapshots.
     * @example
     * // Create many Snapshots
     * const snapshot = await prisma.snapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapshotCreateManyArgs>(args?: SelectSubset<T, SnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Snapshots and returns the data saved in the database.
     * @param {SnapshotCreateManyAndReturnArgs} args - Arguments to create many Snapshots.
     * @example
     * // Create many Snapshots
     * const snapshot = await prisma.snapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Snapshots and only return the `id`
     * const snapshotWithIdOnly = await prisma.snapshot.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Snapshot.
     * @param {SnapshotDeleteArgs} args - Arguments to delete one Snapshot.
     * @example
     * // Delete one Snapshot
     * const Snapshot = await prisma.snapshot.delete({
     *   where: {
     *     // ... filter to delete one Snapshot
     *   }
     * })
     * 
     */
    delete<T extends SnapshotDeleteArgs>(args: SelectSubset<T, SnapshotDeleteArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Snapshot.
     * @param {SnapshotUpdateArgs} args - Arguments to update one Snapshot.
     * @example
     * // Update one Snapshot
     * const snapshot = await prisma.snapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapshotUpdateArgs>(args: SelectSubset<T, SnapshotUpdateArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Snapshots.
     * @param {SnapshotDeleteManyArgs} args - Arguments to filter Snapshots to delete.
     * @example
     * // Delete a few Snapshots
     * const { count } = await prisma.snapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapshotDeleteManyArgs>(args?: SelectSubset<T, SnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Snapshots
     * const snapshot = await prisma.snapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapshotUpdateManyArgs>(args: SelectSubset<T, SnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Snapshot.
     * @param {SnapshotUpsertArgs} args - Arguments to update or create a Snapshot.
     * @example
     * // Update or create a Snapshot
     * const snapshot = await prisma.snapshot.upsert({
     *   create: {
     *     // ... data to create a Snapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Snapshot we want to update
     *   }
     * })
     */
    upsert<T extends SnapshotUpsertArgs>(args: SelectSubset<T, SnapshotUpsertArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotCountArgs} args - Arguments to filter Snapshots to count.
     * @example
     * // Count the number of Snapshots
     * const count = await prisma.snapshot.count({
     *   where: {
     *     // ... the filter for the Snapshots we want to count
     *   }
     * })
    **/
    count<T extends SnapshotCountArgs>(
      args?: Subset<T, SnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Snapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SnapshotAggregateArgs>(args: Subset<T, SnapshotAggregateArgs>): Prisma.PrismaPromise<GetSnapshotAggregateType<T>>

    /**
     * Group by Snapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapshotGroupByArgs['orderBy'] }
        : { orderBy?: SnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Snapshot model
   */
  readonly fields: SnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Snapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    tags<T extends Snapshot$tagsArgs<ExtArgs> = {}>(args?: Subset<T, Snapshot$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Snapshot model
   */ 
  interface SnapshotFieldRefs {
    readonly id: FieldRef<"Snapshot", 'String'>
    readonly projectId: FieldRef<"Snapshot", 'String'>
    readonly name: FieldRef<"Snapshot", 'String'>
    readonly description: FieldRef<"Snapshot", 'String'>
    readonly data: FieldRef<"Snapshot", 'String'>
    readonly createdAt: FieldRef<"Snapshot", 'DateTime'>
    readonly updatedAt: FieldRef<"Snapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Snapshot findUnique
   */
  export type SnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot findUniqueOrThrow
   */
  export type SnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot findFirst
   */
  export type SnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snapshots.
     */
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot findFirstOrThrow
   */
  export type SnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snapshots.
     */
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot findMany
   */
  export type SnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshots to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot create
   */
  export type SnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a Snapshot.
     */
    data: XOR<SnapshotCreateInput, SnapshotUncheckedCreateInput>
  }

  /**
   * Snapshot createMany
   */
  export type SnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Snapshots.
     */
    data: SnapshotCreateManyInput | SnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Snapshot createManyAndReturn
   */
  export type SnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Snapshots.
     */
    data: SnapshotCreateManyInput | SnapshotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Snapshot update
   */
  export type SnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a Snapshot.
     */
    data: XOR<SnapshotUpdateInput, SnapshotUncheckedUpdateInput>
    /**
     * Choose, which Snapshot to update.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot updateMany
   */
  export type SnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Snapshots.
     */
    data: XOR<SnapshotUpdateManyMutationInput, SnapshotUncheckedUpdateManyInput>
    /**
     * Filter which Snapshots to update
     */
    where?: SnapshotWhereInput
  }

  /**
   * Snapshot upsert
   */
  export type SnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the Snapshot to update in case it exists.
     */
    where: SnapshotWhereUniqueInput
    /**
     * In case the Snapshot found by the `where` argument doesn't exist, create a new Snapshot with this data.
     */
    create: XOR<SnapshotCreateInput, SnapshotUncheckedCreateInput>
    /**
     * In case the Snapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapshotUpdateInput, SnapshotUncheckedUpdateInput>
  }

  /**
   * Snapshot delete
   */
  export type SnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter which Snapshot to delete.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot deleteMany
   */
  export type SnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snapshots to delete
     */
    where?: SnapshotWhereInput
  }

  /**
   * Snapshot.tags
   */
  export type Snapshot$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    where?: EntityTagWhereInput
    orderBy?: EntityTagOrderByWithRelationInput | EntityTagOrderByWithRelationInput[]
    cursor?: EntityTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EntityTagScalarFieldEnum | EntityTagScalarFieldEnum[]
  }

  /**
   * Snapshot without action
   */
  export type SnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    name: number
    description: number
    color: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TagMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: string
    name: string
    description: string | null
    color: string | null
    createdAt: Date
    updatedAt: Date
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    entityTags?: boolean | Tag$entityTagsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entityTags?: boolean | Tag$entityTagsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      entityTags: Prisma.$EntityTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      color: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entityTags<T extends Tag$entityTagsArgs<ExtArgs> = {}>(args?: Subset<T, Tag$entityTagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */ 
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'String'>
    readonly name: FieldRef<"Tag", 'String'>
    readonly description: FieldRef<"Tag", 'String'>
    readonly color: FieldRef<"Tag", 'String'>
    readonly createdAt: FieldRef<"Tag", 'DateTime'>
    readonly updatedAt: FieldRef<"Tag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
  }

  /**
   * Tag.entityTags
   */
  export type Tag$entityTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    where?: EntityTagWhereInput
    orderBy?: EntityTagOrderByWithRelationInput | EntityTagOrderByWithRelationInput[]
    cursor?: EntityTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EntityTagScalarFieldEnum | EntityTagScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model EntityTag
   */

  export type AggregateEntityTag = {
    _count: EntityTagCountAggregateOutputType | null
    _min: EntityTagMinAggregateOutputType | null
    _max: EntityTagMaxAggregateOutputType | null
  }

  export type EntityTagMinAggregateOutputType = {
    id: string | null
    entityType: string | null
    entityId: string | null
    tagId: string | null
    snapshotId: string | null
    createdAt: Date | null
  }

  export type EntityTagMaxAggregateOutputType = {
    id: string | null
    entityType: string | null
    entityId: string | null
    tagId: string | null
    snapshotId: string | null
    createdAt: Date | null
  }

  export type EntityTagCountAggregateOutputType = {
    id: number
    entityType: number
    entityId: number
    tagId: number
    snapshotId: number
    createdAt: number
    _all: number
  }


  export type EntityTagMinAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    tagId?: true
    snapshotId?: true
    createdAt?: true
  }

  export type EntityTagMaxAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    tagId?: true
    snapshotId?: true
    createdAt?: true
  }

  export type EntityTagCountAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    tagId?: true
    snapshotId?: true
    createdAt?: true
    _all?: true
  }

  export type EntityTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntityTag to aggregate.
     */
    where?: EntityTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntityTags to fetch.
     */
    orderBy?: EntityTagOrderByWithRelationInput | EntityTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EntityTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntityTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntityTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EntityTags
    **/
    _count?: true | EntityTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EntityTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EntityTagMaxAggregateInputType
  }

  export type GetEntityTagAggregateType<T extends EntityTagAggregateArgs> = {
        [P in keyof T & keyof AggregateEntityTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEntityTag[P]>
      : GetScalarType<T[P], AggregateEntityTag[P]>
  }




  export type EntityTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntityTagWhereInput
    orderBy?: EntityTagOrderByWithAggregationInput | EntityTagOrderByWithAggregationInput[]
    by: EntityTagScalarFieldEnum[] | EntityTagScalarFieldEnum
    having?: EntityTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EntityTagCountAggregateInputType | true
    _min?: EntityTagMinAggregateInputType
    _max?: EntityTagMaxAggregateInputType
  }

  export type EntityTagGroupByOutputType = {
    id: string
    entityType: string
    entityId: string
    tagId: string
    snapshotId: string | null
    createdAt: Date
    _count: EntityTagCountAggregateOutputType | null
    _min: EntityTagMinAggregateOutputType | null
    _max: EntityTagMaxAggregateOutputType | null
  }

  type GetEntityTagGroupByPayload<T extends EntityTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EntityTagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EntityTagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EntityTagGroupByOutputType[P]>
            : GetScalarType<T[P], EntityTagGroupByOutputType[P]>
        }
      >
    >


  export type EntityTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    tagId?: boolean
    snapshotId?: boolean
    createdAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    snapshot?: boolean | EntityTag$snapshotArgs<ExtArgs>
  }, ExtArgs["result"]["entityTag"]>

  export type EntityTagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    tagId?: boolean
    snapshotId?: boolean
    createdAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    snapshot?: boolean | EntityTag$snapshotArgs<ExtArgs>
  }, ExtArgs["result"]["entityTag"]>

  export type EntityTagSelectScalar = {
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    tagId?: boolean
    snapshotId?: boolean
    createdAt?: boolean
  }

  export type EntityTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    snapshot?: boolean | EntityTag$snapshotArgs<ExtArgs>
  }
  export type EntityTagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    snapshot?: boolean | EntityTag$snapshotArgs<ExtArgs>
  }

  export type $EntityTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EntityTag"
    objects: {
      tag: Prisma.$TagPayload<ExtArgs>
      snapshot: Prisma.$SnapshotPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entityType: string
      entityId: string
      tagId: string
      snapshotId: string | null
      createdAt: Date
    }, ExtArgs["result"]["entityTag"]>
    composites: {}
  }

  type EntityTagGetPayload<S extends boolean | null | undefined | EntityTagDefaultArgs> = $Result.GetResult<Prisma.$EntityTagPayload, S>

  type EntityTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EntityTagFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EntityTagCountAggregateInputType | true
    }

  export interface EntityTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EntityTag'], meta: { name: 'EntityTag' } }
    /**
     * Find zero or one EntityTag that matches the filter.
     * @param {EntityTagFindUniqueArgs} args - Arguments to find a EntityTag
     * @example
     * // Get one EntityTag
     * const entityTag = await prisma.entityTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EntityTagFindUniqueArgs>(args: SelectSubset<T, EntityTagFindUniqueArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EntityTag that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EntityTagFindUniqueOrThrowArgs} args - Arguments to find a EntityTag
     * @example
     * // Get one EntityTag
     * const entityTag = await prisma.entityTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EntityTagFindUniqueOrThrowArgs>(args: SelectSubset<T, EntityTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EntityTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityTagFindFirstArgs} args - Arguments to find a EntityTag
     * @example
     * // Get one EntityTag
     * const entityTag = await prisma.entityTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EntityTagFindFirstArgs>(args?: SelectSubset<T, EntityTagFindFirstArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EntityTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityTagFindFirstOrThrowArgs} args - Arguments to find a EntityTag
     * @example
     * // Get one EntityTag
     * const entityTag = await prisma.entityTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EntityTagFindFirstOrThrowArgs>(args?: SelectSubset<T, EntityTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EntityTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EntityTags
     * const entityTags = await prisma.entityTag.findMany()
     * 
     * // Get first 10 EntityTags
     * const entityTags = await prisma.entityTag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const entityTagWithIdOnly = await prisma.entityTag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EntityTagFindManyArgs>(args?: SelectSubset<T, EntityTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EntityTag.
     * @param {EntityTagCreateArgs} args - Arguments to create a EntityTag.
     * @example
     * // Create one EntityTag
     * const EntityTag = await prisma.entityTag.create({
     *   data: {
     *     // ... data to create a EntityTag
     *   }
     * })
     * 
     */
    create<T extends EntityTagCreateArgs>(args: SelectSubset<T, EntityTagCreateArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EntityTags.
     * @param {EntityTagCreateManyArgs} args - Arguments to create many EntityTags.
     * @example
     * // Create many EntityTags
     * const entityTag = await prisma.entityTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EntityTagCreateManyArgs>(args?: SelectSubset<T, EntityTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EntityTags and returns the data saved in the database.
     * @param {EntityTagCreateManyAndReturnArgs} args - Arguments to create many EntityTags.
     * @example
     * // Create many EntityTags
     * const entityTag = await prisma.entityTag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EntityTags and only return the `id`
     * const entityTagWithIdOnly = await prisma.entityTag.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EntityTagCreateManyAndReturnArgs>(args?: SelectSubset<T, EntityTagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EntityTag.
     * @param {EntityTagDeleteArgs} args - Arguments to delete one EntityTag.
     * @example
     * // Delete one EntityTag
     * const EntityTag = await prisma.entityTag.delete({
     *   where: {
     *     // ... filter to delete one EntityTag
     *   }
     * })
     * 
     */
    delete<T extends EntityTagDeleteArgs>(args: SelectSubset<T, EntityTagDeleteArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EntityTag.
     * @param {EntityTagUpdateArgs} args - Arguments to update one EntityTag.
     * @example
     * // Update one EntityTag
     * const entityTag = await prisma.entityTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EntityTagUpdateArgs>(args: SelectSubset<T, EntityTagUpdateArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EntityTags.
     * @param {EntityTagDeleteManyArgs} args - Arguments to filter EntityTags to delete.
     * @example
     * // Delete a few EntityTags
     * const { count } = await prisma.entityTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EntityTagDeleteManyArgs>(args?: SelectSubset<T, EntityTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EntityTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EntityTags
     * const entityTag = await prisma.entityTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EntityTagUpdateManyArgs>(args: SelectSubset<T, EntityTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EntityTag.
     * @param {EntityTagUpsertArgs} args - Arguments to update or create a EntityTag.
     * @example
     * // Update or create a EntityTag
     * const entityTag = await prisma.entityTag.upsert({
     *   create: {
     *     // ... data to create a EntityTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EntityTag we want to update
     *   }
     * })
     */
    upsert<T extends EntityTagUpsertArgs>(args: SelectSubset<T, EntityTagUpsertArgs<ExtArgs>>): Prisma__EntityTagClient<$Result.GetResult<Prisma.$EntityTagPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EntityTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityTagCountArgs} args - Arguments to filter EntityTags to count.
     * @example
     * // Count the number of EntityTags
     * const count = await prisma.entityTag.count({
     *   where: {
     *     // ... the filter for the EntityTags we want to count
     *   }
     * })
    **/
    count<T extends EntityTagCountArgs>(
      args?: Subset<T, EntityTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EntityTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EntityTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EntityTagAggregateArgs>(args: Subset<T, EntityTagAggregateArgs>): Prisma.PrismaPromise<GetEntityTagAggregateType<T>>

    /**
     * Group by EntityTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityTagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EntityTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EntityTagGroupByArgs['orderBy'] }
        : { orderBy?: EntityTagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EntityTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntityTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EntityTag model
   */
  readonly fields: EntityTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EntityTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EntityTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tag<T extends TagDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TagDefaultArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    snapshot<T extends EntityTag$snapshotArgs<ExtArgs> = {}>(args?: Subset<T, EntityTag$snapshotArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EntityTag model
   */ 
  interface EntityTagFieldRefs {
    readonly id: FieldRef<"EntityTag", 'String'>
    readonly entityType: FieldRef<"EntityTag", 'String'>
    readonly entityId: FieldRef<"EntityTag", 'String'>
    readonly tagId: FieldRef<"EntityTag", 'String'>
    readonly snapshotId: FieldRef<"EntityTag", 'String'>
    readonly createdAt: FieldRef<"EntityTag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EntityTag findUnique
   */
  export type EntityTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * Filter, which EntityTag to fetch.
     */
    where: EntityTagWhereUniqueInput
  }

  /**
   * EntityTag findUniqueOrThrow
   */
  export type EntityTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * Filter, which EntityTag to fetch.
     */
    where: EntityTagWhereUniqueInput
  }

  /**
   * EntityTag findFirst
   */
  export type EntityTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * Filter, which EntityTag to fetch.
     */
    where?: EntityTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntityTags to fetch.
     */
    orderBy?: EntityTagOrderByWithRelationInput | EntityTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntityTags.
     */
    cursor?: EntityTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntityTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntityTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntityTags.
     */
    distinct?: EntityTagScalarFieldEnum | EntityTagScalarFieldEnum[]
  }

  /**
   * EntityTag findFirstOrThrow
   */
  export type EntityTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * Filter, which EntityTag to fetch.
     */
    where?: EntityTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntityTags to fetch.
     */
    orderBy?: EntityTagOrderByWithRelationInput | EntityTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntityTags.
     */
    cursor?: EntityTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntityTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntityTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntityTags.
     */
    distinct?: EntityTagScalarFieldEnum | EntityTagScalarFieldEnum[]
  }

  /**
   * EntityTag findMany
   */
  export type EntityTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * Filter, which EntityTags to fetch.
     */
    where?: EntityTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntityTags to fetch.
     */
    orderBy?: EntityTagOrderByWithRelationInput | EntityTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EntityTags.
     */
    cursor?: EntityTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntityTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntityTags.
     */
    skip?: number
    distinct?: EntityTagScalarFieldEnum | EntityTagScalarFieldEnum[]
  }

  /**
   * EntityTag create
   */
  export type EntityTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * The data needed to create a EntityTag.
     */
    data: XOR<EntityTagCreateInput, EntityTagUncheckedCreateInput>
  }

  /**
   * EntityTag createMany
   */
  export type EntityTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EntityTags.
     */
    data: EntityTagCreateManyInput | EntityTagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EntityTag createManyAndReturn
   */
  export type EntityTagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EntityTags.
     */
    data: EntityTagCreateManyInput | EntityTagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EntityTag update
   */
  export type EntityTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * The data needed to update a EntityTag.
     */
    data: XOR<EntityTagUpdateInput, EntityTagUncheckedUpdateInput>
    /**
     * Choose, which EntityTag to update.
     */
    where: EntityTagWhereUniqueInput
  }

  /**
   * EntityTag updateMany
   */
  export type EntityTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EntityTags.
     */
    data: XOR<EntityTagUpdateManyMutationInput, EntityTagUncheckedUpdateManyInput>
    /**
     * Filter which EntityTags to update
     */
    where?: EntityTagWhereInput
  }

  /**
   * EntityTag upsert
   */
  export type EntityTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * The filter to search for the EntityTag to update in case it exists.
     */
    where: EntityTagWhereUniqueInput
    /**
     * In case the EntityTag found by the `where` argument doesn't exist, create a new EntityTag with this data.
     */
    create: XOR<EntityTagCreateInput, EntityTagUncheckedCreateInput>
    /**
     * In case the EntityTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EntityTagUpdateInput, EntityTagUncheckedUpdateInput>
  }

  /**
   * EntityTag delete
   */
  export type EntityTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
    /**
     * Filter which EntityTag to delete.
     */
    where: EntityTagWhereUniqueInput
  }

  /**
   * EntityTag deleteMany
   */
  export type EntityTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntityTags to delete
     */
    where?: EntityTagWhereInput
  }

  /**
   * EntityTag.snapshot
   */
  export type EntityTag$snapshotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    where?: SnapshotWhereInput
  }

  /**
   * EntityTag without action
   */
  export type EntityTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityTag
     */
    select?: EntityTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityTagInclude<ExtArgs> | null
  }


  /**
   * Model FileTransfer
   */

  export type AggregateFileTransfer = {
    _count: FileTransferCountAggregateOutputType | null
    _avg: FileTransferAvgAggregateOutputType | null
    _sum: FileTransferSumAggregateOutputType | null
    _min: FileTransferMinAggregateOutputType | null
    _max: FileTransferMaxAggregateOutputType | null
  }

  export type FileTransferAvgAggregateOutputType = {
    size: number | null
    progress: number | null
  }

  export type FileTransferSumAggregateOutputType = {
    size: number | null
    progress: number | null
  }

  export type FileTransferMinAggregateOutputType = {
    id: string | null
    fileName: string | null
    size: number | null
    mimeType: string | null
    fromUserId: string | null
    toUserId: string | null
    status: string | null
    progress: number | null
    fileKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileTransferMaxAggregateOutputType = {
    id: string | null
    fileName: string | null
    size: number | null
    mimeType: string | null
    fromUserId: string | null
    toUserId: string | null
    status: string | null
    progress: number | null
    fileKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileTransferCountAggregateOutputType = {
    id: number
    fileName: number
    size: number
    mimeType: number
    fromUserId: number
    toUserId: number
    status: number
    progress: number
    fileKey: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FileTransferAvgAggregateInputType = {
    size?: true
    progress?: true
  }

  export type FileTransferSumAggregateInputType = {
    size?: true
    progress?: true
  }

  export type FileTransferMinAggregateInputType = {
    id?: true
    fileName?: true
    size?: true
    mimeType?: true
    fromUserId?: true
    toUserId?: true
    status?: true
    progress?: true
    fileKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileTransferMaxAggregateInputType = {
    id?: true
    fileName?: true
    size?: true
    mimeType?: true
    fromUserId?: true
    toUserId?: true
    status?: true
    progress?: true
    fileKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileTransferCountAggregateInputType = {
    id?: true
    fileName?: true
    size?: true
    mimeType?: true
    fromUserId?: true
    toUserId?: true
    status?: true
    progress?: true
    fileKey?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FileTransferAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileTransfer to aggregate.
     */
    where?: FileTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileTransfers to fetch.
     */
    orderBy?: FileTransferOrderByWithRelationInput | FileTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileTransfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileTransfers
    **/
    _count?: true | FileTransferCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileTransferAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileTransferSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileTransferMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileTransferMaxAggregateInputType
  }

  export type GetFileTransferAggregateType<T extends FileTransferAggregateArgs> = {
        [P in keyof T & keyof AggregateFileTransfer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileTransfer[P]>
      : GetScalarType<T[P], AggregateFileTransfer[P]>
  }




  export type FileTransferGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileTransferWhereInput
    orderBy?: FileTransferOrderByWithAggregationInput | FileTransferOrderByWithAggregationInput[]
    by: FileTransferScalarFieldEnum[] | FileTransferScalarFieldEnum
    having?: FileTransferScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileTransferCountAggregateInputType | true
    _avg?: FileTransferAvgAggregateInputType
    _sum?: FileTransferSumAggregateInputType
    _min?: FileTransferMinAggregateInputType
    _max?: FileTransferMaxAggregateInputType
  }

  export type FileTransferGroupByOutputType = {
    id: string
    fileName: string
    size: number
    mimeType: string
    fromUserId: string
    toUserId: string
    status: string
    progress: number
    fileKey: string | null
    createdAt: Date
    updatedAt: Date
    _count: FileTransferCountAggregateOutputType | null
    _avg: FileTransferAvgAggregateOutputType | null
    _sum: FileTransferSumAggregateOutputType | null
    _min: FileTransferMinAggregateOutputType | null
    _max: FileTransferMaxAggregateOutputType | null
  }

  type GetFileTransferGroupByPayload<T extends FileTransferGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileTransferGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileTransferGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileTransferGroupByOutputType[P]>
            : GetScalarType<T[P], FileTransferGroupByOutputType[P]>
        }
      >
    >


  export type FileTransferSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    size?: boolean
    mimeType?: boolean
    fromUserId?: boolean
    toUserId?: boolean
    status?: boolean
    progress?: boolean
    fileKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fromUser?: boolean | UserDefaultArgs<ExtArgs>
    toUser?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileTransfer"]>

  export type FileTransferSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    size?: boolean
    mimeType?: boolean
    fromUserId?: boolean
    toUserId?: boolean
    status?: boolean
    progress?: boolean
    fileKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fromUser?: boolean | UserDefaultArgs<ExtArgs>
    toUser?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileTransfer"]>

  export type FileTransferSelectScalar = {
    id?: boolean
    fileName?: boolean
    size?: boolean
    mimeType?: boolean
    fromUserId?: boolean
    toUserId?: boolean
    status?: boolean
    progress?: boolean
    fileKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FileTransferInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fromUser?: boolean | UserDefaultArgs<ExtArgs>
    toUser?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FileTransferIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fromUser?: boolean | UserDefaultArgs<ExtArgs>
    toUser?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FileTransferPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileTransfer"
    objects: {
      fromUser: Prisma.$UserPayload<ExtArgs>
      toUser: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileName: string
      size: number
      mimeType: string
      fromUserId: string
      toUserId: string
      status: string
      progress: number
      fileKey: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fileTransfer"]>
    composites: {}
  }

  type FileTransferGetPayload<S extends boolean | null | undefined | FileTransferDefaultArgs> = $Result.GetResult<Prisma.$FileTransferPayload, S>

  type FileTransferCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileTransferFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileTransferCountAggregateInputType | true
    }

  export interface FileTransferDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileTransfer'], meta: { name: 'FileTransfer' } }
    /**
     * Find zero or one FileTransfer that matches the filter.
     * @param {FileTransferFindUniqueArgs} args - Arguments to find a FileTransfer
     * @example
     * // Get one FileTransfer
     * const fileTransfer = await prisma.fileTransfer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileTransferFindUniqueArgs>(args: SelectSubset<T, FileTransferFindUniqueArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FileTransfer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FileTransferFindUniqueOrThrowArgs} args - Arguments to find a FileTransfer
     * @example
     * // Get one FileTransfer
     * const fileTransfer = await prisma.fileTransfer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileTransferFindUniqueOrThrowArgs>(args: SelectSubset<T, FileTransferFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FileTransfer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileTransferFindFirstArgs} args - Arguments to find a FileTransfer
     * @example
     * // Get one FileTransfer
     * const fileTransfer = await prisma.fileTransfer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileTransferFindFirstArgs>(args?: SelectSubset<T, FileTransferFindFirstArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FileTransfer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileTransferFindFirstOrThrowArgs} args - Arguments to find a FileTransfer
     * @example
     * // Get one FileTransfer
     * const fileTransfer = await prisma.fileTransfer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileTransferFindFirstOrThrowArgs>(args?: SelectSubset<T, FileTransferFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FileTransfers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileTransferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileTransfers
     * const fileTransfers = await prisma.fileTransfer.findMany()
     * 
     * // Get first 10 FileTransfers
     * const fileTransfers = await prisma.fileTransfer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileTransferWithIdOnly = await prisma.fileTransfer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileTransferFindManyArgs>(args?: SelectSubset<T, FileTransferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FileTransfer.
     * @param {FileTransferCreateArgs} args - Arguments to create a FileTransfer.
     * @example
     * // Create one FileTransfer
     * const FileTransfer = await prisma.fileTransfer.create({
     *   data: {
     *     // ... data to create a FileTransfer
     *   }
     * })
     * 
     */
    create<T extends FileTransferCreateArgs>(args: SelectSubset<T, FileTransferCreateArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FileTransfers.
     * @param {FileTransferCreateManyArgs} args - Arguments to create many FileTransfers.
     * @example
     * // Create many FileTransfers
     * const fileTransfer = await prisma.fileTransfer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileTransferCreateManyArgs>(args?: SelectSubset<T, FileTransferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileTransfers and returns the data saved in the database.
     * @param {FileTransferCreateManyAndReturnArgs} args - Arguments to create many FileTransfers.
     * @example
     * // Create many FileTransfers
     * const fileTransfer = await prisma.fileTransfer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileTransfers and only return the `id`
     * const fileTransferWithIdOnly = await prisma.fileTransfer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileTransferCreateManyAndReturnArgs>(args?: SelectSubset<T, FileTransferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FileTransfer.
     * @param {FileTransferDeleteArgs} args - Arguments to delete one FileTransfer.
     * @example
     * // Delete one FileTransfer
     * const FileTransfer = await prisma.fileTransfer.delete({
     *   where: {
     *     // ... filter to delete one FileTransfer
     *   }
     * })
     * 
     */
    delete<T extends FileTransferDeleteArgs>(args: SelectSubset<T, FileTransferDeleteArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FileTransfer.
     * @param {FileTransferUpdateArgs} args - Arguments to update one FileTransfer.
     * @example
     * // Update one FileTransfer
     * const fileTransfer = await prisma.fileTransfer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileTransferUpdateArgs>(args: SelectSubset<T, FileTransferUpdateArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FileTransfers.
     * @param {FileTransferDeleteManyArgs} args - Arguments to filter FileTransfers to delete.
     * @example
     * // Delete a few FileTransfers
     * const { count } = await prisma.fileTransfer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileTransferDeleteManyArgs>(args?: SelectSubset<T, FileTransferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileTransfers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileTransferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileTransfers
     * const fileTransfer = await prisma.fileTransfer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileTransferUpdateManyArgs>(args: SelectSubset<T, FileTransferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FileTransfer.
     * @param {FileTransferUpsertArgs} args - Arguments to update or create a FileTransfer.
     * @example
     * // Update or create a FileTransfer
     * const fileTransfer = await prisma.fileTransfer.upsert({
     *   create: {
     *     // ... data to create a FileTransfer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileTransfer we want to update
     *   }
     * })
     */
    upsert<T extends FileTransferUpsertArgs>(args: SelectSubset<T, FileTransferUpsertArgs<ExtArgs>>): Prisma__FileTransferClient<$Result.GetResult<Prisma.$FileTransferPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FileTransfers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileTransferCountArgs} args - Arguments to filter FileTransfers to count.
     * @example
     * // Count the number of FileTransfers
     * const count = await prisma.fileTransfer.count({
     *   where: {
     *     // ... the filter for the FileTransfers we want to count
     *   }
     * })
    **/
    count<T extends FileTransferCountArgs>(
      args?: Subset<T, FileTransferCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileTransferCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileTransfer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileTransferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileTransferAggregateArgs>(args: Subset<T, FileTransferAggregateArgs>): Prisma.PrismaPromise<GetFileTransferAggregateType<T>>

    /**
     * Group by FileTransfer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileTransferGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileTransferGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileTransferGroupByArgs['orderBy'] }
        : { orderBy?: FileTransferGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileTransferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileTransferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileTransfer model
   */
  readonly fields: FileTransferFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileTransfer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileTransferClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fromUser<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    toUser<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileTransfer model
   */ 
  interface FileTransferFieldRefs {
    readonly id: FieldRef<"FileTransfer", 'String'>
    readonly fileName: FieldRef<"FileTransfer", 'String'>
    readonly size: FieldRef<"FileTransfer", 'Int'>
    readonly mimeType: FieldRef<"FileTransfer", 'String'>
    readonly fromUserId: FieldRef<"FileTransfer", 'String'>
    readonly toUserId: FieldRef<"FileTransfer", 'String'>
    readonly status: FieldRef<"FileTransfer", 'String'>
    readonly progress: FieldRef<"FileTransfer", 'Int'>
    readonly fileKey: FieldRef<"FileTransfer", 'String'>
    readonly createdAt: FieldRef<"FileTransfer", 'DateTime'>
    readonly updatedAt: FieldRef<"FileTransfer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileTransfer findUnique
   */
  export type FileTransferFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * Filter, which FileTransfer to fetch.
     */
    where: FileTransferWhereUniqueInput
  }

  /**
   * FileTransfer findUniqueOrThrow
   */
  export type FileTransferFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * Filter, which FileTransfer to fetch.
     */
    where: FileTransferWhereUniqueInput
  }

  /**
   * FileTransfer findFirst
   */
  export type FileTransferFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * Filter, which FileTransfer to fetch.
     */
    where?: FileTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileTransfers to fetch.
     */
    orderBy?: FileTransferOrderByWithRelationInput | FileTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileTransfers.
     */
    cursor?: FileTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileTransfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileTransfers.
     */
    distinct?: FileTransferScalarFieldEnum | FileTransferScalarFieldEnum[]
  }

  /**
   * FileTransfer findFirstOrThrow
   */
  export type FileTransferFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * Filter, which FileTransfer to fetch.
     */
    where?: FileTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileTransfers to fetch.
     */
    orderBy?: FileTransferOrderByWithRelationInput | FileTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileTransfers.
     */
    cursor?: FileTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileTransfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileTransfers.
     */
    distinct?: FileTransferScalarFieldEnum | FileTransferScalarFieldEnum[]
  }

  /**
   * FileTransfer findMany
   */
  export type FileTransferFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * Filter, which FileTransfers to fetch.
     */
    where?: FileTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileTransfers to fetch.
     */
    orderBy?: FileTransferOrderByWithRelationInput | FileTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileTransfers.
     */
    cursor?: FileTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileTransfers.
     */
    skip?: number
    distinct?: FileTransferScalarFieldEnum | FileTransferScalarFieldEnum[]
  }

  /**
   * FileTransfer create
   */
  export type FileTransferCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * The data needed to create a FileTransfer.
     */
    data: XOR<FileTransferCreateInput, FileTransferUncheckedCreateInput>
  }

  /**
   * FileTransfer createMany
   */
  export type FileTransferCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileTransfers.
     */
    data: FileTransferCreateManyInput | FileTransferCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileTransfer createManyAndReturn
   */
  export type FileTransferCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FileTransfers.
     */
    data: FileTransferCreateManyInput | FileTransferCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileTransfer update
   */
  export type FileTransferUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * The data needed to update a FileTransfer.
     */
    data: XOR<FileTransferUpdateInput, FileTransferUncheckedUpdateInput>
    /**
     * Choose, which FileTransfer to update.
     */
    where: FileTransferWhereUniqueInput
  }

  /**
   * FileTransfer updateMany
   */
  export type FileTransferUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileTransfers.
     */
    data: XOR<FileTransferUpdateManyMutationInput, FileTransferUncheckedUpdateManyInput>
    /**
     * Filter which FileTransfers to update
     */
    where?: FileTransferWhereInput
  }

  /**
   * FileTransfer upsert
   */
  export type FileTransferUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * The filter to search for the FileTransfer to update in case it exists.
     */
    where: FileTransferWhereUniqueInput
    /**
     * In case the FileTransfer found by the `where` argument doesn't exist, create a new FileTransfer with this data.
     */
    create: XOR<FileTransferCreateInput, FileTransferUncheckedCreateInput>
    /**
     * In case the FileTransfer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileTransferUpdateInput, FileTransferUncheckedUpdateInput>
  }

  /**
   * FileTransfer delete
   */
  export type FileTransferDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
    /**
     * Filter which FileTransfer to delete.
     */
    where: FileTransferWhereUniqueInput
  }

  /**
   * FileTransfer deleteMany
   */
  export type FileTransferDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileTransfers to delete
     */
    where?: FileTransferWhereInput
  }

  /**
   * FileTransfer without action
   */
  export type FileTransferDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileTransfer
     */
    select?: FileTransferSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileTransferInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    displayName: 'displayName',
    bio: 'bio',
    avatarUrl: 'avatarUrl',
    password: 'password',
    refreshToken: 'refreshToken',
    isApproved: 'isApproved',
    inventoryHash: 'inventoryHash',
    lastLoginAt: 'lastLoginAt',
    lastInventorySync: 'lastInventorySync',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PluginScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    version: 'version',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type PluginScalarFieldEnum = (typeof PluginScalarFieldEnum)[keyof typeof PluginScalarFieldEnum]


  export const DeviceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    type: 'type',
    info: 'info',
    lastActiveAt: 'lastActiveAt',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DeviceScalarFieldEnum = (typeof DeviceScalarFieldEnum)[keyof typeof DeviceScalarFieldEnum]


  export const UserPluginScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    pluginId: 'pluginId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserPluginScalarFieldEnum = (typeof UserPluginScalarFieldEnum)[keyof typeof UserPluginScalarFieldEnum]


  export const UserPresenceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    projectId: 'projectId',
    status: 'status',
    expiresAt: 'expiresAt',
    lastSeen: 'lastSeen',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserPresenceScalarFieldEnum = (typeof UserPresenceScalarFieldEnum)[keyof typeof UserPresenceScalarFieldEnum]


  export const ActivityLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    projectId: 'projectId',
    metadata: 'metadata',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type ActivityLogScalarFieldEnum = (typeof ActivityLogScalarFieldEnum)[keyof typeof ActivityLogScalarFieldEnum]


  export const CrashReportScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    error: 'error',
    stackTrace: 'stackTrace',
    stack: 'stack',
    breadcrumbs: 'breadcrumbs',
    context: 'context',
    projectId: 'projectId',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type CrashReportScalarFieldEnum = (typeof CrashReportScalarFieldEnum)[keyof typeof CrashReportScalarFieldEnum]


  export const WebRtcMetricScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    projectId: 'projectId',
    metricType: 'metricType',
    value: 'value',
    peerConnectionId: 'peerConnectionId',
    rttMs: 'rttMs',
    jitterMs: 'jitterMs',
    packetLoss: 'packetLoss',
    networkType: 'networkType',
    effectiveType: 'effectiveType',
    downlinkMbps: 'downlinkMbps',
    iceCandidatePairId: 'iceCandidatePairId',
    localCandidateId: 'localCandidateId',
    remoteCandidateId: 'remoteCandidateId',
    timestamp: 'timestamp',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type WebRtcMetricScalarFieldEnum = (typeof WebRtcMetricScalarFieldEnum)[keyof typeof WebRtcMetricScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    isPublic: 'isPublic',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const SnapshotScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    description: 'description',
    data: 'data',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SnapshotScalarFieldEnum = (typeof SnapshotScalarFieldEnum)[keyof typeof SnapshotScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const EntityTagScalarFieldEnum: {
    id: 'id',
    entityType: 'entityType',
    entityId: 'entityId',
    tagId: 'tagId',
    snapshotId: 'snapshotId',
    createdAt: 'createdAt'
  };

  export type EntityTagScalarFieldEnum = (typeof EntityTagScalarFieldEnum)[keyof typeof EntityTagScalarFieldEnum]


  export const FileTransferScalarFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    size: 'size',
    mimeType: 'mimeType',
    fromUserId: 'fromUserId',
    toUserId: 'toUserId',
    status: 'status',
    progress: 'progress',
    fileKey: 'fileKey',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FileTransferScalarFieldEnum = (typeof FileTransferScalarFieldEnum)[keyof typeof FileTransferScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    displayName: 'displayName',
    bio: 'bio',
    avatarUrl: 'avatarUrl',
    password: 'password',
    refreshToken: 'refreshToken',
    inventoryHash: 'inventoryHash'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const PluginOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    version: 'version'
  };

  export type PluginOrderByRelevanceFieldEnum = (typeof PluginOrderByRelevanceFieldEnum)[keyof typeof PluginOrderByRelevanceFieldEnum]


  export const DeviceOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    type: 'type',
    info: 'info'
  };

  export type DeviceOrderByRelevanceFieldEnum = (typeof DeviceOrderByRelevanceFieldEnum)[keyof typeof DeviceOrderByRelevanceFieldEnum]


  export const UserPluginOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    pluginId: 'pluginId'
  };

  export type UserPluginOrderByRelevanceFieldEnum = (typeof UserPluginOrderByRelevanceFieldEnum)[keyof typeof UserPluginOrderByRelevanceFieldEnum]


  export const UserPresenceOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    projectId: 'projectId',
    status: 'status'
  };

  export type UserPresenceOrderByRelevanceFieldEnum = (typeof UserPresenceOrderByRelevanceFieldEnum)[keyof typeof UserPresenceOrderByRelevanceFieldEnum]


  export const ActivityLogOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    projectId: 'projectId',
    metadata: 'metadata',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type ActivityLogOrderByRelevanceFieldEnum = (typeof ActivityLogOrderByRelevanceFieldEnum)[keyof typeof ActivityLogOrderByRelevanceFieldEnum]


  export const CrashReportOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    error: 'error',
    stackTrace: 'stackTrace',
    stack: 'stack',
    breadcrumbs: 'breadcrumbs',
    context: 'context',
    projectId: 'projectId',
    metadata: 'metadata'
  };

  export type CrashReportOrderByRelevanceFieldEnum = (typeof CrashReportOrderByRelevanceFieldEnum)[keyof typeof CrashReportOrderByRelevanceFieldEnum]


  export const WebRtcMetricOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    projectId: 'projectId',
    metricType: 'metricType',
    peerConnectionId: 'peerConnectionId',
    networkType: 'networkType',
    effectiveType: 'effectiveType',
    iceCandidatePairId: 'iceCandidatePairId',
    localCandidateId: 'localCandidateId',
    remoteCandidateId: 'remoteCandidateId',
    metadata: 'metadata'
  };

  export type WebRtcMetricOrderByRelevanceFieldEnum = (typeof WebRtcMetricOrderByRelevanceFieldEnum)[keyof typeof WebRtcMetricOrderByRelevanceFieldEnum]


  export const ProjectOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type ProjectOrderByRelevanceFieldEnum = (typeof ProjectOrderByRelevanceFieldEnum)[keyof typeof ProjectOrderByRelevanceFieldEnum]


  export const SnapshotOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    description: 'description',
    data: 'data'
  };

  export type SnapshotOrderByRelevanceFieldEnum = (typeof SnapshotOrderByRelevanceFieldEnum)[keyof typeof SnapshotOrderByRelevanceFieldEnum]


  export const TagOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    color: 'color'
  };

  export type TagOrderByRelevanceFieldEnum = (typeof TagOrderByRelevanceFieldEnum)[keyof typeof TagOrderByRelevanceFieldEnum]


  export const EntityTagOrderByRelevanceFieldEnum: {
    id: 'id',
    entityType: 'entityType',
    entityId: 'entityId',
    tagId: 'tagId',
    snapshotId: 'snapshotId'
  };

  export type EntityTagOrderByRelevanceFieldEnum = (typeof EntityTagOrderByRelevanceFieldEnum)[keyof typeof EntityTagOrderByRelevanceFieldEnum]


  export const FileTransferOrderByRelevanceFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    mimeType: 'mimeType',
    fromUserId: 'fromUserId',
    toUserId: 'toUserId',
    status: 'status',
    fileKey: 'fileKey'
  };

  export type FileTransferOrderByRelevanceFieldEnum = (typeof FileTransferOrderByRelevanceFieldEnum)[keyof typeof FileTransferOrderByRelevanceFieldEnum]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    displayName?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    refreshToken?: StringNullableFilter<"User"> | string | null
    isApproved?: BoolFilter<"User"> | boolean
    inventoryHash?: StringNullableFilter<"User"> | string | null
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastInventorySync?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    userPlugins?: UserPluginListRelationFilter
    presence?: UserPresenceListRelationFilter
    activityLogs?: ActivityLogListRelationFilter
    crashReports?: CrashReportListRelationFilter
    webRtcMetrics?: WebRtcMetricListRelationFilter
    devices?: DeviceListRelationFilter
    fromTransfers?: FileTransferListRelationFilter
    toTransfers?: FileTransferListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    password?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    isApproved?: SortOrder
    inventoryHash?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastInventorySync?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    userPlugins?: UserPluginOrderByRelationAggregateInput
    presence?: UserPresenceOrderByRelationAggregateInput
    activityLogs?: ActivityLogOrderByRelationAggregateInput
    crashReports?: CrashReportOrderByRelationAggregateInput
    webRtcMetrics?: WebRtcMetricOrderByRelationAggregateInput
    devices?: DeviceOrderByRelationAggregateInput
    fromTransfers?: FileTransferOrderByRelationAggregateInput
    toTransfers?: FileTransferOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    displayName?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    refreshToken?: StringNullableFilter<"User"> | string | null
    isApproved?: BoolFilter<"User"> | boolean
    inventoryHash?: StringNullableFilter<"User"> | string | null
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastInventorySync?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    userPlugins?: UserPluginListRelationFilter
    presence?: UserPresenceListRelationFilter
    activityLogs?: ActivityLogListRelationFilter
    crashReports?: CrashReportListRelationFilter
    webRtcMetrics?: WebRtcMetricListRelationFilter
    devices?: DeviceListRelationFilter
    fromTransfers?: FileTransferListRelationFilter
    toTransfers?: FileTransferListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    password?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    isApproved?: SortOrder
    inventoryHash?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastInventorySync?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    displayName?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    refreshToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    isApproved?: BoolWithAggregatesFilter<"User"> | boolean
    inventoryHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastInventorySync?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type PluginWhereInput = {
    AND?: PluginWhereInput | PluginWhereInput[]
    OR?: PluginWhereInput[]
    NOT?: PluginWhereInput | PluginWhereInput[]
    id?: StringFilter<"Plugin"> | string
    name?: StringFilter<"Plugin"> | string
    description?: StringNullableFilter<"Plugin"> | string | null
    version?: StringFilter<"Plugin"> | string
    createdAt?: DateTimeFilter<"Plugin"> | Date | string
    updatedAt?: DateTimeFilter<"Plugin"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Plugin"> | Date | string | null
    userPlugins?: UserPluginListRelationFilter
  }

  export type PluginOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    userPlugins?: UserPluginOrderByRelationAggregateInput
    _relevance?: PluginOrderByRelevanceInput
  }

  export type PluginWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PluginWhereInput | PluginWhereInput[]
    OR?: PluginWhereInput[]
    NOT?: PluginWhereInput | PluginWhereInput[]
    name?: StringFilter<"Plugin"> | string
    description?: StringNullableFilter<"Plugin"> | string | null
    version?: StringFilter<"Plugin"> | string
    createdAt?: DateTimeFilter<"Plugin"> | Date | string
    updatedAt?: DateTimeFilter<"Plugin"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Plugin"> | Date | string | null
    userPlugins?: UserPluginListRelationFilter
  }, "id">

  export type PluginOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: PluginCountOrderByAggregateInput
    _max?: PluginMaxOrderByAggregateInput
    _min?: PluginMinOrderByAggregateInput
  }

  export type PluginScalarWhereWithAggregatesInput = {
    AND?: PluginScalarWhereWithAggregatesInput | PluginScalarWhereWithAggregatesInput[]
    OR?: PluginScalarWhereWithAggregatesInput[]
    NOT?: PluginScalarWhereWithAggregatesInput | PluginScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Plugin"> | string
    name?: StringWithAggregatesFilter<"Plugin"> | string
    description?: StringNullableWithAggregatesFilter<"Plugin"> | string | null
    version?: StringWithAggregatesFilter<"Plugin"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Plugin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Plugin"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Plugin"> | Date | string | null
  }

  export type DeviceWhereInput = {
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    id?: StringFilter<"Device"> | string
    userId?: StringFilter<"Device"> | string
    name?: StringFilter<"Device"> | string
    type?: StringFilter<"Device"> | string
    info?: StringNullableFilter<"Device"> | string | null
    lastActiveAt?: DateTimeFilter<"Device"> | Date | string
    isActive?: BoolFilter<"Device"> | boolean
    createdAt?: DateTimeFilter<"Device"> | Date | string
    updatedAt?: DateTimeFilter<"Device"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type DeviceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    info?: SortOrderInput | SortOrder
    lastActiveAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: DeviceOrderByRelevanceInput
  }

  export type DeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    userId?: StringFilter<"Device"> | string
    name?: StringFilter<"Device"> | string
    type?: StringFilter<"Device"> | string
    info?: StringNullableFilter<"Device"> | string | null
    lastActiveAt?: DateTimeFilter<"Device"> | Date | string
    isActive?: BoolFilter<"Device"> | boolean
    createdAt?: DateTimeFilter<"Device"> | Date | string
    updatedAt?: DateTimeFilter<"Device"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type DeviceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    info?: SortOrderInput | SortOrder
    lastActiveAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeviceCountOrderByAggregateInput
    _max?: DeviceMaxOrderByAggregateInput
    _min?: DeviceMinOrderByAggregateInput
  }

  export type DeviceScalarWhereWithAggregatesInput = {
    AND?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    OR?: DeviceScalarWhereWithAggregatesInput[]
    NOT?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Device"> | string
    userId?: StringWithAggregatesFilter<"Device"> | string
    name?: StringWithAggregatesFilter<"Device"> | string
    type?: StringWithAggregatesFilter<"Device"> | string
    info?: StringNullableWithAggregatesFilter<"Device"> | string | null
    lastActiveAt?: DateTimeWithAggregatesFilter<"Device"> | Date | string
    isActive?: BoolWithAggregatesFilter<"Device"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Device"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Device"> | Date | string
  }

  export type UserPluginWhereInput = {
    AND?: UserPluginWhereInput | UserPluginWhereInput[]
    OR?: UserPluginWhereInput[]
    NOT?: UserPluginWhereInput | UserPluginWhereInput[]
    id?: StringFilter<"UserPlugin"> | string
    userId?: StringFilter<"UserPlugin"> | string
    pluginId?: StringFilter<"UserPlugin"> | string
    isActive?: BoolFilter<"UserPlugin"> | boolean
    createdAt?: DateTimeFilter<"UserPlugin"> | Date | string
    updatedAt?: DateTimeFilter<"UserPlugin"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    plugin?: XOR<PluginRelationFilter, PluginWhereInput>
  }

  export type UserPluginOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    pluginId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    plugin?: PluginOrderByWithRelationInput
    _relevance?: UserPluginOrderByRelevanceInput
  }

  export type UserPluginWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_pluginId?: UserPluginUserIdPluginIdCompoundUniqueInput
    AND?: UserPluginWhereInput | UserPluginWhereInput[]
    OR?: UserPluginWhereInput[]
    NOT?: UserPluginWhereInput | UserPluginWhereInput[]
    userId?: StringFilter<"UserPlugin"> | string
    pluginId?: StringFilter<"UserPlugin"> | string
    isActive?: BoolFilter<"UserPlugin"> | boolean
    createdAt?: DateTimeFilter<"UserPlugin"> | Date | string
    updatedAt?: DateTimeFilter<"UserPlugin"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    plugin?: XOR<PluginRelationFilter, PluginWhereInput>
  }, "id" | "userId_pluginId">

  export type UserPluginOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    pluginId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserPluginCountOrderByAggregateInput
    _max?: UserPluginMaxOrderByAggregateInput
    _min?: UserPluginMinOrderByAggregateInput
  }

  export type UserPluginScalarWhereWithAggregatesInput = {
    AND?: UserPluginScalarWhereWithAggregatesInput | UserPluginScalarWhereWithAggregatesInput[]
    OR?: UserPluginScalarWhereWithAggregatesInput[]
    NOT?: UserPluginScalarWhereWithAggregatesInput | UserPluginScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserPlugin"> | string
    userId?: StringWithAggregatesFilter<"UserPlugin"> | string
    pluginId?: StringWithAggregatesFilter<"UserPlugin"> | string
    isActive?: BoolWithAggregatesFilter<"UserPlugin"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UserPlugin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserPlugin"> | Date | string
  }

  export type UserPresenceWhereInput = {
    AND?: UserPresenceWhereInput | UserPresenceWhereInput[]
    OR?: UserPresenceWhereInput[]
    NOT?: UserPresenceWhereInput | UserPresenceWhereInput[]
    id?: StringFilter<"UserPresence"> | string
    userId?: StringFilter<"UserPresence"> | string
    projectId?: StringNullableFilter<"UserPresence"> | string | null
    status?: StringFilter<"UserPresence"> | string
    expiresAt?: DateTimeFilter<"UserPresence"> | Date | string
    lastSeen?: DateTimeFilter<"UserPresence"> | Date | string
    createdAt?: DateTimeFilter<"UserPresence"> | Date | string
    updatedAt?: DateTimeFilter<"UserPresence"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserPresenceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: UserPresenceOrderByRelevanceInput
  }

  export type UserPresenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_projectId?: UserPresenceUserIdProjectIdCompoundUniqueInput
    AND?: UserPresenceWhereInput | UserPresenceWhereInput[]
    OR?: UserPresenceWhereInput[]
    NOT?: UserPresenceWhereInput | UserPresenceWhereInput[]
    userId?: StringFilter<"UserPresence"> | string
    projectId?: StringNullableFilter<"UserPresence"> | string | null
    status?: StringFilter<"UserPresence"> | string
    expiresAt?: DateTimeFilter<"UserPresence"> | Date | string
    lastSeen?: DateTimeFilter<"UserPresence"> | Date | string
    createdAt?: DateTimeFilter<"UserPresence"> | Date | string
    updatedAt?: DateTimeFilter<"UserPresence"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_projectId">

  export type UserPresenceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserPresenceCountOrderByAggregateInput
    _max?: UserPresenceMaxOrderByAggregateInput
    _min?: UserPresenceMinOrderByAggregateInput
  }

  export type UserPresenceScalarWhereWithAggregatesInput = {
    AND?: UserPresenceScalarWhereWithAggregatesInput | UserPresenceScalarWhereWithAggregatesInput[]
    OR?: UserPresenceScalarWhereWithAggregatesInput[]
    NOT?: UserPresenceScalarWhereWithAggregatesInput | UserPresenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserPresence"> | string
    userId?: StringWithAggregatesFilter<"UserPresence"> | string
    projectId?: StringNullableWithAggregatesFilter<"UserPresence"> | string | null
    status?: StringWithAggregatesFilter<"UserPresence"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"UserPresence"> | Date | string
    lastSeen?: DateTimeWithAggregatesFilter<"UserPresence"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UserPresence"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserPresence"> | Date | string
  }

  export type ActivityLogWhereInput = {
    AND?: ActivityLogWhereInput | ActivityLogWhereInput[]
    OR?: ActivityLogWhereInput[]
    NOT?: ActivityLogWhereInput | ActivityLogWhereInput[]
    id?: StringFilter<"ActivityLog"> | string
    userId?: StringFilter<"ActivityLog"> | string
    action?: StringFilter<"ActivityLog"> | string
    entityType?: StringFilter<"ActivityLog"> | string
    entityId?: StringFilter<"ActivityLog"> | string
    projectId?: StringNullableFilter<"ActivityLog"> | string | null
    metadata?: StringNullableFilter<"ActivityLog"> | string | null
    ipAddress?: StringNullableFilter<"ActivityLog"> | string | null
    userAgent?: StringNullableFilter<"ActivityLog"> | string | null
    createdAt?: DateTimeFilter<"ActivityLog"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    project?: XOR<ProjectNullableRelationFilter, ProjectWhereInput> | null
  }

  export type ActivityLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
    _relevance?: ActivityLogOrderByRelevanceInput
  }

  export type ActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActivityLogWhereInput | ActivityLogWhereInput[]
    OR?: ActivityLogWhereInput[]
    NOT?: ActivityLogWhereInput | ActivityLogWhereInput[]
    userId?: StringFilter<"ActivityLog"> | string
    action?: StringFilter<"ActivityLog"> | string
    entityType?: StringFilter<"ActivityLog"> | string
    entityId?: StringFilter<"ActivityLog"> | string
    projectId?: StringNullableFilter<"ActivityLog"> | string | null
    metadata?: StringNullableFilter<"ActivityLog"> | string | null
    ipAddress?: StringNullableFilter<"ActivityLog"> | string | null
    userAgent?: StringNullableFilter<"ActivityLog"> | string | null
    createdAt?: DateTimeFilter<"ActivityLog"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    project?: XOR<ProjectNullableRelationFilter, ProjectWhereInput> | null
  }, "id">

  export type ActivityLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ActivityLogCountOrderByAggregateInput
    _max?: ActivityLogMaxOrderByAggregateInput
    _min?: ActivityLogMinOrderByAggregateInput
  }

  export type ActivityLogScalarWhereWithAggregatesInput = {
    AND?: ActivityLogScalarWhereWithAggregatesInput | ActivityLogScalarWhereWithAggregatesInput[]
    OR?: ActivityLogScalarWhereWithAggregatesInput[]
    NOT?: ActivityLogScalarWhereWithAggregatesInput | ActivityLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActivityLog"> | string
    userId?: StringWithAggregatesFilter<"ActivityLog"> | string
    action?: StringWithAggregatesFilter<"ActivityLog"> | string
    entityType?: StringWithAggregatesFilter<"ActivityLog"> | string
    entityId?: StringWithAggregatesFilter<"ActivityLog"> | string
    projectId?: StringNullableWithAggregatesFilter<"ActivityLog"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"ActivityLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"ActivityLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"ActivityLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ActivityLog"> | Date | string
  }

  export type CrashReportWhereInput = {
    AND?: CrashReportWhereInput | CrashReportWhereInput[]
    OR?: CrashReportWhereInput[]
    NOT?: CrashReportWhereInput | CrashReportWhereInput[]
    id?: StringFilter<"CrashReport"> | string
    userId?: StringFilter<"CrashReport"> | string
    error?: StringFilter<"CrashReport"> | string
    stackTrace?: StringFilter<"CrashReport"> | string
    stack?: StringNullableFilter<"CrashReport"> | string | null
    breadcrumbs?: StringNullableFilter<"CrashReport"> | string | null
    context?: StringNullableFilter<"CrashReport"> | string | null
    projectId?: StringNullableFilter<"CrashReport"> | string | null
    metadata?: StringNullableFilter<"CrashReport"> | string | null
    createdAt?: DateTimeFilter<"CrashReport"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type CrashReportOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    error?: SortOrder
    stackTrace?: SortOrder
    stack?: SortOrderInput | SortOrder
    breadcrumbs?: SortOrderInput | SortOrder
    context?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: CrashReportOrderByRelevanceInput
  }

  export type CrashReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CrashReportWhereInput | CrashReportWhereInput[]
    OR?: CrashReportWhereInput[]
    NOT?: CrashReportWhereInput | CrashReportWhereInput[]
    userId?: StringFilter<"CrashReport"> | string
    error?: StringFilter<"CrashReport"> | string
    stackTrace?: StringFilter<"CrashReport"> | string
    stack?: StringNullableFilter<"CrashReport"> | string | null
    breadcrumbs?: StringNullableFilter<"CrashReport"> | string | null
    context?: StringNullableFilter<"CrashReport"> | string | null
    projectId?: StringNullableFilter<"CrashReport"> | string | null
    metadata?: StringNullableFilter<"CrashReport"> | string | null
    createdAt?: DateTimeFilter<"CrashReport"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type CrashReportOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    error?: SortOrder
    stackTrace?: SortOrder
    stack?: SortOrderInput | SortOrder
    breadcrumbs?: SortOrderInput | SortOrder
    context?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CrashReportCountOrderByAggregateInput
    _max?: CrashReportMaxOrderByAggregateInput
    _min?: CrashReportMinOrderByAggregateInput
  }

  export type CrashReportScalarWhereWithAggregatesInput = {
    AND?: CrashReportScalarWhereWithAggregatesInput | CrashReportScalarWhereWithAggregatesInput[]
    OR?: CrashReportScalarWhereWithAggregatesInput[]
    NOT?: CrashReportScalarWhereWithAggregatesInput | CrashReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CrashReport"> | string
    userId?: StringWithAggregatesFilter<"CrashReport"> | string
    error?: StringWithAggregatesFilter<"CrashReport"> | string
    stackTrace?: StringWithAggregatesFilter<"CrashReport"> | string
    stack?: StringNullableWithAggregatesFilter<"CrashReport"> | string | null
    breadcrumbs?: StringNullableWithAggregatesFilter<"CrashReport"> | string | null
    context?: StringNullableWithAggregatesFilter<"CrashReport"> | string | null
    projectId?: StringNullableWithAggregatesFilter<"CrashReport"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"CrashReport"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CrashReport"> | Date | string
  }

  export type WebRtcMetricWhereInput = {
    AND?: WebRtcMetricWhereInput | WebRtcMetricWhereInput[]
    OR?: WebRtcMetricWhereInput[]
    NOT?: WebRtcMetricWhereInput | WebRtcMetricWhereInput[]
    id?: StringFilter<"WebRtcMetric"> | string
    userId?: StringFilter<"WebRtcMetric"> | string
    projectId?: StringNullableFilter<"WebRtcMetric"> | string | null
    metricType?: StringFilter<"WebRtcMetric"> | string
    value?: FloatFilter<"WebRtcMetric"> | number
    peerConnectionId?: StringNullableFilter<"WebRtcMetric"> | string | null
    rttMs?: FloatNullableFilter<"WebRtcMetric"> | number | null
    jitterMs?: FloatNullableFilter<"WebRtcMetric"> | number | null
    packetLoss?: FloatNullableFilter<"WebRtcMetric"> | number | null
    networkType?: StringNullableFilter<"WebRtcMetric"> | string | null
    effectiveType?: StringNullableFilter<"WebRtcMetric"> | string | null
    downlinkMbps?: FloatNullableFilter<"WebRtcMetric"> | number | null
    iceCandidatePairId?: StringNullableFilter<"WebRtcMetric"> | string | null
    localCandidateId?: StringNullableFilter<"WebRtcMetric"> | string | null
    remoteCandidateId?: StringNullableFilter<"WebRtcMetric"> | string | null
    timestamp?: DateTimeFilter<"WebRtcMetric"> | Date | string
    metadata?: StringNullableFilter<"WebRtcMetric"> | string | null
    createdAt?: DateTimeFilter<"WebRtcMetric"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type WebRtcMetricOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    metricType?: SortOrder
    value?: SortOrder
    peerConnectionId?: SortOrderInput | SortOrder
    rttMs?: SortOrderInput | SortOrder
    jitterMs?: SortOrderInput | SortOrder
    packetLoss?: SortOrderInput | SortOrder
    networkType?: SortOrderInput | SortOrder
    effectiveType?: SortOrderInput | SortOrder
    downlinkMbps?: SortOrderInput | SortOrder
    iceCandidatePairId?: SortOrderInput | SortOrder
    localCandidateId?: SortOrderInput | SortOrder
    remoteCandidateId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: WebRtcMetricOrderByRelevanceInput
  }

  export type WebRtcMetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WebRtcMetricWhereInput | WebRtcMetricWhereInput[]
    OR?: WebRtcMetricWhereInput[]
    NOT?: WebRtcMetricWhereInput | WebRtcMetricWhereInput[]
    userId?: StringFilter<"WebRtcMetric"> | string
    projectId?: StringNullableFilter<"WebRtcMetric"> | string | null
    metricType?: StringFilter<"WebRtcMetric"> | string
    value?: FloatFilter<"WebRtcMetric"> | number
    peerConnectionId?: StringNullableFilter<"WebRtcMetric"> | string | null
    rttMs?: FloatNullableFilter<"WebRtcMetric"> | number | null
    jitterMs?: FloatNullableFilter<"WebRtcMetric"> | number | null
    packetLoss?: FloatNullableFilter<"WebRtcMetric"> | number | null
    networkType?: StringNullableFilter<"WebRtcMetric"> | string | null
    effectiveType?: StringNullableFilter<"WebRtcMetric"> | string | null
    downlinkMbps?: FloatNullableFilter<"WebRtcMetric"> | number | null
    iceCandidatePairId?: StringNullableFilter<"WebRtcMetric"> | string | null
    localCandidateId?: StringNullableFilter<"WebRtcMetric"> | string | null
    remoteCandidateId?: StringNullableFilter<"WebRtcMetric"> | string | null
    timestamp?: DateTimeFilter<"WebRtcMetric"> | Date | string
    metadata?: StringNullableFilter<"WebRtcMetric"> | string | null
    createdAt?: DateTimeFilter<"WebRtcMetric"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type WebRtcMetricOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    metricType?: SortOrder
    value?: SortOrder
    peerConnectionId?: SortOrderInput | SortOrder
    rttMs?: SortOrderInput | SortOrder
    jitterMs?: SortOrderInput | SortOrder
    packetLoss?: SortOrderInput | SortOrder
    networkType?: SortOrderInput | SortOrder
    effectiveType?: SortOrderInput | SortOrder
    downlinkMbps?: SortOrderInput | SortOrder
    iceCandidatePairId?: SortOrderInput | SortOrder
    localCandidateId?: SortOrderInput | SortOrder
    remoteCandidateId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WebRtcMetricCountOrderByAggregateInput
    _avg?: WebRtcMetricAvgOrderByAggregateInput
    _max?: WebRtcMetricMaxOrderByAggregateInput
    _min?: WebRtcMetricMinOrderByAggregateInput
    _sum?: WebRtcMetricSumOrderByAggregateInput
  }

  export type WebRtcMetricScalarWhereWithAggregatesInput = {
    AND?: WebRtcMetricScalarWhereWithAggregatesInput | WebRtcMetricScalarWhereWithAggregatesInput[]
    OR?: WebRtcMetricScalarWhereWithAggregatesInput[]
    NOT?: WebRtcMetricScalarWhereWithAggregatesInput | WebRtcMetricScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WebRtcMetric"> | string
    userId?: StringWithAggregatesFilter<"WebRtcMetric"> | string
    projectId?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    metricType?: StringWithAggregatesFilter<"WebRtcMetric"> | string
    value?: FloatWithAggregatesFilter<"WebRtcMetric"> | number
    peerConnectionId?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    rttMs?: FloatNullableWithAggregatesFilter<"WebRtcMetric"> | number | null
    jitterMs?: FloatNullableWithAggregatesFilter<"WebRtcMetric"> | number | null
    packetLoss?: FloatNullableWithAggregatesFilter<"WebRtcMetric"> | number | null
    networkType?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    effectiveType?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    downlinkMbps?: FloatNullableWithAggregatesFilter<"WebRtcMetric"> | number | null
    iceCandidatePairId?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    localCandidateId?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    remoteCandidateId?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"WebRtcMetric"> | Date | string
    metadata?: StringNullableWithAggregatesFilter<"WebRtcMetric"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WebRtcMetric"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    isPublic?: BoolFilter<"Project"> | boolean
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Project"> | Date | string | null
    snapshots?: SnapshotListRelationFilter
    activityLogs?: ActivityLogListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    snapshots?: SnapshotOrderByRelationAggregateInput
    activityLogs?: ActivityLogOrderByRelationAggregateInput
    _relevance?: ProjectOrderByRelevanceInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    isPublic?: BoolFilter<"Project"> | boolean
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Project"> | Date | string | null
    snapshots?: SnapshotListRelationFilter
    activityLogs?: ActivityLogListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    isPublic?: BoolWithAggregatesFilter<"Project"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null
  }

  export type SnapshotWhereInput = {
    AND?: SnapshotWhereInput | SnapshotWhereInput[]
    OR?: SnapshotWhereInput[]
    NOT?: SnapshotWhereInput | SnapshotWhereInput[]
    id?: StringFilter<"Snapshot"> | string
    projectId?: StringFilter<"Snapshot"> | string
    name?: StringFilter<"Snapshot"> | string
    description?: StringNullableFilter<"Snapshot"> | string | null
    data?: StringFilter<"Snapshot"> | string
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
    updatedAt?: DateTimeFilter<"Snapshot"> | Date | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    tags?: EntityTagListRelationFilter
  }

  export type SnapshotOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    tags?: EntityTagOrderByRelationAggregateInput
    _relevance?: SnapshotOrderByRelevanceInput
  }

  export type SnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SnapshotWhereInput | SnapshotWhereInput[]
    OR?: SnapshotWhereInput[]
    NOT?: SnapshotWhereInput | SnapshotWhereInput[]
    projectId?: StringFilter<"Snapshot"> | string
    name?: StringFilter<"Snapshot"> | string
    description?: StringNullableFilter<"Snapshot"> | string | null
    data?: StringFilter<"Snapshot"> | string
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
    updatedAt?: DateTimeFilter<"Snapshot"> | Date | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    tags?: EntityTagListRelationFilter
  }, "id">

  export type SnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SnapshotCountOrderByAggregateInput
    _max?: SnapshotMaxOrderByAggregateInput
    _min?: SnapshotMinOrderByAggregateInput
  }

  export type SnapshotScalarWhereWithAggregatesInput = {
    AND?: SnapshotScalarWhereWithAggregatesInput | SnapshotScalarWhereWithAggregatesInput[]
    OR?: SnapshotScalarWhereWithAggregatesInput[]
    NOT?: SnapshotScalarWhereWithAggregatesInput | SnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Snapshot"> | string
    projectId?: StringWithAggregatesFilter<"Snapshot"> | string
    name?: StringWithAggregatesFilter<"Snapshot"> | string
    description?: StringNullableWithAggregatesFilter<"Snapshot"> | string | null
    data?: StringWithAggregatesFilter<"Snapshot"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Snapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Snapshot"> | Date | string
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: StringFilter<"Tag"> | string
    name?: StringFilter<"Tag"> | string
    description?: StringNullableFilter<"Tag"> | string | null
    color?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    entityTags?: EntityTagListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    entityTags?: EntityTagOrderByRelationAggregateInput
    _relevance?: TagOrderByRelevanceInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    description?: StringNullableFilter<"Tag"> | string | null
    color?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    entityTags?: EntityTagListRelationFilter
  }, "id" | "name">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tag"> | string
    name?: StringWithAggregatesFilter<"Tag"> | string
    description?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    color?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
  }

  export type EntityTagWhereInput = {
    AND?: EntityTagWhereInput | EntityTagWhereInput[]
    OR?: EntityTagWhereInput[]
    NOT?: EntityTagWhereInput | EntityTagWhereInput[]
    id?: StringFilter<"EntityTag"> | string
    entityType?: StringFilter<"EntityTag"> | string
    entityId?: StringFilter<"EntityTag"> | string
    tagId?: StringFilter<"EntityTag"> | string
    snapshotId?: StringNullableFilter<"EntityTag"> | string | null
    createdAt?: DateTimeFilter<"EntityTag"> | Date | string
    tag?: XOR<TagRelationFilter, TagWhereInput>
    snapshot?: XOR<SnapshotNullableRelationFilter, SnapshotWhereInput> | null
  }

  export type EntityTagOrderByWithRelationInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    tagId?: SortOrder
    snapshotId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tag?: TagOrderByWithRelationInput
    snapshot?: SnapshotOrderByWithRelationInput
    _relevance?: EntityTagOrderByRelevanceInput
  }

  export type EntityTagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entityType_entityId_tagId?: EntityTagEntityTypeEntityIdTagIdCompoundUniqueInput
    AND?: EntityTagWhereInput | EntityTagWhereInput[]
    OR?: EntityTagWhereInput[]
    NOT?: EntityTagWhereInput | EntityTagWhereInput[]
    entityType?: StringFilter<"EntityTag"> | string
    entityId?: StringFilter<"EntityTag"> | string
    tagId?: StringFilter<"EntityTag"> | string
    snapshotId?: StringNullableFilter<"EntityTag"> | string | null
    createdAt?: DateTimeFilter<"EntityTag"> | Date | string
    tag?: XOR<TagRelationFilter, TagWhereInput>
    snapshot?: XOR<SnapshotNullableRelationFilter, SnapshotWhereInput> | null
  }, "id" | "entityType_entityId_tagId">

  export type EntityTagOrderByWithAggregationInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    tagId?: SortOrder
    snapshotId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: EntityTagCountOrderByAggregateInput
    _max?: EntityTagMaxOrderByAggregateInput
    _min?: EntityTagMinOrderByAggregateInput
  }

  export type EntityTagScalarWhereWithAggregatesInput = {
    AND?: EntityTagScalarWhereWithAggregatesInput | EntityTagScalarWhereWithAggregatesInput[]
    OR?: EntityTagScalarWhereWithAggregatesInput[]
    NOT?: EntityTagScalarWhereWithAggregatesInput | EntityTagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EntityTag"> | string
    entityType?: StringWithAggregatesFilter<"EntityTag"> | string
    entityId?: StringWithAggregatesFilter<"EntityTag"> | string
    tagId?: StringWithAggregatesFilter<"EntityTag"> | string
    snapshotId?: StringNullableWithAggregatesFilter<"EntityTag"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EntityTag"> | Date | string
  }

  export type FileTransferWhereInput = {
    AND?: FileTransferWhereInput | FileTransferWhereInput[]
    OR?: FileTransferWhereInput[]
    NOT?: FileTransferWhereInput | FileTransferWhereInput[]
    id?: StringFilter<"FileTransfer"> | string
    fileName?: StringFilter<"FileTransfer"> | string
    size?: IntFilter<"FileTransfer"> | number
    mimeType?: StringFilter<"FileTransfer"> | string
    fromUserId?: StringFilter<"FileTransfer"> | string
    toUserId?: StringFilter<"FileTransfer"> | string
    status?: StringFilter<"FileTransfer"> | string
    progress?: IntFilter<"FileTransfer"> | number
    fileKey?: StringNullableFilter<"FileTransfer"> | string | null
    createdAt?: DateTimeFilter<"FileTransfer"> | Date | string
    updatedAt?: DateTimeFilter<"FileTransfer"> | Date | string
    fromUser?: XOR<UserRelationFilter, UserWhereInput>
    toUser?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type FileTransferOrderByWithRelationInput = {
    id?: SortOrder
    fileName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    fileKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fromUser?: UserOrderByWithRelationInput
    toUser?: UserOrderByWithRelationInput
    _relevance?: FileTransferOrderByRelevanceInput
  }

  export type FileTransferWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileTransferWhereInput | FileTransferWhereInput[]
    OR?: FileTransferWhereInput[]
    NOT?: FileTransferWhereInput | FileTransferWhereInput[]
    fileName?: StringFilter<"FileTransfer"> | string
    size?: IntFilter<"FileTransfer"> | number
    mimeType?: StringFilter<"FileTransfer"> | string
    fromUserId?: StringFilter<"FileTransfer"> | string
    toUserId?: StringFilter<"FileTransfer"> | string
    status?: StringFilter<"FileTransfer"> | string
    progress?: IntFilter<"FileTransfer"> | number
    fileKey?: StringNullableFilter<"FileTransfer"> | string | null
    createdAt?: DateTimeFilter<"FileTransfer"> | Date | string
    updatedAt?: DateTimeFilter<"FileTransfer"> | Date | string
    fromUser?: XOR<UserRelationFilter, UserWhereInput>
    toUser?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type FileTransferOrderByWithAggregationInput = {
    id?: SortOrder
    fileName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    fileKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FileTransferCountOrderByAggregateInput
    _avg?: FileTransferAvgOrderByAggregateInput
    _max?: FileTransferMaxOrderByAggregateInput
    _min?: FileTransferMinOrderByAggregateInput
    _sum?: FileTransferSumOrderByAggregateInput
  }

  export type FileTransferScalarWhereWithAggregatesInput = {
    AND?: FileTransferScalarWhereWithAggregatesInput | FileTransferScalarWhereWithAggregatesInput[]
    OR?: FileTransferScalarWhereWithAggregatesInput[]
    NOT?: FileTransferScalarWhereWithAggregatesInput | FileTransferScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileTransfer"> | string
    fileName?: StringWithAggregatesFilter<"FileTransfer"> | string
    size?: IntWithAggregatesFilter<"FileTransfer"> | number
    mimeType?: StringWithAggregatesFilter<"FileTransfer"> | string
    fromUserId?: StringWithAggregatesFilter<"FileTransfer"> | string
    toUserId?: StringWithAggregatesFilter<"FileTransfer"> | string
    status?: StringWithAggregatesFilter<"FileTransfer"> | string
    progress?: IntWithAggregatesFilter<"FileTransfer"> | number
    fileKey?: StringNullableWithAggregatesFilter<"FileTransfer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FileTransfer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FileTransfer"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PluginCreateInput = {
    id?: string
    name: string
    description?: string | null
    version: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutPluginInput
  }

  export type PluginUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    version: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutPluginInput
  }

  export type PluginUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutPluginNestedInput
  }

  export type PluginUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutPluginNestedInput
  }

  export type PluginCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    version: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PluginUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PluginUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeviceCreateInput = {
    id?: string
    name: string
    type: string
    info?: string | null
    lastActiveAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDevicesInput
  }

  export type DeviceUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    type: string
    info?: string | null
    lastActiveAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    info?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type DeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    info?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceCreateManyInput = {
    id?: string
    userId: string
    name: string
    type: string
    info?: string | null
    lastActiveAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    info?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    info?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPluginCreateInput = {
    id?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserPluginsInput
    plugin: PluginCreateNestedOneWithoutUserPluginsInput
  }

  export type UserPluginUncheckedCreateInput = {
    id?: string
    userId: string
    pluginId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPluginUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserPluginsNestedInput
    plugin?: PluginUpdateOneRequiredWithoutUserPluginsNestedInput
  }

  export type UserPluginUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    pluginId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPluginCreateManyInput = {
    id?: string
    userId: string
    pluginId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPluginUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPluginUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    pluginId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPresenceCreateInput = {
    id?: string
    projectId?: string | null
    status: string
    expiresAt: Date | string
    lastSeen?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPresenceInput
  }

  export type UserPresenceUncheckedCreateInput = {
    id?: string
    userId: string
    projectId?: string | null
    status: string
    expiresAt: Date | string
    lastSeen?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPresenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPresenceNestedInput
  }

  export type UserPresenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPresenceCreateManyInput = {
    id?: string
    userId: string
    projectId?: string | null
    status: string
    expiresAt: Date | string
    lastSeen?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPresenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPresenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogCreateInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutActivityLogsInput
    project?: ProjectCreateNestedOneWithoutActivityLogsInput
  }

  export type ActivityLogUncheckedCreateInput = {
    id?: string
    userId: string
    action: string
    entityType: string
    entityId: string
    projectId?: string | null
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ActivityLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActivityLogsNestedInput
    project?: ProjectUpdateOneWithoutActivityLogsNestedInput
  }

  export type ActivityLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogCreateManyInput = {
    id?: string
    userId: string
    action: string
    entityType: string
    entityId: string
    projectId?: string | null
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ActivityLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashReportCreateInput = {
    id?: string
    error: string
    stackTrace: string
    stack?: string | null
    breadcrumbs?: string | null
    context?: string | null
    projectId?: string | null
    metadata?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCrashReportsInput
  }

  export type CrashReportUncheckedCreateInput = {
    id?: string
    userId: string
    error: string
    stackTrace: string
    stack?: string | null
    breadcrumbs?: string | null
    context?: string | null
    projectId?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type CrashReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    error?: StringFieldUpdateOperationsInput | string
    stackTrace?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    breadcrumbs?: NullableStringFieldUpdateOperationsInput | string | null
    context?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCrashReportsNestedInput
  }

  export type CrashReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    error?: StringFieldUpdateOperationsInput | string
    stackTrace?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    breadcrumbs?: NullableStringFieldUpdateOperationsInput | string | null
    context?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashReportCreateManyInput = {
    id?: string
    userId: string
    error: string
    stackTrace: string
    stack?: string | null
    breadcrumbs?: string | null
    context?: string | null
    projectId?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type CrashReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    error?: StringFieldUpdateOperationsInput | string
    stackTrace?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    breadcrumbs?: NullableStringFieldUpdateOperationsInput | string | null
    context?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    error?: StringFieldUpdateOperationsInput | string
    stackTrace?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    breadcrumbs?: NullableStringFieldUpdateOperationsInput | string | null
    context?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebRtcMetricCreateInput = {
    id?: string
    projectId?: string | null
    metricType: string
    value: number
    peerConnectionId?: string | null
    rttMs?: number | null
    jitterMs?: number | null
    packetLoss?: number | null
    networkType?: string | null
    effectiveType?: string | null
    downlinkMbps?: number | null
    iceCandidatePairId?: string | null
    localCandidateId?: string | null
    remoteCandidateId?: string | null
    timestamp: Date | string
    metadata?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutWebRtcMetricsInput
  }

  export type WebRtcMetricUncheckedCreateInput = {
    id?: string
    userId: string
    projectId?: string | null
    metricType: string
    value: number
    peerConnectionId?: string | null
    rttMs?: number | null
    jitterMs?: number | null
    packetLoss?: number | null
    networkType?: string | null
    effectiveType?: string | null
    downlinkMbps?: number | null
    iceCandidatePairId?: string | null
    localCandidateId?: string | null
    remoteCandidateId?: string | null
    timestamp: Date | string
    metadata?: string | null
    createdAt?: Date | string
  }

  export type WebRtcMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metricType?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    peerConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    rttMs?: NullableFloatFieldUpdateOperationsInput | number | null
    jitterMs?: NullableFloatFieldUpdateOperationsInput | number | null
    packetLoss?: NullableFloatFieldUpdateOperationsInput | number | null
    networkType?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveType?: NullableStringFieldUpdateOperationsInput | string | null
    downlinkMbps?: NullableFloatFieldUpdateOperationsInput | number | null
    iceCandidatePairId?: NullableStringFieldUpdateOperationsInput | string | null
    localCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    remoteCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWebRtcMetricsNestedInput
  }

  export type WebRtcMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metricType?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    peerConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    rttMs?: NullableFloatFieldUpdateOperationsInput | number | null
    jitterMs?: NullableFloatFieldUpdateOperationsInput | number | null
    packetLoss?: NullableFloatFieldUpdateOperationsInput | number | null
    networkType?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveType?: NullableStringFieldUpdateOperationsInput | string | null
    downlinkMbps?: NullableFloatFieldUpdateOperationsInput | number | null
    iceCandidatePairId?: NullableStringFieldUpdateOperationsInput | string | null
    localCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    remoteCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebRtcMetricCreateManyInput = {
    id?: string
    userId: string
    projectId?: string | null
    metricType: string
    value: number
    peerConnectionId?: string | null
    rttMs?: number | null
    jitterMs?: number | null
    packetLoss?: number | null
    networkType?: string | null
    effectiveType?: string | null
    downlinkMbps?: number | null
    iceCandidatePairId?: string | null
    localCandidateId?: string | null
    remoteCandidateId?: string | null
    timestamp: Date | string
    metadata?: string | null
    createdAt?: Date | string
  }

  export type WebRtcMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metricType?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    peerConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    rttMs?: NullableFloatFieldUpdateOperationsInput | number | null
    jitterMs?: NullableFloatFieldUpdateOperationsInput | number | null
    packetLoss?: NullableFloatFieldUpdateOperationsInput | number | null
    networkType?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveType?: NullableStringFieldUpdateOperationsInput | string | null
    downlinkMbps?: NullableFloatFieldUpdateOperationsInput | number | null
    iceCandidatePairId?: NullableStringFieldUpdateOperationsInput | string | null
    localCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    remoteCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebRtcMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metricType?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    peerConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    rttMs?: NullableFloatFieldUpdateOperationsInput | number | null
    jitterMs?: NullableFloatFieldUpdateOperationsInput | number | null
    packetLoss?: NullableFloatFieldUpdateOperationsInput | number | null
    networkType?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveType?: NullableStringFieldUpdateOperationsInput | string | null
    downlinkMbps?: NullableFloatFieldUpdateOperationsInput | number | null
    iceCandidatePairId?: NullableStringFieldUpdateOperationsInput | string | null
    localCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    remoteCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    snapshots?: SnapshotCreateNestedManyWithoutProjectInput
    activityLogs?: ActivityLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutProjectInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    snapshots?: SnapshotUpdateManyWithoutProjectNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    snapshots?: SnapshotUncheckedUpdateManyWithoutProjectNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SnapshotCreateInput = {
    id?: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutSnapshotsInput
    tags?: EntityTagCreateNestedManyWithoutSnapshotInput
  }

  export type SnapshotUncheckedCreateInput = {
    id?: string
    projectId: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tags?: EntityTagUncheckedCreateNestedManyWithoutSnapshotInput
  }

  export type SnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutSnapshotsNestedInput
    tags?: EntityTagUpdateManyWithoutSnapshotNestedInput
  }

  export type SnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: EntityTagUncheckedUpdateManyWithoutSnapshotNestedInput
  }

  export type SnapshotCreateManyInput = {
    id?: string
    projectId: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    entityTags?: EntityTagCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    entityTags?: EntityTagUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityTags?: EntityTagUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityTags?: EntityTagUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityTagCreateInput = {
    id?: string
    entityType: string
    entityId: string
    createdAt?: Date | string
    tag: TagCreateNestedOneWithoutEntityTagsInput
    snapshot?: SnapshotCreateNestedOneWithoutTagsInput
  }

  export type EntityTagUncheckedCreateInput = {
    id?: string
    entityType: string
    entityId: string
    tagId: string
    snapshotId?: string | null
    createdAt?: Date | string
  }

  export type EntityTagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: TagUpdateOneRequiredWithoutEntityTagsNestedInput
    snapshot?: SnapshotUpdateOneWithoutTagsNestedInput
  }

  export type EntityTagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    snapshotId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityTagCreateManyInput = {
    id?: string
    entityType: string
    entityId: string
    tagId: string
    snapshotId?: string | null
    createdAt?: Date | string
  }

  export type EntityTagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityTagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    snapshotId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileTransferCreateInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fromUser: UserCreateNestedOneWithoutFromTransfersInput
    toUser: UserCreateNestedOneWithoutToTransfersInput
  }

  export type FileTransferUncheckedCreateInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    fromUserId: string
    toUserId: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileTransferUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromUser?: UserUpdateOneRequiredWithoutFromTransfersNestedInput
    toUser?: UserUpdateOneRequiredWithoutToTransfersNestedInput
  }

  export type FileTransferUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    fromUserId?: StringFieldUpdateOperationsInput | string
    toUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileTransferCreateManyInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    fromUserId: string
    toUserId: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileTransferUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileTransferUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    fromUserId?: StringFieldUpdateOperationsInput | string
    toUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserPluginListRelationFilter = {
    every?: UserPluginWhereInput
    some?: UserPluginWhereInput
    none?: UserPluginWhereInput
  }

  export type UserPresenceListRelationFilter = {
    every?: UserPresenceWhereInput
    some?: UserPresenceWhereInput
    none?: UserPresenceWhereInput
  }

  export type ActivityLogListRelationFilter = {
    every?: ActivityLogWhereInput
    some?: ActivityLogWhereInput
    none?: ActivityLogWhereInput
  }

  export type CrashReportListRelationFilter = {
    every?: CrashReportWhereInput
    some?: CrashReportWhereInput
    none?: CrashReportWhereInput
  }

  export type WebRtcMetricListRelationFilter = {
    every?: WebRtcMetricWhereInput
    some?: WebRtcMetricWhereInput
    none?: WebRtcMetricWhereInput
  }

  export type DeviceListRelationFilter = {
    every?: DeviceWhereInput
    some?: DeviceWhereInput
    none?: DeviceWhereInput
  }

  export type FileTransferListRelationFilter = {
    every?: FileTransferWhereInput
    some?: FileTransferWhereInput
    none?: FileTransferWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserPluginOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserPresenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActivityLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CrashReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WebRtcMetricOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileTransferOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    password?: SortOrder
    refreshToken?: SortOrder
    isApproved?: SortOrder
    inventoryHash?: SortOrder
    lastLoginAt?: SortOrder
    lastInventorySync?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    password?: SortOrder
    refreshToken?: SortOrder
    isApproved?: SortOrder
    inventoryHash?: SortOrder
    lastLoginAt?: SortOrder
    lastInventorySync?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    password?: SortOrder
    refreshToken?: SortOrder
    isApproved?: SortOrder
    inventoryHash?: SortOrder
    lastLoginAt?: SortOrder
    lastInventorySync?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PluginOrderByRelevanceInput = {
    fields: PluginOrderByRelevanceFieldEnum | PluginOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PluginCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PluginMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PluginMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type DeviceOrderByRelevanceInput = {
    fields: DeviceOrderByRelevanceFieldEnum | DeviceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DeviceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    info?: SortOrder
    lastActiveAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    info?: SortOrder
    lastActiveAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeviceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    info?: SortOrder
    lastActiveAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PluginRelationFilter = {
    is?: PluginWhereInput
    isNot?: PluginWhereInput
  }

  export type UserPluginOrderByRelevanceInput = {
    fields: UserPluginOrderByRelevanceFieldEnum | UserPluginOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserPluginUserIdPluginIdCompoundUniqueInput = {
    userId: string
    pluginId: string
  }

  export type UserPluginCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pluginId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPluginMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pluginId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPluginMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    pluginId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPresenceOrderByRelevanceInput = {
    fields: UserPresenceOrderByRelevanceFieldEnum | UserPresenceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserPresenceUserIdProjectIdCompoundUniqueInput = {
    userId: string
    projectId: string
  }

  export type UserPresenceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPresenceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPresenceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectNullableRelationFilter = {
    is?: ProjectWhereInput | null
    isNot?: ProjectWhereInput | null
  }

  export type ActivityLogOrderByRelevanceInput = {
    fields: ActivityLogOrderByRelevanceFieldEnum | ActivityLogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ActivityLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    projectId?: SortOrder
    metadata?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    projectId?: SortOrder
    metadata?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivityLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    projectId?: SortOrder
    metadata?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type CrashReportOrderByRelevanceInput = {
    fields: CrashReportOrderByRelevanceFieldEnum | CrashReportOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CrashReportCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    error?: SortOrder
    stackTrace?: SortOrder
    stack?: SortOrder
    breadcrumbs?: SortOrder
    context?: SortOrder
    projectId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type CrashReportMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    error?: SortOrder
    stackTrace?: SortOrder
    stack?: SortOrder
    breadcrumbs?: SortOrder
    context?: SortOrder
    projectId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type CrashReportMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    error?: SortOrder
    stackTrace?: SortOrder
    stack?: SortOrder
    breadcrumbs?: SortOrder
    context?: SortOrder
    projectId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type WebRtcMetricOrderByRelevanceInput = {
    fields: WebRtcMetricOrderByRelevanceFieldEnum | WebRtcMetricOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type WebRtcMetricCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    peerConnectionId?: SortOrder
    rttMs?: SortOrder
    jitterMs?: SortOrder
    packetLoss?: SortOrder
    networkType?: SortOrder
    effectiveType?: SortOrder
    downlinkMbps?: SortOrder
    iceCandidatePairId?: SortOrder
    localCandidateId?: SortOrder
    remoteCandidateId?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type WebRtcMetricAvgOrderByAggregateInput = {
    value?: SortOrder
    rttMs?: SortOrder
    jitterMs?: SortOrder
    packetLoss?: SortOrder
    downlinkMbps?: SortOrder
  }

  export type WebRtcMetricMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    peerConnectionId?: SortOrder
    rttMs?: SortOrder
    jitterMs?: SortOrder
    packetLoss?: SortOrder
    networkType?: SortOrder
    effectiveType?: SortOrder
    downlinkMbps?: SortOrder
    iceCandidatePairId?: SortOrder
    localCandidateId?: SortOrder
    remoteCandidateId?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type WebRtcMetricMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    peerConnectionId?: SortOrder
    rttMs?: SortOrder
    jitterMs?: SortOrder
    packetLoss?: SortOrder
    networkType?: SortOrder
    effectiveType?: SortOrder
    downlinkMbps?: SortOrder
    iceCandidatePairId?: SortOrder
    localCandidateId?: SortOrder
    remoteCandidateId?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type WebRtcMetricSumOrderByAggregateInput = {
    value?: SortOrder
    rttMs?: SortOrder
    jitterMs?: SortOrder
    packetLoss?: SortOrder
    downlinkMbps?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type SnapshotListRelationFilter = {
    every?: SnapshotWhereInput
    some?: SnapshotWhereInput
    none?: SnapshotWhereInput
  }

  export type SnapshotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectOrderByRelevanceInput = {
    fields: ProjectOrderByRelevanceFieldEnum | ProjectOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type ProjectRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type EntityTagListRelationFilter = {
    every?: EntityTagWhereInput
    some?: EntityTagWhereInput
    none?: EntityTagWhereInput
  }

  export type EntityTagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SnapshotOrderByRelevanceInput = {
    fields: SnapshotOrderByRelevanceFieldEnum | SnapshotOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagOrderByRelevanceInput = {
    fields: TagOrderByRelevanceFieldEnum | TagOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagRelationFilter = {
    is?: TagWhereInput
    isNot?: TagWhereInput
  }

  export type SnapshotNullableRelationFilter = {
    is?: SnapshotWhereInput | null
    isNot?: SnapshotWhereInput | null
  }

  export type EntityTagOrderByRelevanceInput = {
    fields: EntityTagOrderByRelevanceFieldEnum | EntityTagOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type EntityTagEntityTypeEntityIdTagIdCompoundUniqueInput = {
    entityType: string
    entityId: string
    tagId: string
  }

  export type EntityTagCountOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    tagId?: SortOrder
    snapshotId?: SortOrder
    createdAt?: SortOrder
  }

  export type EntityTagMaxOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    tagId?: SortOrder
    snapshotId?: SortOrder
    createdAt?: SortOrder
  }

  export type EntityTagMinOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    tagId?: SortOrder
    snapshotId?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FileTransferOrderByRelevanceInput = {
    fields: FileTransferOrderByRelevanceFieldEnum | FileTransferOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FileTransferCountOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    fileKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileTransferAvgOrderByAggregateInput = {
    size?: SortOrder
    progress?: SortOrder
  }

  export type FileTransferMaxOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    fileKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileTransferMinOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    status?: SortOrder
    progress?: SortOrder
    fileKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileTransferSumOrderByAggregateInput = {
    size?: SortOrder
    progress?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserPluginCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPluginCreateWithoutUserInput, UserPluginUncheckedCreateWithoutUserInput> | UserPluginCreateWithoutUserInput[] | UserPluginUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutUserInput | UserPluginCreateOrConnectWithoutUserInput[]
    createMany?: UserPluginCreateManyUserInputEnvelope
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
  }

  export type UserPresenceCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPresenceCreateWithoutUserInput, UserPresenceUncheckedCreateWithoutUserInput> | UserPresenceCreateWithoutUserInput[] | UserPresenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPresenceCreateOrConnectWithoutUserInput | UserPresenceCreateOrConnectWithoutUserInput[]
    createMany?: UserPresenceCreateManyUserInputEnvelope
    connect?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
  }

  export type ActivityLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
  }

  export type CrashReportCreateNestedManyWithoutUserInput = {
    create?: XOR<CrashReportCreateWithoutUserInput, CrashReportUncheckedCreateWithoutUserInput> | CrashReportCreateWithoutUserInput[] | CrashReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashReportCreateOrConnectWithoutUserInput | CrashReportCreateOrConnectWithoutUserInput[]
    createMany?: CrashReportCreateManyUserInputEnvelope
    connect?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
  }

  export type WebRtcMetricCreateNestedManyWithoutUserInput = {
    create?: XOR<WebRtcMetricCreateWithoutUserInput, WebRtcMetricUncheckedCreateWithoutUserInput> | WebRtcMetricCreateWithoutUserInput[] | WebRtcMetricUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebRtcMetricCreateOrConnectWithoutUserInput | WebRtcMetricCreateOrConnectWithoutUserInput[]
    createMany?: WebRtcMetricCreateManyUserInputEnvelope
    connect?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
  }

  export type DeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type FileTransferCreateNestedManyWithoutFromUserInput = {
    create?: XOR<FileTransferCreateWithoutFromUserInput, FileTransferUncheckedCreateWithoutFromUserInput> | FileTransferCreateWithoutFromUserInput[] | FileTransferUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutFromUserInput | FileTransferCreateOrConnectWithoutFromUserInput[]
    createMany?: FileTransferCreateManyFromUserInputEnvelope
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
  }

  export type FileTransferCreateNestedManyWithoutToUserInput = {
    create?: XOR<FileTransferCreateWithoutToUserInput, FileTransferUncheckedCreateWithoutToUserInput> | FileTransferCreateWithoutToUserInput[] | FileTransferUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutToUserInput | FileTransferCreateOrConnectWithoutToUserInput[]
    createMany?: FileTransferCreateManyToUserInputEnvelope
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
  }

  export type UserPluginUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPluginCreateWithoutUserInput, UserPluginUncheckedCreateWithoutUserInput> | UserPluginCreateWithoutUserInput[] | UserPluginUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutUserInput | UserPluginCreateOrConnectWithoutUserInput[]
    createMany?: UserPluginCreateManyUserInputEnvelope
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
  }

  export type UserPresenceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPresenceCreateWithoutUserInput, UserPresenceUncheckedCreateWithoutUserInput> | UserPresenceCreateWithoutUserInput[] | UserPresenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPresenceCreateOrConnectWithoutUserInput | UserPresenceCreateOrConnectWithoutUserInput[]
    createMany?: UserPresenceCreateManyUserInputEnvelope
    connect?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
  }

  export type ActivityLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
  }

  export type CrashReportUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CrashReportCreateWithoutUserInput, CrashReportUncheckedCreateWithoutUserInput> | CrashReportCreateWithoutUserInput[] | CrashReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashReportCreateOrConnectWithoutUserInput | CrashReportCreateOrConnectWithoutUserInput[]
    createMany?: CrashReportCreateManyUserInputEnvelope
    connect?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
  }

  export type WebRtcMetricUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WebRtcMetricCreateWithoutUserInput, WebRtcMetricUncheckedCreateWithoutUserInput> | WebRtcMetricCreateWithoutUserInput[] | WebRtcMetricUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebRtcMetricCreateOrConnectWithoutUserInput | WebRtcMetricCreateOrConnectWithoutUserInput[]
    createMany?: WebRtcMetricCreateManyUserInputEnvelope
    connect?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
  }

  export type DeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type FileTransferUncheckedCreateNestedManyWithoutFromUserInput = {
    create?: XOR<FileTransferCreateWithoutFromUserInput, FileTransferUncheckedCreateWithoutFromUserInput> | FileTransferCreateWithoutFromUserInput[] | FileTransferUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutFromUserInput | FileTransferCreateOrConnectWithoutFromUserInput[]
    createMany?: FileTransferCreateManyFromUserInputEnvelope
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
  }

  export type FileTransferUncheckedCreateNestedManyWithoutToUserInput = {
    create?: XOR<FileTransferCreateWithoutToUserInput, FileTransferUncheckedCreateWithoutToUserInput> | FileTransferCreateWithoutToUserInput[] | FileTransferUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutToUserInput | FileTransferCreateOrConnectWithoutToUserInput[]
    createMany?: FileTransferCreateManyToUserInputEnvelope
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserPluginUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPluginCreateWithoutUserInput, UserPluginUncheckedCreateWithoutUserInput> | UserPluginCreateWithoutUserInput[] | UserPluginUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutUserInput | UserPluginCreateOrConnectWithoutUserInput[]
    upsert?: UserPluginUpsertWithWhereUniqueWithoutUserInput | UserPluginUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPluginCreateManyUserInputEnvelope
    set?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    disconnect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    delete?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    update?: UserPluginUpdateWithWhereUniqueWithoutUserInput | UserPluginUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPluginUpdateManyWithWhereWithoutUserInput | UserPluginUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPluginScalarWhereInput | UserPluginScalarWhereInput[]
  }

  export type UserPresenceUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPresenceCreateWithoutUserInput, UserPresenceUncheckedCreateWithoutUserInput> | UserPresenceCreateWithoutUserInput[] | UserPresenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPresenceCreateOrConnectWithoutUserInput | UserPresenceCreateOrConnectWithoutUserInput[]
    upsert?: UserPresenceUpsertWithWhereUniqueWithoutUserInput | UserPresenceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPresenceCreateManyUserInputEnvelope
    set?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    disconnect?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    delete?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    connect?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    update?: UserPresenceUpdateWithWhereUniqueWithoutUserInput | UserPresenceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPresenceUpdateManyWithWhereWithoutUserInput | UserPresenceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPresenceScalarWhereInput | UserPresenceScalarWhereInput[]
  }

  export type ActivityLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    upsert?: ActivityLogUpsertWithWhereUniqueWithoutUserInput | ActivityLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    set?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    disconnect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    delete?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    update?: ActivityLogUpdateWithWhereUniqueWithoutUserInput | ActivityLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActivityLogUpdateManyWithWhereWithoutUserInput | ActivityLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
  }

  export type CrashReportUpdateManyWithoutUserNestedInput = {
    create?: XOR<CrashReportCreateWithoutUserInput, CrashReportUncheckedCreateWithoutUserInput> | CrashReportCreateWithoutUserInput[] | CrashReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashReportCreateOrConnectWithoutUserInput | CrashReportCreateOrConnectWithoutUserInput[]
    upsert?: CrashReportUpsertWithWhereUniqueWithoutUserInput | CrashReportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CrashReportCreateManyUserInputEnvelope
    set?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    disconnect?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    delete?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    connect?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    update?: CrashReportUpdateWithWhereUniqueWithoutUserInput | CrashReportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CrashReportUpdateManyWithWhereWithoutUserInput | CrashReportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CrashReportScalarWhereInput | CrashReportScalarWhereInput[]
  }

  export type WebRtcMetricUpdateManyWithoutUserNestedInput = {
    create?: XOR<WebRtcMetricCreateWithoutUserInput, WebRtcMetricUncheckedCreateWithoutUserInput> | WebRtcMetricCreateWithoutUserInput[] | WebRtcMetricUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebRtcMetricCreateOrConnectWithoutUserInput | WebRtcMetricCreateOrConnectWithoutUserInput[]
    upsert?: WebRtcMetricUpsertWithWhereUniqueWithoutUserInput | WebRtcMetricUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WebRtcMetricCreateManyUserInputEnvelope
    set?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    disconnect?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    delete?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    connect?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    update?: WebRtcMetricUpdateWithWhereUniqueWithoutUserInput | WebRtcMetricUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WebRtcMetricUpdateManyWithWhereWithoutUserInput | WebRtcMetricUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WebRtcMetricScalarWhereInput | WebRtcMetricScalarWhereInput[]
  }

  export type DeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutUserInput | DeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutUserInput | DeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutUserInput | DeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type FileTransferUpdateManyWithoutFromUserNestedInput = {
    create?: XOR<FileTransferCreateWithoutFromUserInput, FileTransferUncheckedCreateWithoutFromUserInput> | FileTransferCreateWithoutFromUserInput[] | FileTransferUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutFromUserInput | FileTransferCreateOrConnectWithoutFromUserInput[]
    upsert?: FileTransferUpsertWithWhereUniqueWithoutFromUserInput | FileTransferUpsertWithWhereUniqueWithoutFromUserInput[]
    createMany?: FileTransferCreateManyFromUserInputEnvelope
    set?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    disconnect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    delete?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    update?: FileTransferUpdateWithWhereUniqueWithoutFromUserInput | FileTransferUpdateWithWhereUniqueWithoutFromUserInput[]
    updateMany?: FileTransferUpdateManyWithWhereWithoutFromUserInput | FileTransferUpdateManyWithWhereWithoutFromUserInput[]
    deleteMany?: FileTransferScalarWhereInput | FileTransferScalarWhereInput[]
  }

  export type FileTransferUpdateManyWithoutToUserNestedInput = {
    create?: XOR<FileTransferCreateWithoutToUserInput, FileTransferUncheckedCreateWithoutToUserInput> | FileTransferCreateWithoutToUserInput[] | FileTransferUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutToUserInput | FileTransferCreateOrConnectWithoutToUserInput[]
    upsert?: FileTransferUpsertWithWhereUniqueWithoutToUserInput | FileTransferUpsertWithWhereUniqueWithoutToUserInput[]
    createMany?: FileTransferCreateManyToUserInputEnvelope
    set?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    disconnect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    delete?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    update?: FileTransferUpdateWithWhereUniqueWithoutToUserInput | FileTransferUpdateWithWhereUniqueWithoutToUserInput[]
    updateMany?: FileTransferUpdateManyWithWhereWithoutToUserInput | FileTransferUpdateManyWithWhereWithoutToUserInput[]
    deleteMany?: FileTransferScalarWhereInput | FileTransferScalarWhereInput[]
  }

  export type UserPluginUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPluginCreateWithoutUserInput, UserPluginUncheckedCreateWithoutUserInput> | UserPluginCreateWithoutUserInput[] | UserPluginUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutUserInput | UserPluginCreateOrConnectWithoutUserInput[]
    upsert?: UserPluginUpsertWithWhereUniqueWithoutUserInput | UserPluginUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPluginCreateManyUserInputEnvelope
    set?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    disconnect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    delete?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    update?: UserPluginUpdateWithWhereUniqueWithoutUserInput | UserPluginUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPluginUpdateManyWithWhereWithoutUserInput | UserPluginUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPluginScalarWhereInput | UserPluginScalarWhereInput[]
  }

  export type UserPresenceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPresenceCreateWithoutUserInput, UserPresenceUncheckedCreateWithoutUserInput> | UserPresenceCreateWithoutUserInput[] | UserPresenceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPresenceCreateOrConnectWithoutUserInput | UserPresenceCreateOrConnectWithoutUserInput[]
    upsert?: UserPresenceUpsertWithWhereUniqueWithoutUserInput | UserPresenceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPresenceCreateManyUserInputEnvelope
    set?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    disconnect?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    delete?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    connect?: UserPresenceWhereUniqueInput | UserPresenceWhereUniqueInput[]
    update?: UserPresenceUpdateWithWhereUniqueWithoutUserInput | UserPresenceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPresenceUpdateManyWithWhereWithoutUserInput | UserPresenceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPresenceScalarWhereInput | UserPresenceScalarWhereInput[]
  }

  export type ActivityLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput> | ActivityLogCreateWithoutUserInput[] | ActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutUserInput | ActivityLogCreateOrConnectWithoutUserInput[]
    upsert?: ActivityLogUpsertWithWhereUniqueWithoutUserInput | ActivityLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActivityLogCreateManyUserInputEnvelope
    set?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    disconnect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    delete?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    update?: ActivityLogUpdateWithWhereUniqueWithoutUserInput | ActivityLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActivityLogUpdateManyWithWhereWithoutUserInput | ActivityLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
  }

  export type CrashReportUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CrashReportCreateWithoutUserInput, CrashReportUncheckedCreateWithoutUserInput> | CrashReportCreateWithoutUserInput[] | CrashReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashReportCreateOrConnectWithoutUserInput | CrashReportCreateOrConnectWithoutUserInput[]
    upsert?: CrashReportUpsertWithWhereUniqueWithoutUserInput | CrashReportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CrashReportCreateManyUserInputEnvelope
    set?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    disconnect?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    delete?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    connect?: CrashReportWhereUniqueInput | CrashReportWhereUniqueInput[]
    update?: CrashReportUpdateWithWhereUniqueWithoutUserInput | CrashReportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CrashReportUpdateManyWithWhereWithoutUserInput | CrashReportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CrashReportScalarWhereInput | CrashReportScalarWhereInput[]
  }

  export type WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WebRtcMetricCreateWithoutUserInput, WebRtcMetricUncheckedCreateWithoutUserInput> | WebRtcMetricCreateWithoutUserInput[] | WebRtcMetricUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebRtcMetricCreateOrConnectWithoutUserInput | WebRtcMetricCreateOrConnectWithoutUserInput[]
    upsert?: WebRtcMetricUpsertWithWhereUniqueWithoutUserInput | WebRtcMetricUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WebRtcMetricCreateManyUserInputEnvelope
    set?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    disconnect?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    delete?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    connect?: WebRtcMetricWhereUniqueInput | WebRtcMetricWhereUniqueInput[]
    update?: WebRtcMetricUpdateWithWhereUniqueWithoutUserInput | WebRtcMetricUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WebRtcMetricUpdateManyWithWhereWithoutUserInput | WebRtcMetricUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WebRtcMetricScalarWhereInput | WebRtcMetricScalarWhereInput[]
  }

  export type DeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutUserInput | DeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutUserInput | DeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutUserInput | DeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type FileTransferUncheckedUpdateManyWithoutFromUserNestedInput = {
    create?: XOR<FileTransferCreateWithoutFromUserInput, FileTransferUncheckedCreateWithoutFromUserInput> | FileTransferCreateWithoutFromUserInput[] | FileTransferUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutFromUserInput | FileTransferCreateOrConnectWithoutFromUserInput[]
    upsert?: FileTransferUpsertWithWhereUniqueWithoutFromUserInput | FileTransferUpsertWithWhereUniqueWithoutFromUserInput[]
    createMany?: FileTransferCreateManyFromUserInputEnvelope
    set?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    disconnect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    delete?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    update?: FileTransferUpdateWithWhereUniqueWithoutFromUserInput | FileTransferUpdateWithWhereUniqueWithoutFromUserInput[]
    updateMany?: FileTransferUpdateManyWithWhereWithoutFromUserInput | FileTransferUpdateManyWithWhereWithoutFromUserInput[]
    deleteMany?: FileTransferScalarWhereInput | FileTransferScalarWhereInput[]
  }

  export type FileTransferUncheckedUpdateManyWithoutToUserNestedInput = {
    create?: XOR<FileTransferCreateWithoutToUserInput, FileTransferUncheckedCreateWithoutToUserInput> | FileTransferCreateWithoutToUserInput[] | FileTransferUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: FileTransferCreateOrConnectWithoutToUserInput | FileTransferCreateOrConnectWithoutToUserInput[]
    upsert?: FileTransferUpsertWithWhereUniqueWithoutToUserInput | FileTransferUpsertWithWhereUniqueWithoutToUserInput[]
    createMany?: FileTransferCreateManyToUserInputEnvelope
    set?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    disconnect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    delete?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    connect?: FileTransferWhereUniqueInput | FileTransferWhereUniqueInput[]
    update?: FileTransferUpdateWithWhereUniqueWithoutToUserInput | FileTransferUpdateWithWhereUniqueWithoutToUserInput[]
    updateMany?: FileTransferUpdateManyWithWhereWithoutToUserInput | FileTransferUpdateManyWithWhereWithoutToUserInput[]
    deleteMany?: FileTransferScalarWhereInput | FileTransferScalarWhereInput[]
  }

  export type UserPluginCreateNestedManyWithoutPluginInput = {
    create?: XOR<UserPluginCreateWithoutPluginInput, UserPluginUncheckedCreateWithoutPluginInput> | UserPluginCreateWithoutPluginInput[] | UserPluginUncheckedCreateWithoutPluginInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutPluginInput | UserPluginCreateOrConnectWithoutPluginInput[]
    createMany?: UserPluginCreateManyPluginInputEnvelope
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
  }

  export type UserPluginUncheckedCreateNestedManyWithoutPluginInput = {
    create?: XOR<UserPluginCreateWithoutPluginInput, UserPluginUncheckedCreateWithoutPluginInput> | UserPluginCreateWithoutPluginInput[] | UserPluginUncheckedCreateWithoutPluginInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutPluginInput | UserPluginCreateOrConnectWithoutPluginInput[]
    createMany?: UserPluginCreateManyPluginInputEnvelope
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
  }

  export type UserPluginUpdateManyWithoutPluginNestedInput = {
    create?: XOR<UserPluginCreateWithoutPluginInput, UserPluginUncheckedCreateWithoutPluginInput> | UserPluginCreateWithoutPluginInput[] | UserPluginUncheckedCreateWithoutPluginInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutPluginInput | UserPluginCreateOrConnectWithoutPluginInput[]
    upsert?: UserPluginUpsertWithWhereUniqueWithoutPluginInput | UserPluginUpsertWithWhereUniqueWithoutPluginInput[]
    createMany?: UserPluginCreateManyPluginInputEnvelope
    set?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    disconnect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    delete?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    update?: UserPluginUpdateWithWhereUniqueWithoutPluginInput | UserPluginUpdateWithWhereUniqueWithoutPluginInput[]
    updateMany?: UserPluginUpdateManyWithWhereWithoutPluginInput | UserPluginUpdateManyWithWhereWithoutPluginInput[]
    deleteMany?: UserPluginScalarWhereInput | UserPluginScalarWhereInput[]
  }

  export type UserPluginUncheckedUpdateManyWithoutPluginNestedInput = {
    create?: XOR<UserPluginCreateWithoutPluginInput, UserPluginUncheckedCreateWithoutPluginInput> | UserPluginCreateWithoutPluginInput[] | UserPluginUncheckedCreateWithoutPluginInput[]
    connectOrCreate?: UserPluginCreateOrConnectWithoutPluginInput | UserPluginCreateOrConnectWithoutPluginInput[]
    upsert?: UserPluginUpsertWithWhereUniqueWithoutPluginInput | UserPluginUpsertWithWhereUniqueWithoutPluginInput[]
    createMany?: UserPluginCreateManyPluginInputEnvelope
    set?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    disconnect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    delete?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    connect?: UserPluginWhereUniqueInput | UserPluginWhereUniqueInput[]
    update?: UserPluginUpdateWithWhereUniqueWithoutPluginInput | UserPluginUpdateWithWhereUniqueWithoutPluginInput[]
    updateMany?: UserPluginUpdateManyWithWhereWithoutPluginInput | UserPluginUpdateManyWithWhereWithoutPluginInput[]
    deleteMany?: UserPluginScalarWhereInput | UserPluginScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutDevicesInput = {
    create?: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDevicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDevicesInput
    upsert?: UserUpsertWithoutDevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDevicesInput, UserUpdateWithoutDevicesInput>, UserUncheckedUpdateWithoutDevicesInput>
  }

  export type UserCreateNestedOneWithoutUserPluginsInput = {
    create?: XOR<UserCreateWithoutUserPluginsInput, UserUncheckedCreateWithoutUserPluginsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserPluginsInput
    connect?: UserWhereUniqueInput
  }

  export type PluginCreateNestedOneWithoutUserPluginsInput = {
    create?: XOR<PluginCreateWithoutUserPluginsInput, PluginUncheckedCreateWithoutUserPluginsInput>
    connectOrCreate?: PluginCreateOrConnectWithoutUserPluginsInput
    connect?: PluginWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserPluginsNestedInput = {
    create?: XOR<UserCreateWithoutUserPluginsInput, UserUncheckedCreateWithoutUserPluginsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserPluginsInput
    upsert?: UserUpsertWithoutUserPluginsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserPluginsInput, UserUpdateWithoutUserPluginsInput>, UserUncheckedUpdateWithoutUserPluginsInput>
  }

  export type PluginUpdateOneRequiredWithoutUserPluginsNestedInput = {
    create?: XOR<PluginCreateWithoutUserPluginsInput, PluginUncheckedCreateWithoutUserPluginsInput>
    connectOrCreate?: PluginCreateOrConnectWithoutUserPluginsInput
    upsert?: PluginUpsertWithoutUserPluginsInput
    connect?: PluginWhereUniqueInput
    update?: XOR<XOR<PluginUpdateToOneWithWhereWithoutUserPluginsInput, PluginUpdateWithoutUserPluginsInput>, PluginUncheckedUpdateWithoutUserPluginsInput>
  }

  export type UserCreateNestedOneWithoutPresenceInput = {
    create?: XOR<UserCreateWithoutPresenceInput, UserUncheckedCreateWithoutPresenceInput>
    connectOrCreate?: UserCreateOrConnectWithoutPresenceInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPresenceNestedInput = {
    create?: XOR<UserCreateWithoutPresenceInput, UserUncheckedCreateWithoutPresenceInput>
    connectOrCreate?: UserCreateOrConnectWithoutPresenceInput
    upsert?: UserUpsertWithoutPresenceInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPresenceInput, UserUpdateWithoutPresenceInput>, UserUncheckedUpdateWithoutPresenceInput>
  }

  export type UserCreateNestedOneWithoutActivityLogsInput = {
    create?: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityLogsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutActivityLogsInput = {
    create?: XOR<ProjectCreateWithoutActivityLogsInput, ProjectUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutActivityLogsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutActivityLogsNestedInput = {
    create?: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityLogsInput
    upsert?: UserUpsertWithoutActivityLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActivityLogsInput, UserUpdateWithoutActivityLogsInput>, UserUncheckedUpdateWithoutActivityLogsInput>
  }

  export type ProjectUpdateOneWithoutActivityLogsNestedInput = {
    create?: XOR<ProjectCreateWithoutActivityLogsInput, ProjectUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutActivityLogsInput
    upsert?: ProjectUpsertWithoutActivityLogsInput
    disconnect?: ProjectWhereInput | boolean
    delete?: ProjectWhereInput | boolean
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutActivityLogsInput, ProjectUpdateWithoutActivityLogsInput>, ProjectUncheckedUpdateWithoutActivityLogsInput>
  }

  export type UserCreateNestedOneWithoutCrashReportsInput = {
    create?: XOR<UserCreateWithoutCrashReportsInput, UserUncheckedCreateWithoutCrashReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCrashReportsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCrashReportsNestedInput = {
    create?: XOR<UserCreateWithoutCrashReportsInput, UserUncheckedCreateWithoutCrashReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCrashReportsInput
    upsert?: UserUpsertWithoutCrashReportsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCrashReportsInput, UserUpdateWithoutCrashReportsInput>, UserUncheckedUpdateWithoutCrashReportsInput>
  }

  export type UserCreateNestedOneWithoutWebRtcMetricsInput = {
    create?: XOR<UserCreateWithoutWebRtcMetricsInput, UserUncheckedCreateWithoutWebRtcMetricsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWebRtcMetricsInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutWebRtcMetricsNestedInput = {
    create?: XOR<UserCreateWithoutWebRtcMetricsInput, UserUncheckedCreateWithoutWebRtcMetricsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWebRtcMetricsInput
    upsert?: UserUpsertWithoutWebRtcMetricsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWebRtcMetricsInput, UserUpdateWithoutWebRtcMetricsInput>, UserUncheckedUpdateWithoutWebRtcMetricsInput>
  }

  export type SnapshotCreateNestedManyWithoutProjectInput = {
    create?: XOR<SnapshotCreateWithoutProjectInput, SnapshotUncheckedCreateWithoutProjectInput> | SnapshotCreateWithoutProjectInput[] | SnapshotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutProjectInput | SnapshotCreateOrConnectWithoutProjectInput[]
    createMany?: SnapshotCreateManyProjectInputEnvelope
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
  }

  export type ActivityLogCreateNestedManyWithoutProjectInput = {
    create?: XOR<ActivityLogCreateWithoutProjectInput, ActivityLogUncheckedCreateWithoutProjectInput> | ActivityLogCreateWithoutProjectInput[] | ActivityLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutProjectInput | ActivityLogCreateOrConnectWithoutProjectInput[]
    createMany?: ActivityLogCreateManyProjectInputEnvelope
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
  }

  export type SnapshotUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<SnapshotCreateWithoutProjectInput, SnapshotUncheckedCreateWithoutProjectInput> | SnapshotCreateWithoutProjectInput[] | SnapshotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutProjectInput | SnapshotCreateOrConnectWithoutProjectInput[]
    createMany?: SnapshotCreateManyProjectInputEnvelope
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
  }

  export type ActivityLogUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ActivityLogCreateWithoutProjectInput, ActivityLogUncheckedCreateWithoutProjectInput> | ActivityLogCreateWithoutProjectInput[] | ActivityLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutProjectInput | ActivityLogCreateOrConnectWithoutProjectInput[]
    createMany?: ActivityLogCreateManyProjectInputEnvelope
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
  }

  export type SnapshotUpdateManyWithoutProjectNestedInput = {
    create?: XOR<SnapshotCreateWithoutProjectInput, SnapshotUncheckedCreateWithoutProjectInput> | SnapshotCreateWithoutProjectInput[] | SnapshotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutProjectInput | SnapshotCreateOrConnectWithoutProjectInput[]
    upsert?: SnapshotUpsertWithWhereUniqueWithoutProjectInput | SnapshotUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: SnapshotCreateManyProjectInputEnvelope
    set?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    disconnect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    delete?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    update?: SnapshotUpdateWithWhereUniqueWithoutProjectInput | SnapshotUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: SnapshotUpdateManyWithWhereWithoutProjectInput | SnapshotUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
  }

  export type ActivityLogUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ActivityLogCreateWithoutProjectInput, ActivityLogUncheckedCreateWithoutProjectInput> | ActivityLogCreateWithoutProjectInput[] | ActivityLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutProjectInput | ActivityLogCreateOrConnectWithoutProjectInput[]
    upsert?: ActivityLogUpsertWithWhereUniqueWithoutProjectInput | ActivityLogUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ActivityLogCreateManyProjectInputEnvelope
    set?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    disconnect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    delete?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    update?: ActivityLogUpdateWithWhereUniqueWithoutProjectInput | ActivityLogUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ActivityLogUpdateManyWithWhereWithoutProjectInput | ActivityLogUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
  }

  export type SnapshotUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<SnapshotCreateWithoutProjectInput, SnapshotUncheckedCreateWithoutProjectInput> | SnapshotCreateWithoutProjectInput[] | SnapshotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutProjectInput | SnapshotCreateOrConnectWithoutProjectInput[]
    upsert?: SnapshotUpsertWithWhereUniqueWithoutProjectInput | SnapshotUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: SnapshotCreateManyProjectInputEnvelope
    set?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    disconnect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    delete?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    update?: SnapshotUpdateWithWhereUniqueWithoutProjectInput | SnapshotUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: SnapshotUpdateManyWithWhereWithoutProjectInput | SnapshotUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
  }

  export type ActivityLogUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ActivityLogCreateWithoutProjectInput, ActivityLogUncheckedCreateWithoutProjectInput> | ActivityLogCreateWithoutProjectInput[] | ActivityLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ActivityLogCreateOrConnectWithoutProjectInput | ActivityLogCreateOrConnectWithoutProjectInput[]
    upsert?: ActivityLogUpsertWithWhereUniqueWithoutProjectInput | ActivityLogUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ActivityLogCreateManyProjectInputEnvelope
    set?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    disconnect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    delete?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    connect?: ActivityLogWhereUniqueInput | ActivityLogWhereUniqueInput[]
    update?: ActivityLogUpdateWithWhereUniqueWithoutProjectInput | ActivityLogUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ActivityLogUpdateManyWithWhereWithoutProjectInput | ActivityLogUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutSnapshotsInput = {
    create?: XOR<ProjectCreateWithoutSnapshotsInput, ProjectUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSnapshotsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EntityTagCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<EntityTagCreateWithoutSnapshotInput, EntityTagUncheckedCreateWithoutSnapshotInput> | EntityTagCreateWithoutSnapshotInput[] | EntityTagUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutSnapshotInput | EntityTagCreateOrConnectWithoutSnapshotInput[]
    createMany?: EntityTagCreateManySnapshotInputEnvelope
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
  }

  export type EntityTagUncheckedCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<EntityTagCreateWithoutSnapshotInput, EntityTagUncheckedCreateWithoutSnapshotInput> | EntityTagCreateWithoutSnapshotInput[] | EntityTagUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutSnapshotInput | EntityTagCreateOrConnectWithoutSnapshotInput[]
    createMany?: EntityTagCreateManySnapshotInputEnvelope
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
  }

  export type ProjectUpdateOneRequiredWithoutSnapshotsNestedInput = {
    create?: XOR<ProjectCreateWithoutSnapshotsInput, ProjectUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSnapshotsInput
    upsert?: ProjectUpsertWithoutSnapshotsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutSnapshotsInput, ProjectUpdateWithoutSnapshotsInput>, ProjectUncheckedUpdateWithoutSnapshotsInput>
  }

  export type EntityTagUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<EntityTagCreateWithoutSnapshotInput, EntityTagUncheckedCreateWithoutSnapshotInput> | EntityTagCreateWithoutSnapshotInput[] | EntityTagUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutSnapshotInput | EntityTagCreateOrConnectWithoutSnapshotInput[]
    upsert?: EntityTagUpsertWithWhereUniqueWithoutSnapshotInput | EntityTagUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: EntityTagCreateManySnapshotInputEnvelope
    set?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    disconnect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    delete?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    update?: EntityTagUpdateWithWhereUniqueWithoutSnapshotInput | EntityTagUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: EntityTagUpdateManyWithWhereWithoutSnapshotInput | EntityTagUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: EntityTagScalarWhereInput | EntityTagScalarWhereInput[]
  }

  export type EntityTagUncheckedUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<EntityTagCreateWithoutSnapshotInput, EntityTagUncheckedCreateWithoutSnapshotInput> | EntityTagCreateWithoutSnapshotInput[] | EntityTagUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutSnapshotInput | EntityTagCreateOrConnectWithoutSnapshotInput[]
    upsert?: EntityTagUpsertWithWhereUniqueWithoutSnapshotInput | EntityTagUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: EntityTagCreateManySnapshotInputEnvelope
    set?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    disconnect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    delete?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    update?: EntityTagUpdateWithWhereUniqueWithoutSnapshotInput | EntityTagUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: EntityTagUpdateManyWithWhereWithoutSnapshotInput | EntityTagUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: EntityTagScalarWhereInput | EntityTagScalarWhereInput[]
  }

  export type EntityTagCreateNestedManyWithoutTagInput = {
    create?: XOR<EntityTagCreateWithoutTagInput, EntityTagUncheckedCreateWithoutTagInput> | EntityTagCreateWithoutTagInput[] | EntityTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutTagInput | EntityTagCreateOrConnectWithoutTagInput[]
    createMany?: EntityTagCreateManyTagInputEnvelope
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
  }

  export type EntityTagUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<EntityTagCreateWithoutTagInput, EntityTagUncheckedCreateWithoutTagInput> | EntityTagCreateWithoutTagInput[] | EntityTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutTagInput | EntityTagCreateOrConnectWithoutTagInput[]
    createMany?: EntityTagCreateManyTagInputEnvelope
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
  }

  export type EntityTagUpdateManyWithoutTagNestedInput = {
    create?: XOR<EntityTagCreateWithoutTagInput, EntityTagUncheckedCreateWithoutTagInput> | EntityTagCreateWithoutTagInput[] | EntityTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutTagInput | EntityTagCreateOrConnectWithoutTagInput[]
    upsert?: EntityTagUpsertWithWhereUniqueWithoutTagInput | EntityTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: EntityTagCreateManyTagInputEnvelope
    set?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    disconnect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    delete?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    update?: EntityTagUpdateWithWhereUniqueWithoutTagInput | EntityTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: EntityTagUpdateManyWithWhereWithoutTagInput | EntityTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: EntityTagScalarWhereInput | EntityTagScalarWhereInput[]
  }

  export type EntityTagUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<EntityTagCreateWithoutTagInput, EntityTagUncheckedCreateWithoutTagInput> | EntityTagCreateWithoutTagInput[] | EntityTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: EntityTagCreateOrConnectWithoutTagInput | EntityTagCreateOrConnectWithoutTagInput[]
    upsert?: EntityTagUpsertWithWhereUniqueWithoutTagInput | EntityTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: EntityTagCreateManyTagInputEnvelope
    set?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    disconnect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    delete?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    connect?: EntityTagWhereUniqueInput | EntityTagWhereUniqueInput[]
    update?: EntityTagUpdateWithWhereUniqueWithoutTagInput | EntityTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: EntityTagUpdateManyWithWhereWithoutTagInput | EntityTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: EntityTagScalarWhereInput | EntityTagScalarWhereInput[]
  }

  export type TagCreateNestedOneWithoutEntityTagsInput = {
    create?: XOR<TagCreateWithoutEntityTagsInput, TagUncheckedCreateWithoutEntityTagsInput>
    connectOrCreate?: TagCreateOrConnectWithoutEntityTagsInput
    connect?: TagWhereUniqueInput
  }

  export type SnapshotCreateNestedOneWithoutTagsInput = {
    create?: XOR<SnapshotCreateWithoutTagsInput, SnapshotUncheckedCreateWithoutTagsInput>
    connectOrCreate?: SnapshotCreateOrConnectWithoutTagsInput
    connect?: SnapshotWhereUniqueInput
  }

  export type TagUpdateOneRequiredWithoutEntityTagsNestedInput = {
    create?: XOR<TagCreateWithoutEntityTagsInput, TagUncheckedCreateWithoutEntityTagsInput>
    connectOrCreate?: TagCreateOrConnectWithoutEntityTagsInput
    upsert?: TagUpsertWithoutEntityTagsInput
    connect?: TagWhereUniqueInput
    update?: XOR<XOR<TagUpdateToOneWithWhereWithoutEntityTagsInput, TagUpdateWithoutEntityTagsInput>, TagUncheckedUpdateWithoutEntityTagsInput>
  }

  export type SnapshotUpdateOneWithoutTagsNestedInput = {
    create?: XOR<SnapshotCreateWithoutTagsInput, SnapshotUncheckedCreateWithoutTagsInput>
    connectOrCreate?: SnapshotCreateOrConnectWithoutTagsInput
    upsert?: SnapshotUpsertWithoutTagsInput
    disconnect?: SnapshotWhereInput | boolean
    delete?: SnapshotWhereInput | boolean
    connect?: SnapshotWhereUniqueInput
    update?: XOR<XOR<SnapshotUpdateToOneWithWhereWithoutTagsInput, SnapshotUpdateWithoutTagsInput>, SnapshotUncheckedUpdateWithoutTagsInput>
  }

  export type UserCreateNestedOneWithoutFromTransfersInput = {
    create?: XOR<UserCreateWithoutFromTransfersInput, UserUncheckedCreateWithoutFromTransfersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFromTransfersInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutToTransfersInput = {
    create?: XOR<UserCreateWithoutToTransfersInput, UserUncheckedCreateWithoutToTransfersInput>
    connectOrCreate?: UserCreateOrConnectWithoutToTransfersInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutFromTransfersNestedInput = {
    create?: XOR<UserCreateWithoutFromTransfersInput, UserUncheckedCreateWithoutFromTransfersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFromTransfersInput
    upsert?: UserUpsertWithoutFromTransfersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFromTransfersInput, UserUpdateWithoutFromTransfersInput>, UserUncheckedUpdateWithoutFromTransfersInput>
  }

  export type UserUpdateOneRequiredWithoutToTransfersNestedInput = {
    create?: XOR<UserCreateWithoutToTransfersInput, UserUncheckedCreateWithoutToTransfersInput>
    connectOrCreate?: UserCreateOrConnectWithoutToTransfersInput
    upsert?: UserUpsertWithoutToTransfersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutToTransfersInput, UserUpdateWithoutToTransfersInput>, UserUncheckedUpdateWithoutToTransfersInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserPluginCreateWithoutUserInput = {
    id?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    plugin: PluginCreateNestedOneWithoutUserPluginsInput
  }

  export type UserPluginUncheckedCreateWithoutUserInput = {
    id?: string
    pluginId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPluginCreateOrConnectWithoutUserInput = {
    where: UserPluginWhereUniqueInput
    create: XOR<UserPluginCreateWithoutUserInput, UserPluginUncheckedCreateWithoutUserInput>
  }

  export type UserPluginCreateManyUserInputEnvelope = {
    data: UserPluginCreateManyUserInput | UserPluginCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserPresenceCreateWithoutUserInput = {
    id?: string
    projectId?: string | null
    status: string
    expiresAt: Date | string
    lastSeen?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPresenceUncheckedCreateWithoutUserInput = {
    id?: string
    projectId?: string | null
    status: string
    expiresAt: Date | string
    lastSeen?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPresenceCreateOrConnectWithoutUserInput = {
    where: UserPresenceWhereUniqueInput
    create: XOR<UserPresenceCreateWithoutUserInput, UserPresenceUncheckedCreateWithoutUserInput>
  }

  export type UserPresenceCreateManyUserInputEnvelope = {
    data: UserPresenceCreateManyUserInput | UserPresenceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ActivityLogCreateWithoutUserInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    project?: ProjectCreateNestedOneWithoutActivityLogsInput
  }

  export type ActivityLogUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    projectId?: string | null
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ActivityLogCreateOrConnectWithoutUserInput = {
    where: ActivityLogWhereUniqueInput
    create: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput>
  }

  export type ActivityLogCreateManyUserInputEnvelope = {
    data: ActivityLogCreateManyUserInput | ActivityLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CrashReportCreateWithoutUserInput = {
    id?: string
    error: string
    stackTrace: string
    stack?: string | null
    breadcrumbs?: string | null
    context?: string | null
    projectId?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type CrashReportUncheckedCreateWithoutUserInput = {
    id?: string
    error: string
    stackTrace: string
    stack?: string | null
    breadcrumbs?: string | null
    context?: string | null
    projectId?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type CrashReportCreateOrConnectWithoutUserInput = {
    where: CrashReportWhereUniqueInput
    create: XOR<CrashReportCreateWithoutUserInput, CrashReportUncheckedCreateWithoutUserInput>
  }

  export type CrashReportCreateManyUserInputEnvelope = {
    data: CrashReportCreateManyUserInput | CrashReportCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WebRtcMetricCreateWithoutUserInput = {
    id?: string
    projectId?: string | null
    metricType: string
    value: number
    peerConnectionId?: string | null
    rttMs?: number | null
    jitterMs?: number | null
    packetLoss?: number | null
    networkType?: string | null
    effectiveType?: string | null
    downlinkMbps?: number | null
    iceCandidatePairId?: string | null
    localCandidateId?: string | null
    remoteCandidateId?: string | null
    timestamp: Date | string
    metadata?: string | null
    createdAt?: Date | string
  }

  export type WebRtcMetricUncheckedCreateWithoutUserInput = {
    id?: string
    projectId?: string | null
    metricType: string
    value: number
    peerConnectionId?: string | null
    rttMs?: number | null
    jitterMs?: number | null
    packetLoss?: number | null
    networkType?: string | null
    effectiveType?: string | null
    downlinkMbps?: number | null
    iceCandidatePairId?: string | null
    localCandidateId?: string | null
    remoteCandidateId?: string | null
    timestamp: Date | string
    metadata?: string | null
    createdAt?: Date | string
  }

  export type WebRtcMetricCreateOrConnectWithoutUserInput = {
    where: WebRtcMetricWhereUniqueInput
    create: XOR<WebRtcMetricCreateWithoutUserInput, WebRtcMetricUncheckedCreateWithoutUserInput>
  }

  export type WebRtcMetricCreateManyUserInputEnvelope = {
    data: WebRtcMetricCreateManyUserInput | WebRtcMetricCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DeviceCreateWithoutUserInput = {
    id?: string
    name: string
    type: string
    info?: string | null
    lastActiveAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeviceUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    type: string
    info?: string | null
    lastActiveAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeviceCreateOrConnectWithoutUserInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput>
  }

  export type DeviceCreateManyUserInputEnvelope = {
    data: DeviceCreateManyUserInput | DeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FileTransferCreateWithoutFromUserInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    toUser: UserCreateNestedOneWithoutToTransfersInput
  }

  export type FileTransferUncheckedCreateWithoutFromUserInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    toUserId: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileTransferCreateOrConnectWithoutFromUserInput = {
    where: FileTransferWhereUniqueInput
    create: XOR<FileTransferCreateWithoutFromUserInput, FileTransferUncheckedCreateWithoutFromUserInput>
  }

  export type FileTransferCreateManyFromUserInputEnvelope = {
    data: FileTransferCreateManyFromUserInput | FileTransferCreateManyFromUserInput[]
    skipDuplicates?: boolean
  }

  export type FileTransferCreateWithoutToUserInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fromUser: UserCreateNestedOneWithoutFromTransfersInput
  }

  export type FileTransferUncheckedCreateWithoutToUserInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    fromUserId: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileTransferCreateOrConnectWithoutToUserInput = {
    where: FileTransferWhereUniqueInput
    create: XOR<FileTransferCreateWithoutToUserInput, FileTransferUncheckedCreateWithoutToUserInput>
  }

  export type FileTransferCreateManyToUserInputEnvelope = {
    data: FileTransferCreateManyToUserInput | FileTransferCreateManyToUserInput[]
    skipDuplicates?: boolean
  }

  export type UserPluginUpsertWithWhereUniqueWithoutUserInput = {
    where: UserPluginWhereUniqueInput
    update: XOR<UserPluginUpdateWithoutUserInput, UserPluginUncheckedUpdateWithoutUserInput>
    create: XOR<UserPluginCreateWithoutUserInput, UserPluginUncheckedCreateWithoutUserInput>
  }

  export type UserPluginUpdateWithWhereUniqueWithoutUserInput = {
    where: UserPluginWhereUniqueInput
    data: XOR<UserPluginUpdateWithoutUserInput, UserPluginUncheckedUpdateWithoutUserInput>
  }

  export type UserPluginUpdateManyWithWhereWithoutUserInput = {
    where: UserPluginScalarWhereInput
    data: XOR<UserPluginUpdateManyMutationInput, UserPluginUncheckedUpdateManyWithoutUserInput>
  }

  export type UserPluginScalarWhereInput = {
    AND?: UserPluginScalarWhereInput | UserPluginScalarWhereInput[]
    OR?: UserPluginScalarWhereInput[]
    NOT?: UserPluginScalarWhereInput | UserPluginScalarWhereInput[]
    id?: StringFilter<"UserPlugin"> | string
    userId?: StringFilter<"UserPlugin"> | string
    pluginId?: StringFilter<"UserPlugin"> | string
    isActive?: BoolFilter<"UserPlugin"> | boolean
    createdAt?: DateTimeFilter<"UserPlugin"> | Date | string
    updatedAt?: DateTimeFilter<"UserPlugin"> | Date | string
  }

  export type UserPresenceUpsertWithWhereUniqueWithoutUserInput = {
    where: UserPresenceWhereUniqueInput
    update: XOR<UserPresenceUpdateWithoutUserInput, UserPresenceUncheckedUpdateWithoutUserInput>
    create: XOR<UserPresenceCreateWithoutUserInput, UserPresenceUncheckedCreateWithoutUserInput>
  }

  export type UserPresenceUpdateWithWhereUniqueWithoutUserInput = {
    where: UserPresenceWhereUniqueInput
    data: XOR<UserPresenceUpdateWithoutUserInput, UserPresenceUncheckedUpdateWithoutUserInput>
  }

  export type UserPresenceUpdateManyWithWhereWithoutUserInput = {
    where: UserPresenceScalarWhereInput
    data: XOR<UserPresenceUpdateManyMutationInput, UserPresenceUncheckedUpdateManyWithoutUserInput>
  }

  export type UserPresenceScalarWhereInput = {
    AND?: UserPresenceScalarWhereInput | UserPresenceScalarWhereInput[]
    OR?: UserPresenceScalarWhereInput[]
    NOT?: UserPresenceScalarWhereInput | UserPresenceScalarWhereInput[]
    id?: StringFilter<"UserPresence"> | string
    userId?: StringFilter<"UserPresence"> | string
    projectId?: StringNullableFilter<"UserPresence"> | string | null
    status?: StringFilter<"UserPresence"> | string
    expiresAt?: DateTimeFilter<"UserPresence"> | Date | string
    lastSeen?: DateTimeFilter<"UserPresence"> | Date | string
    createdAt?: DateTimeFilter<"UserPresence"> | Date | string
    updatedAt?: DateTimeFilter<"UserPresence"> | Date | string
  }

  export type ActivityLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ActivityLogWhereUniqueInput
    update: XOR<ActivityLogUpdateWithoutUserInput, ActivityLogUncheckedUpdateWithoutUserInput>
    create: XOR<ActivityLogCreateWithoutUserInput, ActivityLogUncheckedCreateWithoutUserInput>
  }

  export type ActivityLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ActivityLogWhereUniqueInput
    data: XOR<ActivityLogUpdateWithoutUserInput, ActivityLogUncheckedUpdateWithoutUserInput>
  }

  export type ActivityLogUpdateManyWithWhereWithoutUserInput = {
    where: ActivityLogScalarWhereInput
    data: XOR<ActivityLogUpdateManyMutationInput, ActivityLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ActivityLogScalarWhereInput = {
    AND?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
    OR?: ActivityLogScalarWhereInput[]
    NOT?: ActivityLogScalarWhereInput | ActivityLogScalarWhereInput[]
    id?: StringFilter<"ActivityLog"> | string
    userId?: StringFilter<"ActivityLog"> | string
    action?: StringFilter<"ActivityLog"> | string
    entityType?: StringFilter<"ActivityLog"> | string
    entityId?: StringFilter<"ActivityLog"> | string
    projectId?: StringNullableFilter<"ActivityLog"> | string | null
    metadata?: StringNullableFilter<"ActivityLog"> | string | null
    ipAddress?: StringNullableFilter<"ActivityLog"> | string | null
    userAgent?: StringNullableFilter<"ActivityLog"> | string | null
    createdAt?: DateTimeFilter<"ActivityLog"> | Date | string
  }

  export type CrashReportUpsertWithWhereUniqueWithoutUserInput = {
    where: CrashReportWhereUniqueInput
    update: XOR<CrashReportUpdateWithoutUserInput, CrashReportUncheckedUpdateWithoutUserInput>
    create: XOR<CrashReportCreateWithoutUserInput, CrashReportUncheckedCreateWithoutUserInput>
  }

  export type CrashReportUpdateWithWhereUniqueWithoutUserInput = {
    where: CrashReportWhereUniqueInput
    data: XOR<CrashReportUpdateWithoutUserInput, CrashReportUncheckedUpdateWithoutUserInput>
  }

  export type CrashReportUpdateManyWithWhereWithoutUserInput = {
    where: CrashReportScalarWhereInput
    data: XOR<CrashReportUpdateManyMutationInput, CrashReportUncheckedUpdateManyWithoutUserInput>
  }

  export type CrashReportScalarWhereInput = {
    AND?: CrashReportScalarWhereInput | CrashReportScalarWhereInput[]
    OR?: CrashReportScalarWhereInput[]
    NOT?: CrashReportScalarWhereInput | CrashReportScalarWhereInput[]
    id?: StringFilter<"CrashReport"> | string
    userId?: StringFilter<"CrashReport"> | string
    error?: StringFilter<"CrashReport"> | string
    stackTrace?: StringFilter<"CrashReport"> | string
    stack?: StringNullableFilter<"CrashReport"> | string | null
    breadcrumbs?: StringNullableFilter<"CrashReport"> | string | null
    context?: StringNullableFilter<"CrashReport"> | string | null
    projectId?: StringNullableFilter<"CrashReport"> | string | null
    metadata?: StringNullableFilter<"CrashReport"> | string | null
    createdAt?: DateTimeFilter<"CrashReport"> | Date | string
  }

  export type WebRtcMetricUpsertWithWhereUniqueWithoutUserInput = {
    where: WebRtcMetricWhereUniqueInput
    update: XOR<WebRtcMetricUpdateWithoutUserInput, WebRtcMetricUncheckedUpdateWithoutUserInput>
    create: XOR<WebRtcMetricCreateWithoutUserInput, WebRtcMetricUncheckedCreateWithoutUserInput>
  }

  export type WebRtcMetricUpdateWithWhereUniqueWithoutUserInput = {
    where: WebRtcMetricWhereUniqueInput
    data: XOR<WebRtcMetricUpdateWithoutUserInput, WebRtcMetricUncheckedUpdateWithoutUserInput>
  }

  export type WebRtcMetricUpdateManyWithWhereWithoutUserInput = {
    where: WebRtcMetricScalarWhereInput
    data: XOR<WebRtcMetricUpdateManyMutationInput, WebRtcMetricUncheckedUpdateManyWithoutUserInput>
  }

  export type WebRtcMetricScalarWhereInput = {
    AND?: WebRtcMetricScalarWhereInput | WebRtcMetricScalarWhereInput[]
    OR?: WebRtcMetricScalarWhereInput[]
    NOT?: WebRtcMetricScalarWhereInput | WebRtcMetricScalarWhereInput[]
    id?: StringFilter<"WebRtcMetric"> | string
    userId?: StringFilter<"WebRtcMetric"> | string
    projectId?: StringNullableFilter<"WebRtcMetric"> | string | null
    metricType?: StringFilter<"WebRtcMetric"> | string
    value?: FloatFilter<"WebRtcMetric"> | number
    peerConnectionId?: StringNullableFilter<"WebRtcMetric"> | string | null
    rttMs?: FloatNullableFilter<"WebRtcMetric"> | number | null
    jitterMs?: FloatNullableFilter<"WebRtcMetric"> | number | null
    packetLoss?: FloatNullableFilter<"WebRtcMetric"> | number | null
    networkType?: StringNullableFilter<"WebRtcMetric"> | string | null
    effectiveType?: StringNullableFilter<"WebRtcMetric"> | string | null
    downlinkMbps?: FloatNullableFilter<"WebRtcMetric"> | number | null
    iceCandidatePairId?: StringNullableFilter<"WebRtcMetric"> | string | null
    localCandidateId?: StringNullableFilter<"WebRtcMetric"> | string | null
    remoteCandidateId?: StringNullableFilter<"WebRtcMetric"> | string | null
    timestamp?: DateTimeFilter<"WebRtcMetric"> | Date | string
    metadata?: StringNullableFilter<"WebRtcMetric"> | string | null
    createdAt?: DateTimeFilter<"WebRtcMetric"> | Date | string
  }

  export type DeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: DeviceWhereUniqueInput
    update: XOR<DeviceUpdateWithoutUserInput, DeviceUncheckedUpdateWithoutUserInput>
    create: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput>
  }

  export type DeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: DeviceWhereUniqueInput
    data: XOR<DeviceUpdateWithoutUserInput, DeviceUncheckedUpdateWithoutUserInput>
  }

  export type DeviceUpdateManyWithWhereWithoutUserInput = {
    where: DeviceScalarWhereInput
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type DeviceScalarWhereInput = {
    AND?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    OR?: DeviceScalarWhereInput[]
    NOT?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    id?: StringFilter<"Device"> | string
    userId?: StringFilter<"Device"> | string
    name?: StringFilter<"Device"> | string
    type?: StringFilter<"Device"> | string
    info?: StringNullableFilter<"Device"> | string | null
    lastActiveAt?: DateTimeFilter<"Device"> | Date | string
    isActive?: BoolFilter<"Device"> | boolean
    createdAt?: DateTimeFilter<"Device"> | Date | string
    updatedAt?: DateTimeFilter<"Device"> | Date | string
  }

  export type FileTransferUpsertWithWhereUniqueWithoutFromUserInput = {
    where: FileTransferWhereUniqueInput
    update: XOR<FileTransferUpdateWithoutFromUserInput, FileTransferUncheckedUpdateWithoutFromUserInput>
    create: XOR<FileTransferCreateWithoutFromUserInput, FileTransferUncheckedCreateWithoutFromUserInput>
  }

  export type FileTransferUpdateWithWhereUniqueWithoutFromUserInput = {
    where: FileTransferWhereUniqueInput
    data: XOR<FileTransferUpdateWithoutFromUserInput, FileTransferUncheckedUpdateWithoutFromUserInput>
  }

  export type FileTransferUpdateManyWithWhereWithoutFromUserInput = {
    where: FileTransferScalarWhereInput
    data: XOR<FileTransferUpdateManyMutationInput, FileTransferUncheckedUpdateManyWithoutFromUserInput>
  }

  export type FileTransferScalarWhereInput = {
    AND?: FileTransferScalarWhereInput | FileTransferScalarWhereInput[]
    OR?: FileTransferScalarWhereInput[]
    NOT?: FileTransferScalarWhereInput | FileTransferScalarWhereInput[]
    id?: StringFilter<"FileTransfer"> | string
    fileName?: StringFilter<"FileTransfer"> | string
    size?: IntFilter<"FileTransfer"> | number
    mimeType?: StringFilter<"FileTransfer"> | string
    fromUserId?: StringFilter<"FileTransfer"> | string
    toUserId?: StringFilter<"FileTransfer"> | string
    status?: StringFilter<"FileTransfer"> | string
    progress?: IntFilter<"FileTransfer"> | number
    fileKey?: StringNullableFilter<"FileTransfer"> | string | null
    createdAt?: DateTimeFilter<"FileTransfer"> | Date | string
    updatedAt?: DateTimeFilter<"FileTransfer"> | Date | string
  }

  export type FileTransferUpsertWithWhereUniqueWithoutToUserInput = {
    where: FileTransferWhereUniqueInput
    update: XOR<FileTransferUpdateWithoutToUserInput, FileTransferUncheckedUpdateWithoutToUserInput>
    create: XOR<FileTransferCreateWithoutToUserInput, FileTransferUncheckedCreateWithoutToUserInput>
  }

  export type FileTransferUpdateWithWhereUniqueWithoutToUserInput = {
    where: FileTransferWhereUniqueInput
    data: XOR<FileTransferUpdateWithoutToUserInput, FileTransferUncheckedUpdateWithoutToUserInput>
  }

  export type FileTransferUpdateManyWithWhereWithoutToUserInput = {
    where: FileTransferScalarWhereInput
    data: XOR<FileTransferUpdateManyMutationInput, FileTransferUncheckedUpdateManyWithoutToUserInput>
  }

  export type UserPluginCreateWithoutPluginInput = {
    id?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserPluginsInput
  }

  export type UserPluginUncheckedCreateWithoutPluginInput = {
    id?: string
    userId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPluginCreateOrConnectWithoutPluginInput = {
    where: UserPluginWhereUniqueInput
    create: XOR<UserPluginCreateWithoutPluginInput, UserPluginUncheckedCreateWithoutPluginInput>
  }

  export type UserPluginCreateManyPluginInputEnvelope = {
    data: UserPluginCreateManyPluginInput | UserPluginCreateManyPluginInput[]
    skipDuplicates?: boolean
  }

  export type UserPluginUpsertWithWhereUniqueWithoutPluginInput = {
    where: UserPluginWhereUniqueInput
    update: XOR<UserPluginUpdateWithoutPluginInput, UserPluginUncheckedUpdateWithoutPluginInput>
    create: XOR<UserPluginCreateWithoutPluginInput, UserPluginUncheckedCreateWithoutPluginInput>
  }

  export type UserPluginUpdateWithWhereUniqueWithoutPluginInput = {
    where: UserPluginWhereUniqueInput
    data: XOR<UserPluginUpdateWithoutPluginInput, UserPluginUncheckedUpdateWithoutPluginInput>
  }

  export type UserPluginUpdateManyWithWhereWithoutPluginInput = {
    where: UserPluginScalarWhereInput
    data: XOR<UserPluginUpdateManyMutationInput, UserPluginUncheckedUpdateManyWithoutPluginInput>
  }

  export type UserCreateWithoutDevicesInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateWithoutDevicesInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserCreateOrConnectWithoutDevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
  }

  export type UserUpsertWithoutDevicesInput = {
    update: XOR<UserUpdateWithoutDevicesInput, UserUncheckedUpdateWithoutDevicesInput>
    create: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDevicesInput, UserUncheckedUpdateWithoutDevicesInput>
  }

  export type UserUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type UserCreateWithoutUserPluginsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateWithoutUserPluginsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserCreateOrConnectWithoutUserPluginsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserPluginsInput, UserUncheckedCreateWithoutUserPluginsInput>
  }

  export type PluginCreateWithoutUserPluginsInput = {
    id?: string
    name: string
    description?: string | null
    version: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PluginUncheckedCreateWithoutUserPluginsInput = {
    id?: string
    name: string
    description?: string | null
    version: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PluginCreateOrConnectWithoutUserPluginsInput = {
    where: PluginWhereUniqueInput
    create: XOR<PluginCreateWithoutUserPluginsInput, PluginUncheckedCreateWithoutUserPluginsInput>
  }

  export type UserUpsertWithoutUserPluginsInput = {
    update: XOR<UserUpdateWithoutUserPluginsInput, UserUncheckedUpdateWithoutUserPluginsInput>
    create: XOR<UserCreateWithoutUserPluginsInput, UserUncheckedCreateWithoutUserPluginsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserPluginsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserPluginsInput, UserUncheckedUpdateWithoutUserPluginsInput>
  }

  export type UserUpdateWithoutUserPluginsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserPluginsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type PluginUpsertWithoutUserPluginsInput = {
    update: XOR<PluginUpdateWithoutUserPluginsInput, PluginUncheckedUpdateWithoutUserPluginsInput>
    create: XOR<PluginCreateWithoutUserPluginsInput, PluginUncheckedCreateWithoutUserPluginsInput>
    where?: PluginWhereInput
  }

  export type PluginUpdateToOneWithWhereWithoutUserPluginsInput = {
    where?: PluginWhereInput
    data: XOR<PluginUpdateWithoutUserPluginsInput, PluginUncheckedUpdateWithoutUserPluginsInput>
  }

  export type PluginUpdateWithoutUserPluginsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PluginUncheckedUpdateWithoutUserPluginsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserCreateWithoutPresenceInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateWithoutPresenceInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserCreateOrConnectWithoutPresenceInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPresenceInput, UserUncheckedCreateWithoutPresenceInput>
  }

  export type UserUpsertWithoutPresenceInput = {
    update: XOR<UserUpdateWithoutPresenceInput, UserUncheckedUpdateWithoutPresenceInput>
    create: XOR<UserCreateWithoutPresenceInput, UserUncheckedCreateWithoutPresenceInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPresenceInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPresenceInput, UserUncheckedUpdateWithoutPresenceInput>
  }

  export type UserUpdateWithoutPresenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPresenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type UserCreateWithoutActivityLogsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateWithoutActivityLogsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserCreateOrConnectWithoutActivityLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
  }

  export type ProjectCreateWithoutActivityLogsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    snapshots?: SnapshotCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutActivityLogsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutActivityLogsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutActivityLogsInput, ProjectUncheckedCreateWithoutActivityLogsInput>
  }

  export type UserUpsertWithoutActivityLogsInput = {
    update: XOR<UserUpdateWithoutActivityLogsInput, UserUncheckedUpdateWithoutActivityLogsInput>
    create: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActivityLogsInput, UserUncheckedUpdateWithoutActivityLogsInput>
  }

  export type UserUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type ProjectUpsertWithoutActivityLogsInput = {
    update: XOR<ProjectUpdateWithoutActivityLogsInput, ProjectUncheckedUpdateWithoutActivityLogsInput>
    create: XOR<ProjectCreateWithoutActivityLogsInput, ProjectUncheckedCreateWithoutActivityLogsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutActivityLogsInput, ProjectUncheckedUpdateWithoutActivityLogsInput>
  }

  export type ProjectUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    snapshots?: SnapshotUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    snapshots?: SnapshotUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserCreateWithoutCrashReportsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateWithoutCrashReportsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserCreateOrConnectWithoutCrashReportsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCrashReportsInput, UserUncheckedCreateWithoutCrashReportsInput>
  }

  export type UserUpsertWithoutCrashReportsInput = {
    update: XOR<UserUpdateWithoutCrashReportsInput, UserUncheckedUpdateWithoutCrashReportsInput>
    create: XOR<UserCreateWithoutCrashReportsInput, UserUncheckedCreateWithoutCrashReportsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCrashReportsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCrashReportsInput, UserUncheckedUpdateWithoutCrashReportsInput>
  }

  export type UserUpdateWithoutCrashReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCrashReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type UserCreateWithoutWebRtcMetricsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateWithoutWebRtcMetricsInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserCreateOrConnectWithoutWebRtcMetricsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWebRtcMetricsInput, UserUncheckedCreateWithoutWebRtcMetricsInput>
  }

  export type UserUpsertWithoutWebRtcMetricsInput = {
    update: XOR<UserUpdateWithoutWebRtcMetricsInput, UserUncheckedUpdateWithoutWebRtcMetricsInput>
    create: XOR<UserCreateWithoutWebRtcMetricsInput, UserUncheckedCreateWithoutWebRtcMetricsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWebRtcMetricsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWebRtcMetricsInput, UserUncheckedUpdateWithoutWebRtcMetricsInput>
  }

  export type UserUpdateWithoutWebRtcMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWebRtcMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type SnapshotCreateWithoutProjectInput = {
    id?: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tags?: EntityTagCreateNestedManyWithoutSnapshotInput
  }

  export type SnapshotUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tags?: EntityTagUncheckedCreateNestedManyWithoutSnapshotInput
  }

  export type SnapshotCreateOrConnectWithoutProjectInput = {
    where: SnapshotWhereUniqueInput
    create: XOR<SnapshotCreateWithoutProjectInput, SnapshotUncheckedCreateWithoutProjectInput>
  }

  export type SnapshotCreateManyProjectInputEnvelope = {
    data: SnapshotCreateManyProjectInput | SnapshotCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ActivityLogCreateWithoutProjectInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutActivityLogsInput
  }

  export type ActivityLogUncheckedCreateWithoutProjectInput = {
    id?: string
    userId: string
    action: string
    entityType: string
    entityId: string
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type ActivityLogCreateOrConnectWithoutProjectInput = {
    where: ActivityLogWhereUniqueInput
    create: XOR<ActivityLogCreateWithoutProjectInput, ActivityLogUncheckedCreateWithoutProjectInput>
  }

  export type ActivityLogCreateManyProjectInputEnvelope = {
    data: ActivityLogCreateManyProjectInput | ActivityLogCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type SnapshotUpsertWithWhereUniqueWithoutProjectInput = {
    where: SnapshotWhereUniqueInput
    update: XOR<SnapshotUpdateWithoutProjectInput, SnapshotUncheckedUpdateWithoutProjectInput>
    create: XOR<SnapshotCreateWithoutProjectInput, SnapshotUncheckedCreateWithoutProjectInput>
  }

  export type SnapshotUpdateWithWhereUniqueWithoutProjectInput = {
    where: SnapshotWhereUniqueInput
    data: XOR<SnapshotUpdateWithoutProjectInput, SnapshotUncheckedUpdateWithoutProjectInput>
  }

  export type SnapshotUpdateManyWithWhereWithoutProjectInput = {
    where: SnapshotScalarWhereInput
    data: XOR<SnapshotUpdateManyMutationInput, SnapshotUncheckedUpdateManyWithoutProjectInput>
  }

  export type SnapshotScalarWhereInput = {
    AND?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
    OR?: SnapshotScalarWhereInput[]
    NOT?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
    id?: StringFilter<"Snapshot"> | string
    projectId?: StringFilter<"Snapshot"> | string
    name?: StringFilter<"Snapshot"> | string
    description?: StringNullableFilter<"Snapshot"> | string | null
    data?: StringFilter<"Snapshot"> | string
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
    updatedAt?: DateTimeFilter<"Snapshot"> | Date | string
  }

  export type ActivityLogUpsertWithWhereUniqueWithoutProjectInput = {
    where: ActivityLogWhereUniqueInput
    update: XOR<ActivityLogUpdateWithoutProjectInput, ActivityLogUncheckedUpdateWithoutProjectInput>
    create: XOR<ActivityLogCreateWithoutProjectInput, ActivityLogUncheckedCreateWithoutProjectInput>
  }

  export type ActivityLogUpdateWithWhereUniqueWithoutProjectInput = {
    where: ActivityLogWhereUniqueInput
    data: XOR<ActivityLogUpdateWithoutProjectInput, ActivityLogUncheckedUpdateWithoutProjectInput>
  }

  export type ActivityLogUpdateManyWithWhereWithoutProjectInput = {
    where: ActivityLogScalarWhereInput
    data: XOR<ActivityLogUpdateManyMutationInput, ActivityLogUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectCreateWithoutSnapshotsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    activityLogs?: ActivityLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutSnapshotsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutSnapshotsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutSnapshotsInput, ProjectUncheckedCreateWithoutSnapshotsInput>
  }

  export type EntityTagCreateWithoutSnapshotInput = {
    id?: string
    entityType: string
    entityId: string
    createdAt?: Date | string
    tag: TagCreateNestedOneWithoutEntityTagsInput
  }

  export type EntityTagUncheckedCreateWithoutSnapshotInput = {
    id?: string
    entityType: string
    entityId: string
    tagId: string
    createdAt?: Date | string
  }

  export type EntityTagCreateOrConnectWithoutSnapshotInput = {
    where: EntityTagWhereUniqueInput
    create: XOR<EntityTagCreateWithoutSnapshotInput, EntityTagUncheckedCreateWithoutSnapshotInput>
  }

  export type EntityTagCreateManySnapshotInputEnvelope = {
    data: EntityTagCreateManySnapshotInput | EntityTagCreateManySnapshotInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutSnapshotsInput = {
    update: XOR<ProjectUpdateWithoutSnapshotsInput, ProjectUncheckedUpdateWithoutSnapshotsInput>
    create: XOR<ProjectCreateWithoutSnapshotsInput, ProjectUncheckedCreateWithoutSnapshotsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutSnapshotsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutSnapshotsInput, ProjectUncheckedUpdateWithoutSnapshotsInput>
  }

  export type ProjectUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityLogs?: ActivityLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type EntityTagUpsertWithWhereUniqueWithoutSnapshotInput = {
    where: EntityTagWhereUniqueInput
    update: XOR<EntityTagUpdateWithoutSnapshotInput, EntityTagUncheckedUpdateWithoutSnapshotInput>
    create: XOR<EntityTagCreateWithoutSnapshotInput, EntityTagUncheckedCreateWithoutSnapshotInput>
  }

  export type EntityTagUpdateWithWhereUniqueWithoutSnapshotInput = {
    where: EntityTagWhereUniqueInput
    data: XOR<EntityTagUpdateWithoutSnapshotInput, EntityTagUncheckedUpdateWithoutSnapshotInput>
  }

  export type EntityTagUpdateManyWithWhereWithoutSnapshotInput = {
    where: EntityTagScalarWhereInput
    data: XOR<EntityTagUpdateManyMutationInput, EntityTagUncheckedUpdateManyWithoutSnapshotInput>
  }

  export type EntityTagScalarWhereInput = {
    AND?: EntityTagScalarWhereInput | EntityTagScalarWhereInput[]
    OR?: EntityTagScalarWhereInput[]
    NOT?: EntityTagScalarWhereInput | EntityTagScalarWhereInput[]
    id?: StringFilter<"EntityTag"> | string
    entityType?: StringFilter<"EntityTag"> | string
    entityId?: StringFilter<"EntityTag"> | string
    tagId?: StringFilter<"EntityTag"> | string
    snapshotId?: StringNullableFilter<"EntityTag"> | string | null
    createdAt?: DateTimeFilter<"EntityTag"> | Date | string
  }

  export type EntityTagCreateWithoutTagInput = {
    id?: string
    entityType: string
    entityId: string
    createdAt?: Date | string
    snapshot?: SnapshotCreateNestedOneWithoutTagsInput
  }

  export type EntityTagUncheckedCreateWithoutTagInput = {
    id?: string
    entityType: string
    entityId: string
    snapshotId?: string | null
    createdAt?: Date | string
  }

  export type EntityTagCreateOrConnectWithoutTagInput = {
    where: EntityTagWhereUniqueInput
    create: XOR<EntityTagCreateWithoutTagInput, EntityTagUncheckedCreateWithoutTagInput>
  }

  export type EntityTagCreateManyTagInputEnvelope = {
    data: EntityTagCreateManyTagInput | EntityTagCreateManyTagInput[]
    skipDuplicates?: boolean
  }

  export type EntityTagUpsertWithWhereUniqueWithoutTagInput = {
    where: EntityTagWhereUniqueInput
    update: XOR<EntityTagUpdateWithoutTagInput, EntityTagUncheckedUpdateWithoutTagInput>
    create: XOR<EntityTagCreateWithoutTagInput, EntityTagUncheckedCreateWithoutTagInput>
  }

  export type EntityTagUpdateWithWhereUniqueWithoutTagInput = {
    where: EntityTagWhereUniqueInput
    data: XOR<EntityTagUpdateWithoutTagInput, EntityTagUncheckedUpdateWithoutTagInput>
  }

  export type EntityTagUpdateManyWithWhereWithoutTagInput = {
    where: EntityTagScalarWhereInput
    data: XOR<EntityTagUpdateManyMutationInput, EntityTagUncheckedUpdateManyWithoutTagInput>
  }

  export type TagCreateWithoutEntityTagsInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagUncheckedCreateWithoutEntityTagsInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagCreateOrConnectWithoutEntityTagsInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutEntityTagsInput, TagUncheckedCreateWithoutEntityTagsInput>
  }

  export type SnapshotCreateWithoutTagsInput = {
    id?: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutSnapshotsInput
  }

  export type SnapshotUncheckedCreateWithoutTagsInput = {
    id?: string
    projectId: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SnapshotCreateOrConnectWithoutTagsInput = {
    where: SnapshotWhereUniqueInput
    create: XOR<SnapshotCreateWithoutTagsInput, SnapshotUncheckedCreateWithoutTagsInput>
  }

  export type TagUpsertWithoutEntityTagsInput = {
    update: XOR<TagUpdateWithoutEntityTagsInput, TagUncheckedUpdateWithoutEntityTagsInput>
    create: XOR<TagCreateWithoutEntityTagsInput, TagUncheckedCreateWithoutEntityTagsInput>
    where?: TagWhereInput
  }

  export type TagUpdateToOneWithWhereWithoutEntityTagsInput = {
    where?: TagWhereInput
    data: XOR<TagUpdateWithoutEntityTagsInput, TagUncheckedUpdateWithoutEntityTagsInput>
  }

  export type TagUpdateWithoutEntityTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateWithoutEntityTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUpsertWithoutTagsInput = {
    update: XOR<SnapshotUpdateWithoutTagsInput, SnapshotUncheckedUpdateWithoutTagsInput>
    create: XOR<SnapshotCreateWithoutTagsInput, SnapshotUncheckedCreateWithoutTagsInput>
    where?: SnapshotWhereInput
  }

  export type SnapshotUpdateToOneWithWhereWithoutTagsInput = {
    where?: SnapshotWhereInput
    data: XOR<SnapshotUpdateWithoutTagsInput, SnapshotUncheckedUpdateWithoutTagsInput>
  }

  export type SnapshotUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutSnapshotsNestedInput
  }

  export type SnapshotUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutFromTransfersInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    toTransfers?: FileTransferCreateNestedManyWithoutToUserInput
  }

  export type UserUncheckedCreateWithoutFromTransfersInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    toTransfers?: FileTransferUncheckedCreateNestedManyWithoutToUserInput
  }

  export type UserCreateOrConnectWithoutFromTransfersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFromTransfersInput, UserUncheckedCreateWithoutFromTransfersInput>
  }

  export type UserCreateWithoutToTransfersInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginCreateNestedManyWithoutUserInput
    presence?: UserPresenceCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogCreateNestedManyWithoutUserInput
    crashReports?: CrashReportCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferCreateNestedManyWithoutFromUserInput
  }

  export type UserUncheckedCreateWithoutToTransfersInput = {
    id?: string
    email: string
    name?: string | null
    displayName?: string | null
    bio?: string | null
    avatarUrl?: string | null
    password: string
    refreshToken?: string | null
    isApproved?: boolean
    inventoryHash?: string | null
    lastLoginAt?: Date | string | null
    lastInventorySync?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    userPlugins?: UserPluginUncheckedCreateNestedManyWithoutUserInput
    presence?: UserPresenceUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ActivityLogUncheckedCreateNestedManyWithoutUserInput
    crashReports?: CrashReportUncheckedCreateNestedManyWithoutUserInput
    webRtcMetrics?: WebRtcMetricUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    fromTransfers?: FileTransferUncheckedCreateNestedManyWithoutFromUserInput
  }

  export type UserCreateOrConnectWithoutToTransfersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutToTransfersInput, UserUncheckedCreateWithoutToTransfersInput>
  }

  export type UserUpsertWithoutFromTransfersInput = {
    update: XOR<UserUpdateWithoutFromTransfersInput, UserUncheckedUpdateWithoutFromTransfersInput>
    create: XOR<UserCreateWithoutFromTransfersInput, UserUncheckedCreateWithoutFromTransfersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFromTransfersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFromTransfersInput, UserUncheckedUpdateWithoutFromTransfersInput>
  }

  export type UserUpdateWithoutFromTransfersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    toTransfers?: FileTransferUpdateManyWithoutToUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFromTransfersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    toTransfers?: FileTransferUncheckedUpdateManyWithoutToUserNestedInput
  }

  export type UserUpsertWithoutToTransfersInput = {
    update: XOR<UserUpdateWithoutToTransfersInput, UserUncheckedUpdateWithoutToTransfersInput>
    create: XOR<UserCreateWithoutToTransfersInput, UserUncheckedCreateWithoutToTransfersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutToTransfersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutToTransfersInput, UserUncheckedUpdateWithoutToTransfersInput>
  }

  export type UserUpdateWithoutToTransfersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUpdateManyWithoutFromUserNestedInput
  }

  export type UserUncheckedUpdateWithoutToTransfersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    isApproved?: BoolFieldUpdateOperationsInput | boolean
    inventoryHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInventorySync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userPlugins?: UserPluginUncheckedUpdateManyWithoutUserNestedInput
    presence?: UserPresenceUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ActivityLogUncheckedUpdateManyWithoutUserNestedInput
    crashReports?: CrashReportUncheckedUpdateManyWithoutUserNestedInput
    webRtcMetrics?: WebRtcMetricUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    fromTransfers?: FileTransferUncheckedUpdateManyWithoutFromUserNestedInput
  }

  export type UserPluginCreateManyUserInput = {
    id?: string
    pluginId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPresenceCreateManyUserInput = {
    id?: string
    projectId?: string | null
    status: string
    expiresAt: Date | string
    lastSeen?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActivityLogCreateManyUserInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    projectId?: string | null
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type CrashReportCreateManyUserInput = {
    id?: string
    error: string
    stackTrace: string
    stack?: string | null
    breadcrumbs?: string | null
    context?: string | null
    projectId?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type WebRtcMetricCreateManyUserInput = {
    id?: string
    projectId?: string | null
    metricType: string
    value: number
    peerConnectionId?: string | null
    rttMs?: number | null
    jitterMs?: number | null
    packetLoss?: number | null
    networkType?: string | null
    effectiveType?: string | null
    downlinkMbps?: number | null
    iceCandidatePairId?: string | null
    localCandidateId?: string | null
    remoteCandidateId?: string | null
    timestamp: Date | string
    metadata?: string | null
    createdAt?: Date | string
  }

  export type DeviceCreateManyUserInput = {
    id?: string
    name: string
    type: string
    info?: string | null
    lastActiveAt: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileTransferCreateManyFromUserInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    toUserId: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileTransferCreateManyToUserInput = {
    id?: string
    fileName: string
    size: number
    mimeType: string
    fromUserId: string
    status?: string
    progress?: number
    fileKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPluginUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plugin?: PluginUpdateOneRequiredWithoutUserPluginsNestedInput
  }

  export type UserPluginUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    pluginId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPluginUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    pluginId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPresenceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPresenceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPresenceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneWithoutActivityLogsNestedInput
  }

  export type ActivityLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashReportUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    error?: StringFieldUpdateOperationsInput | string
    stackTrace?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    breadcrumbs?: NullableStringFieldUpdateOperationsInput | string | null
    context?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashReportUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    error?: StringFieldUpdateOperationsInput | string
    stackTrace?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    breadcrumbs?: NullableStringFieldUpdateOperationsInput | string | null
    context?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashReportUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    error?: StringFieldUpdateOperationsInput | string
    stackTrace?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    breadcrumbs?: NullableStringFieldUpdateOperationsInput | string | null
    context?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebRtcMetricUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metricType?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    peerConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    rttMs?: NullableFloatFieldUpdateOperationsInput | number | null
    jitterMs?: NullableFloatFieldUpdateOperationsInput | number | null
    packetLoss?: NullableFloatFieldUpdateOperationsInput | number | null
    networkType?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveType?: NullableStringFieldUpdateOperationsInput | string | null
    downlinkMbps?: NullableFloatFieldUpdateOperationsInput | number | null
    iceCandidatePairId?: NullableStringFieldUpdateOperationsInput | string | null
    localCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    remoteCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebRtcMetricUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metricType?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    peerConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    rttMs?: NullableFloatFieldUpdateOperationsInput | number | null
    jitterMs?: NullableFloatFieldUpdateOperationsInput | number | null
    packetLoss?: NullableFloatFieldUpdateOperationsInput | number | null
    networkType?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveType?: NullableStringFieldUpdateOperationsInput | string | null
    downlinkMbps?: NullableFloatFieldUpdateOperationsInput | number | null
    iceCandidatePairId?: NullableStringFieldUpdateOperationsInput | string | null
    localCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    remoteCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebRtcMetricUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metricType?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    peerConnectionId?: NullableStringFieldUpdateOperationsInput | string | null
    rttMs?: NullableFloatFieldUpdateOperationsInput | number | null
    jitterMs?: NullableFloatFieldUpdateOperationsInput | number | null
    packetLoss?: NullableFloatFieldUpdateOperationsInput | number | null
    networkType?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveType?: NullableStringFieldUpdateOperationsInput | string | null
    downlinkMbps?: NullableFloatFieldUpdateOperationsInput | number | null
    iceCandidatePairId?: NullableStringFieldUpdateOperationsInput | string | null
    localCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    remoteCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    info?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    info?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    info?: NullableStringFieldUpdateOperationsInput | string | null
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileTransferUpdateWithoutFromUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    toUser?: UserUpdateOneRequiredWithoutToTransfersNestedInput
  }

  export type FileTransferUncheckedUpdateWithoutFromUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    toUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileTransferUncheckedUpdateManyWithoutFromUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    toUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileTransferUpdateWithoutToUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromUser?: UserUpdateOneRequiredWithoutFromTransfersNestedInput
  }

  export type FileTransferUncheckedUpdateWithoutToUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    fromUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileTransferUncheckedUpdateManyWithoutToUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    fromUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    fileKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPluginCreateManyPluginInput = {
    id?: string
    userId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPluginUpdateWithoutPluginInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserPluginsNestedInput
  }

  export type UserPluginUncheckedUpdateWithoutPluginInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPluginUncheckedUpdateManyWithoutPluginInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotCreateManyProjectInput = {
    id?: string
    name: string
    description?: string | null
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActivityLogCreateManyProjectInput = {
    id?: string
    userId: string
    action: string
    entityType: string
    entityId: string
    metadata?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type SnapshotUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: EntityTagUpdateManyWithoutSnapshotNestedInput
  }

  export type SnapshotUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: EntityTagUncheckedUpdateManyWithoutSnapshotNestedInput
  }

  export type SnapshotUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActivityLogsNestedInput
  }

  export type ActivityLogUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivityLogUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityTagCreateManySnapshotInput = {
    id?: string
    entityType: string
    entityId: string
    tagId: string
    createdAt?: Date | string
  }

  export type EntityTagUpdateWithoutSnapshotInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: TagUpdateOneRequiredWithoutEntityTagsNestedInput
  }

  export type EntityTagUncheckedUpdateWithoutSnapshotInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityTagUncheckedUpdateManyWithoutSnapshotInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityTagCreateManyTagInput = {
    id?: string
    entityType: string
    entityId: string
    snapshotId?: string | null
    createdAt?: Date | string
  }

  export type EntityTagUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshot?: SnapshotUpdateOneWithoutTagsNestedInput
  }

  export type EntityTagUncheckedUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    snapshotId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityTagUncheckedUpdateManyWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    snapshotId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PluginCountOutputTypeDefaultArgs instead
     */
    export type PluginCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PluginCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectCountOutputTypeDefaultArgs instead
     */
    export type ProjectCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SnapshotCountOutputTypeDefaultArgs instead
     */
    export type SnapshotCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SnapshotCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TagCountOutputTypeDefaultArgs instead
     */
    export type TagCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TagCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PluginDefaultArgs instead
     */
    export type PluginArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PluginDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeviceDefaultArgs instead
     */
    export type DeviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeviceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserPluginDefaultArgs instead
     */
    export type UserPluginArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserPluginDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserPresenceDefaultArgs instead
     */
    export type UserPresenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserPresenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActivityLogDefaultArgs instead
     */
    export type ActivityLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActivityLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CrashReportDefaultArgs instead
     */
    export type CrashReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CrashReportDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WebRtcMetricDefaultArgs instead
     */
    export type WebRtcMetricArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WebRtcMetricDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectDefaultArgs instead
     */
    export type ProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SnapshotDefaultArgs instead
     */
    export type SnapshotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SnapshotDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TagDefaultArgs instead
     */
    export type TagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TagDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EntityTagDefaultArgs instead
     */
    export type EntityTagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EntityTagDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileTransferDefaultArgs instead
     */
    export type FileTransferArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileTransferDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}