/**
 * OAuth Integration Service
 * 
 * Enterprise-grade OAuth integration with support for multiple providers
 * including Google, GitHub, Microsoft, and custom OAuth providers.
 * 
 * @author React Responsive Easy CLI
 * @version 2.0.0
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes } from 'crypto';

export interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  config: OAuthProviderConfig;
  scopes: string[];
  endpoints: OAuthEndpoints;
  userInfoMapping: UserInfoMapping;
}

export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  responseType: 'code' | 'token';
  grantType: 'authorization_code' | 'client_credentials';
  scope: string;
  state: string;
  nonce?: string;
  pkce?: boolean;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256' | 'plain';
}

export interface OAuthEndpoints {
  authorization: string;
  token: string;
  userInfo: string;
  revoke?: string;
  introspect?: string;
}

export interface UserInfoMapping {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string;
  locale: string;
  timezone: string;
  verified: string;
  custom: Record<string, string>;
}

export interface OAuthToken {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  issuedAt: Date;
  expiresAt: Date;
}

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  locale?: string;
  timezone?: string;
  verified: boolean;
  provider: string;
  providerId: string;
  custom: Record<string, any>;
}

export interface OAuthSession {
  id: string;
  provider: string;
  userId: string;
  token: OAuthToken;
  user: OAuthUser;
  createdAt: Date;
  expiresAt: Date;
  metadata: SessionMetadata;
}

export interface SessionMetadata {
  ipAddress: string;
  userAgent: string;
  device: string;
  location?: string;
  isNewUser: boolean;
  lastLogin?: Date;
}

export interface OAuthError {
  error: string;
  errorDescription?: string;
  errorUri?: string;
  state?: string;
}

export class OAuthService extends EventEmitter {
  private providers: Map<string, OAuthProvider> = new Map();
  private sessions: Map<string, OAuthSession> = new Map();
  private tokens: Map<string, OAuthToken> = new Map();

  constructor() {
    super();
    this.initializeDefaultProviders();
  }

  /**
   * Initialize default OAuth providers
   */
  private initializeDefaultProviders(): void {
    // Google OAuth
    this.addProvider({
      id: 'google',
      name: 'google',
      displayName: 'Google',
      icon: '🔍',
      color: '#4285F4',
      config: {
        clientId: '',
        clientSecret: '',
        redirectUri: 'http://localhost:3000/auth/callback',
        responseType: 'code',
        grantType: 'authorization_code',
        scope: 'openid email profile',
        state: '',
        pkce: true
      },
      scopes: ['openid', 'email', 'profile'],
      endpoints: {
        authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
        token: 'https://oauth2.googleapis.com/token',
        userInfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
        revoke: 'https://oauth2.googleapis.com/revoke'
      },
      userInfoMapping: {
        id: 'id',
        email: 'email',
        name: 'name',
        firstName: 'given_name',
        lastName: 'family_name',
        avatar: 'picture',
        locale: 'locale',
        timezone: 'timezone',
        verified: 'verified_email',
        custom: {}
      }
    });

    // GitHub OAuth
    this.addProvider({
      id: 'github',
      name: 'github',
      displayName: 'GitHub',
      icon: '🐙',
      color: '#333333',
      config: {
        clientId: '',
        clientSecret: '',
        redirectUri: 'http://localhost:3000/auth/callback',
        responseType: 'code',
        grantType: 'authorization_code',
        scope: 'user:email',
        state: '',
        pkce: true
      },
      scopes: ['user:email', 'read:user'],
      endpoints: {
        authorization: 'https://github.com/login/oauth/authorize',
        token: 'https://github.com/login/oauth/access_token',
        userInfo: 'https://api.github.com/user',
        revoke: 'https://api.github.com/applications/{client_id}/tokens/{access_token}'
      },
      userInfoMapping: {
        id: 'id',
        email: 'email',
        name: 'name',
        firstName: 'name',
        lastName: 'name',
        avatar: 'avatar_url',
        locale: 'location',
        timezone: 'timezone',
        verified: 'email_verified',
        custom: {
          login: 'login',
          bio: 'bio',
          company: 'company',
          blog: 'blog',
          location: 'location',
          publicRepos: 'public_repos',
          publicGists: 'public_gists',
          followers: 'followers',
          following: 'following'
        }
      }
    });

    // Microsoft OAuth
    this.addProvider({
      id: 'microsoft',
      name: 'microsoft',
      displayName: 'Microsoft',
      icon: '🪟',
      color: '#0078D4',
      config: {
        clientId: '',
        clientSecret: '',
        redirectUri: 'http://localhost:3000/auth/callback',
        responseType: 'code',
        grantType: 'authorization_code',
        scope: 'openid email profile',
        state: '',
        pkce: true
      },
      scopes: ['openid', 'email', 'profile'],
      endpoints: {
        authorization: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        userInfo: 'https://graph.microsoft.com/v1.0/me',
        revoke: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout'
      },
      userInfoMapping: {
        id: 'id',
        email: 'mail',
        name: 'displayName',
        firstName: 'givenName',
        lastName: 'surname',
        avatar: 'photo',
        locale: 'preferredLanguage',
        timezone: 'timezone',
        verified: 'verified',
        custom: {
          jobTitle: 'jobTitle',
          officeLocation: 'officeLocation',
          department: 'department',
          companyName: 'companyName',
          userPrincipalName: 'userPrincipalName'
        }
      }
    });
  }

  /**
   * Add OAuth provider
   */
  addProvider(provider: OAuthProvider): void {
    this.providers.set(provider.id, provider);
    this.emit('provider-added', provider);
  }

  /**
   * Remove OAuth provider
   */
  removeProvider(providerId: string): void {
    const provider = this.providers.get(providerId);
    if (provider) {
      this.providers.delete(providerId);
      this.emit('provider-removed', provider);
    }
  }

  /**
   * Get OAuth provider
   */
  getProvider(providerId: string): OAuthProvider | null {
    return this.providers.get(providerId) ?? null;
  }

  /**
   * Get all OAuth providers
   */
  getProviders(): OAuthProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Generate authorization URL
   */
  generateAuthorizationUrl(providerId: string, options: {
    state?: string;
    nonce?: string;
    scopes?: string[];
    customParams?: Record<string, string>;
  } = {}): string {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`OAuth provider not found: ${providerId}`);
    }

    const state = options.state ?? this.generateState();
    const nonce = options.nonce ?? this.generateNonce();
    const scopes = options.scopes ?? provider.scopes;

    const params = new URLSearchParams({
      client_id: provider.config.clientId,
      redirect_uri: provider.config.redirectUri,
      response_type: provider.config.responseType,
      scope: scopes.join(' '),
      state,
      nonce
    });

    // Add PKCE parameters if enabled
    if (provider.config.pkce) {
      const codeChallenge = this.generateCodeChallenge();
      const codeChallengeMethod = 'S256';
      
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', codeChallengeMethod);
      
      // Store code challenge for later verification
      this.tokens.set(`challenge_${state}`, {
        accessToken: codeChallenge,
        tokenType: 'code_challenge',
        expiresIn: 600, // 10 minutes
        scope: '',
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 600000)
      });
    }

    // Add custom parameters
    if (options.customParams) {
      Object.entries(options.customParams).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    const url = `${provider.endpoints.authorization}?${params.toString()}`;
    
    this.emit('authorization-url-generated', { providerId, url, state });
    return url;
  }

  /**
   * Exchange authorization code for token
   */
  async exchangeCodeForToken(providerId: string, code: string, state: string): Promise<OAuthToken> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`OAuth provider not found: ${providerId}`);
    }

    try {
      const tokenData = {
        grant_type: provider.config.grantType,
        client_id: provider.config.clientId,
        client_secret: provider.config.clientSecret,
        code,
        redirect_uri: provider.config.redirectUri
      };

      // Add PKCE code verifier if enabled
      if (provider.config.pkce) {
        const challengeToken = this.tokens.get(`challenge_${state}`);
        if (challengeToken) {
          (tokenData as any)['code_verifier'] = challengeToken.accessToken;
          this.tokens.delete(`challenge_${state}`);
        }
      }

      const response = await this.makeTokenRequest(provider.endpoints.token, tokenData);
      
      const token: OAuthToken = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type ?? 'Bearer',
        expiresIn: response.expires_in ?? 3600,
        scope: response.scope ?? '',
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + (response.expires_in ?? 3600) * 1000)
      };

      this.tokens.set(token.accessToken, token);
      this.emit('token-received', { providerId, token });
      
      return token;
    } catch (error) {
      this.emit('error', new Error(`Token exchange failed: ${error}`));
      throw error;
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(providerId: string, token: OAuthToken): Promise<OAuthUser> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`OAuth provider not found: ${providerId}`);
    }

    try {
      const response = await this.makeUserInfoRequest(provider.endpoints.userInfo, token);
      const user = this.mapUserInfo(response, provider.userInfoMapping, providerId);
      
      this.emit('user-info-received', { providerId, user });
      return user;
    } catch (error) {
      this.emit('error', new Error(`User info request failed: ${error}`));
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(providerId: string, refreshToken: string): Promise<OAuthToken> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`OAuth provider not found: ${providerId}`);
    }

    try {
      const tokenData = {
        grant_type: 'refresh_token',
        client_id: provider.config.clientId,
        client_secret: provider.config.clientSecret,
        refresh_token: refreshToken
      };

      const response = await this.makeTokenRequest(provider.endpoints.token, tokenData);
      
      const token: OAuthToken = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token ?? refreshToken,
        tokenType: response.token_type ?? 'Bearer',
        expiresIn: response.expires_in ?? 3600,
        scope: response.scope ?? '',
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + (response.expires_in ?? 3600) * 1000)
      };

      this.tokens.set(token.accessToken, token);
      this.emit('token-refreshed', { providerId, token });
      
      return token;
    } catch (error) {
      this.emit('error', new Error(`Token refresh failed: ${error}`));
      throw error;
    }
  }

  /**
   * Revoke token
   */
  async revokeToken(providerId: string, token: string): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`OAuth provider not found: ${providerId}`);
    }

    if (!provider.endpoints.revoke) {
      throw new Error(`Token revocation not supported for provider: ${providerId}`);
    }

    try {
      await this.makeRevokeRequest(provider.endpoints.revoke, token, provider.config.clientId);
      
      this.tokens.delete(token);
      this.emit('token-revoked', { providerId, token });
    } catch (error) {
      this.emit('error', new Error(`Token revocation failed: ${error}`));
      throw error;
    }
  }

  /**
   * Create OAuth session
   */
  createSession(providerId: string, user: OAuthUser, token: OAuthToken, metadata: SessionMetadata): OAuthSession {
    const sessionId = uuidv4();
    const session: OAuthSession = {
      id: sessionId,
      provider: providerId,
      userId: user.id,
      token,
      user,
      createdAt: new Date(),
      expiresAt: token.expiresAt,
      metadata
    };

    this.sessions.set(sessionId, session);
    this.emit('session-created', session);
    
    return session;
  }

  /**
   * Get OAuth session
   */
  getSession(sessionId: string): OAuthSession | null {
    return this.sessions.get(sessionId) ?? null;
  }

  /**
   * Destroy OAuth session
   */
  destroySession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);
      this.emit('session-destroyed', session);
    }
  }

  /**
   * Validate OAuth session
   */
  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    if (session.expiresAt < new Date()) {
      this.destroySession(sessionId);
      return false;
    }

    return true;
  }

  /**
   * Helper methods
   */
  private generateState(): string {
    return randomBytes(32).toString('hex');
  }

  private generateNonce(): string {
    return randomBytes(16).toString('hex');
  }

  private generateCodeChallenge(): string {
    const codeVerifier = randomBytes(32).toString('base64url');
    return createHash('sha256').update(codeVerifier).digest('base64url');
  }

  private mapUserInfo(userInfo: any, mapping: UserInfoMapping, providerId: string): OAuthUser {
    return {
      id: userInfo[mapping.id]?.toString() ?? '',
      email: userInfo[mapping.email] ?? '',
      name: userInfo[mapping.name] ?? '',
      firstName: userInfo[mapping.firstName] ?? '',
      lastName: userInfo[mapping.lastName] ?? '',
      avatar: userInfo[mapping.avatar],
      locale: userInfo[mapping.locale],
      timezone: userInfo[mapping.timezone],
      verified: Boolean(userInfo[mapping.verified]),
      provider: providerId,
      providerId: userInfo[mapping.id]?.toString() ?? '',
      custom: Object.entries(mapping.custom).reduce((acc, [key, value]) => {
        acc[key] = userInfo[value];
        return acc;
      }, {} as Record<string, any>)
    };
  }

  private async makeTokenRequest(_url: string, _data: Record<string, any>): Promise<any> {
    // Mock implementation - in real implementation, make HTTP request
    return {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'openid email profile'
    };
  }

  private async makeUserInfoRequest(_url: string, _token: OAuthToken): Promise<any> {
    // Mock implementation - in real implementation, make HTTP request
    return {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'John Doe',
      given_name: 'John',
      family_name: 'Doe',
      picture: 'https://example.com/avatar.jpg',
      verified_email: true
    };
  }

  private async makeRevokeRequest(_url: string, _token: string, _clientId: string): Promise<void> {
    // Mock implementation - in real implementation, make HTTP request
    return;
  }

  /**
   * Get all sessions
   */
  getSessions(): OAuthSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get sessions by provider
   */
  getSessionsByProvider(providerId: string): OAuthSession[] {
    return Array.from(this.sessions.values()).filter(session => session.provider === providerId);
  }

  /**
   * Get sessions by user
   */
  getSessionsByUser(userId: string): OAuthSession[] {
    return Array.from(this.sessions.values()).filter(session => session.userId === userId);
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredSessions = Array.from(this.sessions.entries())
      .filter(([_, session]) => session.expiresAt < now);

    expiredSessions.forEach(([sessionId, session]) => {
      this.sessions.delete(sessionId);
      this.emit('session-expired', session);
    });
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      this.providers.clear();
      this.sessions.clear();
      this.tokens.clear();
      this.removeAllListeners();
    } catch (error) {
      this.emit('error', new Error(`Failed to cleanup: ${error}`));
    }
  }
}
