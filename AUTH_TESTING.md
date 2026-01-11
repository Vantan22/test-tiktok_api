# TikTok Manager - Authentication Testing Guide

## Authentication Flow Overview

### 1. Credentials Login (Email/Password)
- Navigate to `/login`
- Enter email and password
- On success: Redirected to `/` (dashboard)
- On failure: Error message displayed

### 2. TikTok OAuth Login
- Navigate to `/login`
- Click "Sign in with TikTok" button
- Redirected to TikTok authorization page
- After authorization: Redirected back to `/` (dashboard)
- User automatically created in database if first login

### 3. Registration
- Navigate to `/register`
- Enter name, email, and password (min 6 characters)
- On success: Redirected to `/login`
- On failure: Error message displayed

## Environment Variables Required

```bash
# NextAuth
AUTH_SECRET=your_generated_secret  # Generate with: openssl rand -base64 32

# TikTok OAuth (Required for TikTok login)
TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## TikTok Developer Portal Setup

### 1. Create TikTok App
- Go to https://developers.tiktok.com/
- Create a new app
- Enable "Login Kit"

### 2. Configure Redirect URIs
Add these URLs to your TikTok app:

**For Local Development:**
```
http://localhost:3000/api/auth/callback/tiktok
```

**For Production:**
```
https://yourdomain.com/api/auth/callback/tiktok
```

### 3. Get Credentials
- Copy Client Key → `TIKTOK_CLIENT_ID`
- Copy Client Secret → `TIKTOK_CLIENT_SECRET`

## Testing Checklist

### Manual Testing
- [ ] Register new user with email/password
- [ ] Login with credentials
- [ ] Logout from user dropdown
- [ ] Login with TikTok (requires valid OAuth credentials)
- [ ] Access protected routes (should redirect to login if not authenticated)
- [ ] Access login page when already logged in (should redirect to dashboard)

### Automated Testing Steps
1. **Start dev server**: `npm run dev`
2. **Navigate to**: http://localhost:3000
3. **Expected**: Redirect to `/login`
4. **Test Registration**: Click "Sign up" → Fill form → Submit
5. **Test Login**: Enter credentials → Submit
6. **Expected**: Redirect to dashboard with user avatar in header
7. **Test Logout**: Click avatar → "Log out"
8. **Expected**: Redirect to `/login`

## Common Issues & Solutions

### Issue: "TikTok login doesn't redirect back"
**Solution**: 
- Verify `TIKTOK_CLIENT_ID` and `TIKTOK_CLIENT_SECRET` are set
- Ensure callback URL matches TikTok app settings exactly
- Check that app has "Login Kit" enabled

### Issue: "Session not persisting"
**Solution**: 
- Verify `AUTH_SECRET` is set in `.env.local`
- Clear browser cookies and try again

### Issue: "Cannot create user"
**Solution**: 
- Verify MongoDB connection string is correct
- Check database is accessible
- Ensure User model is properly imported

## Security Notes

1. **Never commit** `.env.local` to version control
2. **AUTH_SECRET** should be unique and secure
3. **TikTok credentials** should be kept confidential
4. **Password hashing** is handled automatically with bcrypt
5. **Session tokens** are JWT-based and signed

## Next Steps for Production

1. Set up production environment variables
2. Update TikTok redirect URI to production domain
3. Enable HTTPS (required for OAuth)
4. Set up error monitoring (e.g., Sentry)
5. Implement rate limiting for auth endpoints
