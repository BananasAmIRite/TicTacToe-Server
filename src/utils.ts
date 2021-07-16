import ShortUniqueId from 'short-unique-id';

export default class Utils {
  static uid: ShortUniqueId = new ShortUniqueId();
  static generateKey(len: number): string {
    return this.uid.stamp(len);
  }

  static generate32Key(): string {
    return this.generateKey(32);
  }

  static generate16Key(): string {
    return this.generateKey(16);
  }
}
