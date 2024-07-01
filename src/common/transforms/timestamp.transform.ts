export class TimestampTransformer {
  static convert(value: Date): number {
    return Math.floor(value.getTime() / 1000);
  }
}
