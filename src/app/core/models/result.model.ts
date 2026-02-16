export class Result<T> {
  private constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly error?: string,
    public readonly code?: string
  ) {}

  public static ok<T>(data: T): Result<T> {
    return new Result(true, data);
  }

  public static fail<T>(error: string, code?: string): Result<T> {
    return new Result<T>(false, undefined, error, code);
  }
}