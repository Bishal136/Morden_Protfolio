const { OAuth2Client } = require('google-auth-library');

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return new OAuth2Client(clientId, clientSecret);
};

/**
 * Verify Google ID Token (Credential) received from Google Identity Services (GIS)
 * @param {string} idToken - The Google JWT credential
 * @returns {Promise<object>} Verified user payload
 */
const verifyGoogleIdToken = async (idToken) => {
  if (!idToken) {
    throw new Error('Google ID token is required.');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const client = getGoogleClient();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: clientId ? [clientId] : undefined,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Invalid Google token payload.');
  }

  if (!payload.email_verified) {
    throw new Error('Google account email is not verified.');
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || '',
    avatarUrl: payload.picture || '',
    emailVerified: payload.email_verified,
  };
};

/**
 * Exchange Authorization Code for Tokens and verify user (for OAuth Code Flow)
 * @param {string} code - Authorization code
 * @param {string} redirectUri - Redirect URI configured in Google Console
 * @returns {Promise<object>} Verified user payload
 */
const getGoogleUserFromCode = async (code, redirectUri) => {
  if (!code) {
    throw new Error('Authorization code is required.');
  }

  const client = getGoogleClient();
  const { tokens } = await client.getToken({
    code,
    redirect_uri: redirectUri || 'postmessage',
  });

  if (!tokens.id_token) {
    throw new Error('No ID token returned from Google code exchange.');
  }

  return verifyGoogleIdToken(tokens.id_token);
};

module.exports = {
  verifyGoogleIdToken,
  getGoogleUserFromCode,
};
