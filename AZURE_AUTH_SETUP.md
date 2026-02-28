# Azure AD Authentication Setup Guide

## Overview
This project has been migrated from Supabase authentication to Microsoft Entra ID (formerly Azure AD) authentication.

## Configuration

### Environment Variables
Your `.env.local` file should contain the following variables:

```
VITE_AZURE_CLIENT_ID=9b33e405-cdcb-4504-9e07-cf0e963a57e8
VITE_AZURE_TENANT_ID=cc206f74-8c1b-400d-9dcf-5627a5c789e2
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/cc206f74-8c1b-400d-9dcf-5627a5c789e2/v2.0
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_AZURE_POST_LOGOUT_REDIRECT_URI=/
```

**For Production**, update:
- `VITE_AZURE_REDIRECT_URI` to your production domain (e.g., `https://yourdomain.com`)
- `VITE_AZURE_POST_LOGOUT_REDIRECT_URI` to your production domain

### Redirect URIs in Azure Portal
Make sure your Entra ID app registration has these redirect URIs configured:
- **Development**: `http://localhost:5173`
- **Production**: `https://yourdomain.com` (or your actual domain)

## Authentication Flow

### Login
1. User clicks "Sign in with Microsoft"
2. MSAL redirects to Microsoft login
3. User authenticates with their Microsoft account
4. User is redirected back to dashboard

### Logout
1. User clicks "Logout" in the sidebar
2. MSAL logs out the user
3. User is redirected to home page

## File Structure

### New Azure-related files:
- `src/integrations/azure/msalConfig.ts` - MSAL configuration
- `src/context/AuthContext.tsx` - Authentication context provider
- `src/components/ProtectedRoute.tsx` - Protected route wrapper for authenticated pages

### Updated files:
- `src/App.tsx` - Wrapped with MsalProvider and AuthProvider
- `src/pages/Auth.tsx` - Replaced with Azure AD login page
- `src/components/AppSidebar.tsx` - Updated logout to use MSAL
- `src/pages/Dashboard.tsx` - Removed Supabase auth check (TODO: Connect to backend API)

### Deleted files:
- `src/integrations/supabase/` - Entire folder removed
- `.env` (old Supabase environment file)

## Next Steps

### 1. Backend API Integration
The dashboard currently has TODO comments for API integration. You need to:
- Create a backend API that handles the business logic
- The backend should validate Azure AD tokens
- Replace Supabase database calls with your backend API calls

**Example API call with Azure AD token:**
```typescript
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/integrations/azure/msalConfig";

const { instance, accounts } = useMsal();

const getToken = async () => {
  const response = await instance.acquireTokenSilent({
    scopes: loginRequest.scopes,
    account: accounts[0],
  });
  return response.accessToken;
};

const fetchInventory = async () => {
  const token = await getToken();
  const response = await fetch("/api/inventory", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
```

### 2. User Profile Storage
Currently, user info comes from Azure AD. If you need to store additional hospital information:
- Create a database table linked by Azure AD user ID (ObjectId)
- Sync hospital details on first login
- Update profile editing page accordingly

### 3. API Scopes (Optional)
If you have a custom API registered in Entra ID:
```typescript
// Update in msalConfig.ts
export const loginRequest = {
  scopes: [
    "https://yourtenant.onmicrosoft.com/api/access_as_user",
    "openid",
    "profile",
    "email"
  ],
};
```

## Packages Installed
- `@azure/msal-browser` - MSAL Browser SDK
- `@azure/msal-react` - MSAL React SDK

## Testing

Run the development server:
```bash
npm run dev
```

The app will:
1. Show login page on `/auth`
2. Redirect authenticated users to `/dashboard`
3. Protect all dashboard routes with `ProtectedRoute`

## Troubleshooting

### Issue: "Token is not valid"
- Check redirect URIs match exactly in Azure Portal
- Verify Client ID and Tenant ID are correct
- Clear browser cache/localStorage

### Issue: Popup blocked
- MSAL uses popup by default. Ensure popups are allowed
- Alternative: Use `loginRedirect()` instead of `loginPopup()` in Auth.tsx

### Issue: "Redirect URI not registered"
- Go to Azure Portal → App registrations → Your app → Authentication
- Add the exact URI to "Redirect URIs" section

## Support
For more info on MSAL React: https://github.com/AzureAD/microsoft-authentication-library-for-js
