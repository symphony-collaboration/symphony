class ServiceExistsError extends Error {
  public readonly name: string;
  public readonly message: string;

  constructor(message: string) {
    super(message);

    this.name = "ServiceExistsError";
  }
}

export { ServiceExistsError }
