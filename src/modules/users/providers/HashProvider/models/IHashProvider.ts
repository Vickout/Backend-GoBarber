export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(pauyload: string, hashed: string): Promise<boolean>;
}
