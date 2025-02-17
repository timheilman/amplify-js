// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
	AuthConfig,
	AuthTokens,
	AuthUserPoolConfig,
	CognitoUserPoolConfig,
} from '@aws-amplify/core';

import { AuthError } from '../../../errors/AuthError';
import { CognitoAuthTokens, DeviceMetadata } from '../tokenProvider/types';
import {
	DEVICE_METADATA_NOT_FOUND_EXCEPTION,
	USER_UNAUTHENTICATED_EXCEPTION,
} from '../../../errors/constants';

export function isTypeUserPoolConfig(
	authConfig?: AuthConfig
): authConfig is AuthUserPoolConfig {
	if (
		authConfig &&
		authConfig.Cognito.userPoolId &&
		authConfig.Cognito.userPoolClientId
	) {
		return true;
	}

	return false;
}

export function assertAuthTokens(
	tokens?: AuthTokens | null
): asserts tokens is AuthTokens {
	if (!tokens || !tokens.accessToken) {
		throw new AuthError({
			name: USER_UNAUTHENTICATED_EXCEPTION,
			message: 'User needs to be authenticated to call this API.',
			recoverySuggestion: 'Sign in before calling this API again.',
		});
	}
}

export function assertIdTokenInAuthTokens(
	tokens?: AuthTokens
): asserts tokens is AuthTokens {
	if (!tokens || !tokens.idToken) {
		throw new AuthError({
			name: USER_UNAUTHENTICATED_EXCEPTION,
			message: 'User needs to be authenticated to call this API.',
			recoverySuggestion: 'Sign in before calling this API again.',
		});
	}
}

export function assertAuthTokensWithRefreshToken(
	tokens?: CognitoAuthTokens | null
): asserts tokens is CognitoAuthTokens & { refreshToken: string } {
	if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
		throw new AuthError({
			name: USER_UNAUTHENTICATED_EXCEPTION,
			message: 'User needs to be authenticated to call this API.',
			recoverySuggestion: 'Sign in before calling this API again.',
		});
	}
}
type NonNullableDeviceMetadata = DeviceMetadata & {
	deviceKey: string;
	deviceGroupKey: string;
};
export function assertDeviceMetadata(
	deviceMetadata?: DeviceMetadata | null
): asserts deviceMetadata is NonNullableDeviceMetadata {
	if (
		!deviceMetadata ||
		!deviceMetadata.deviceKey ||
		!deviceMetadata.deviceGroupKey ||
		!deviceMetadata.randomPassword
	) {
		throw new AuthError({
			name: DEVICE_METADATA_NOT_FOUND_EXCEPTION,
			message:
				'Either deviceKey, deviceGroupKey or secretPassword were not found during the sign-in process.',
			recoverySuggestion:
				'Make sure to not clear storage after calling the signIn API.',
		});
	}
}

export const OAuthStorageKeys = {
	inflightOAuth: 'inflightOAuth',
	oauthSignIn: 'oauthSignIn',
	oauthPKCE: 'oauthPKCE',
	oauthState: 'oauthState',
};

export interface OAuthStore {
	setAuthConfig(authConfigParam: CognitoUserPoolConfig): void;
	loadOAuthInFlight(): Promise<boolean>;
	storeOAuthInFlight(inflight: boolean): Promise<void>;
	loadOAuthSignIn(): Promise<{
		isOAuthSignIn: boolean;
		preferPrivateSession: boolean;
	}>;
	storeOAuthSignIn(
		oauthSignIn: boolean,
		preferPrivateSession: boolean
	): Promise<void>;
	loadOAuthState(): Promise<string | null>;
	storeOAuthState(state: string): Promise<void>;
	loadPKCE(): Promise<string | null>;
	storePKCE(pkce: string): Promise<void>;
	clearOAuthInflightData(): Promise<void>;
	clearOAuthData(): Promise<void>;
}
