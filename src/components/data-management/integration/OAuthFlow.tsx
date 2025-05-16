import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  state?: string;
  pkce?: boolean;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
  scope?: string;
}

interface OAuthFlowProps {
  serviceName: string;
  config: OAuthConfig;
  onSuccess: (tokens: TokenResponse) => void;
  onError: (error: Error) => void;
  onReset: () => void;
  className?: string;
}

/**
 * Component for handling OAuth authentication flows with third-party services
 * Includes PKCE support and token management
 */
const OAuthFlow: React.FC<OAuthFlowProps> = ({
  serviceName,
  config,
  onSuccess,
  onError,
  onReset,
  className = ''
}) => {
  const [status, setStatus] = useState<'idle' | 'authorizing' | 'exchanging' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const [pollInterval, setPollInterval] = useState<number | null>(null);
  
  // Generate a secure random string for state parameter
  const generateRandomString = (length: number): string => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  };
  
  // Generate code verifier and challenge for PKCE
  const generatePKCE = async (): Promise<{codeVerifier: string, codeChallenge: string}> => {
    const verifier = generateRandomString(64);
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    // Base64 URL encode the digest
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    return { codeVerifier: verifier, codeChallenge: base64Digest };
  };
  
  // Initialize OAuth flow
  const initializeOAuth = async () => {
    try {
      setStatus('authorizing');
      setError(null);
      
      // Generate state for security
      const state = generateRandomString(16);
      
      // Generate PKCE code verifier and challenge if required
      let pkceParams = {};
      if (config.pkce) {
        const { codeVerifier, codeChallenge } = await generatePKCE();
        setCodeVerifier(codeVerifier);
        pkceParams = {
          code_challenge: codeChallenge,
          code_challenge_method: 'S256'
        };
      }
      
      // Construct authorization URL
      const authParams = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        state: state,
        scope: config.scopes.join(' '),
        ...pkceParams
      });
      
      const authorizationUrl = `${config.authUrl}?${authParams.toString()}`;
      
      // Open authorization window
      const authWin = window.open(authorizationUrl, `${serviceName} Authorization`, 'width=600,height=700');
      if (!authWin) {
        throw new Error('Could not open authorization window. Please disable popup blocker.');
      }
      
      setAuthWindow(authWin);
      
      // Poll the popup window to check for redirect
      const intervalId = window.setInterval(() => {
        try {
          if (authWin.closed) {
            window.clearInterval(intervalId);
            setStatus('idle');
            setAuthWindow(null);
            setPollInterval(null);
            return;
          }
          
          // Check if we've been redirected to our redirect URI
          const redirectUri = new URL(config.redirectUri);
          if (authWin.location.href.startsWith(redirectUri.origin + redirectUri.pathname)) {
            const params = new URLSearchParams(authWin.location.search);
            const code = params.get('code');
            const returnedState = params.get('state');
            const error = params.get('error');
            
            window.clearInterval(intervalId);
            authWin.close();
            setAuthWindow(null);
            setPollInterval(null);
            
            if (error) {
              throw new Error(`Authorization error: ${error}`);
            }
            
            if (!code) {
              throw new Error('No authorization code received');
            }
            
            if (returnedState !== state) {
              throw new Error('State parameter mismatch. Possible CSRF attack.');
            }
            
            // Exchange code for token
            exchangeCodeForToken(code);
          }
        } catch (e) {
          // Ignore errors caused by cross-origin restrictions while polling
          // Only throw if the window is on our domain and we still get an error
          if (e instanceof Error && e.message.includes('cross-origin')) {
            // This is expected when checking a window on another domain
            return;
          }
        }
      }, 500);
      
      setPollInterval(intervalId);
      
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Unknown error');
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };
  
  // Exchange authorization code for access token
  const exchangeCodeForToken = async (code: string) => {
    try {
      setStatus('exchanging');
      
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId
      });
      
      // Add code verifier for PKCE if available
      if (config.pkce && codeVerifier) {
        tokenParams.append('code_verifier', codeVerifier);
      }
      
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: tokenParams.toString()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error_description || 
          errorData?.error || 
          `Token request failed with status ${response.status}`
        );
      }
      
      const tokens: TokenResponse = await response.json();
      setStatus('success');
      onSuccess(tokens);
      
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Unknown error');
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        window.clearInterval(pollInterval);
      }
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }
    };
  }, [authWindow, pollInterval]);
  
  const handleReset = () => {
    setStatus('idle');
    setError(null);
    setCodeVerifier(null);
    onReset();
  };
  
  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          Connect with {serviceName}
        </h3>
        
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>
            {status === 'idle' && 
              `Authorize ${serviceName} to access your account and integrate with our service.`}
            {status === 'authorizing' && 
              `Please complete the authorization in the popup window.`}
            {status === 'exchanging' && 
              `Finalizing authorization with ${serviceName}...`}
            {status === 'success' && 
              `Successfully connected to ${serviceName}!`}
            {status === 'error' && 
              `Failed to connect to ${serviceName}.`}
          </p>
          
          {error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              <p>{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-5">
          {status === 'idle' && (
            <button
              type="button"
              onClick={initializeOAuth}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              Authorize {serviceName}
            </button>
          )}
          
          {(status === 'authorizing' || status === 'exchanging') && (
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2 text-primary-500" />
              {status === 'authorizing' ? 'Waiting for authorization...' : 'Processing...'}
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex items-center text-sm text-green-700 dark:text-green-400">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Connection established successfully
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                Try Again
              </button>
              
              <button
                type="button"
                onClick={() => window.open('https://support.example.com/oauth-help', '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Get Help
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthFlow;
