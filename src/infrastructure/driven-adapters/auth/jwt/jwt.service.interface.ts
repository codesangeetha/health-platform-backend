export interface IJwtService {
  /**
   * Sign a JWT token with the given payload
   * @param payload - The payload to sign
   * @returns Promise<string> - The signed JWT token
   */
  signToken(payload: any): Promise<string>;

  /**
   * Verify a JWT token and return the decoded payload
   * @param token - The JWT token to verify
   * @returns Promise<any> - The decoded payload
   */
  verifyToken(token: string): Promise<any>;
}