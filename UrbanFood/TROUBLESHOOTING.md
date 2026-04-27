# Troubleshooting Login/Signup Issues

## ✅ Fixes Applied

### 1. **Environment Variables**

- Fixed `.env` to use `EXPO_PUBLIC_GITHUB_TOKEN` prefix
- Updated `src/config/env.ts` to properly read environment variables
- Added fallback token in case env var is not loaded

### 2. **API Service with Fallback**

- Added local data fallback in `src/services/apiService.ts`
- If GitHub API fails, it will use `assets/data/dataset.json`
- This allows the app to work even without GitHub API access

### 3. **Better Error Handling**

- Added console logs throughout auth flow
- Added try-catch blocks with detailed error messages
- Signup will continue even if GitHub update fails

## 🧪 Testing Login

### Use Existing Users from Dataset:

**User 1:**

- Email: `aarav.sharma@gmail.com`
- PIN: `9108`

**User 2:**

- Email: `priya.patel@gmail.com`
- PIN: `7514`

**User 3:**

- Email: `rohan.mehta@gmail.com`
- PIN: `9105`

## 🔍 Debugging Steps

### 1. Check Console Logs

Open the browser console or terminal and look for:

- "Attempting login for: [email]"
- "Fetched users: [number]"
- "Login successful for: [name]"
- "Using local users data" (if API fails)

### 2. Verify AsyncStorage

After login, check if data is saved:

```javascript
// In browser console or React Native Debugger
AsyncStorage.getItem('authToken').then(console.log);
AsyncStorage.getItem('user').then(console.log);
```

### 3. Check Network Requests

- Open Network tab in browser DevTools
- Look for requests to GitHub API
- Check if they're returning 200 or errors

## 🐛 Common Issues & Solutions

### Issue: "Invalid credentials"

**Solution:**

- Double-check email and PIN match exactly
- Email is case-sensitive
- PIN must be exactly 4 digits

### Issue: "User already exists" on signup

**Solution:**

- Try a different email address
- Or use login instead

### Issue: API errors

**Solution:**

- App will automatically fallback to local data
- Check console for "Using local users data" message
- Verify `assets/data/dataset.json` exists

### Issue: Splash screen doesn't navigate

**Solution:**

- Check console for auth check logs
- Verify Redux store is properly initialized
- Clear AsyncStorage and restart:

```javascript
AsyncStorage.clear();
```

## 🔄 Reset Everything

If you want to start fresh:

1. **Clear AsyncStorage:**

```javascript
// In browser console
AsyncStorage.clear().then(() => console.log('Cleared'));
```

2. **Restart the app:**

```bash
npm start -- --clear
```

3. **Try login again with test credentials**

## 📱 Platform-Specific Notes

### Web

- AsyncStorage uses localStorage
- Check Application > Local Storage in DevTools

### iOS/Android

- AsyncStorage uses native storage
- Use React Native Debugger to inspect

## ✅ Verification Checklist

- [ ] `.env` file has `EXPO_PUBLIC_GITHUB_TOKEN`
- [ ] `assets/data/dataset.json` exists with users array
- [ ] Redux Provider is in `app/_layout.tsx`
- [ ] Console shows "Fetched users: [number]" on login attempt
- [ ] No TypeScript errors in terminal
- [ ] App restarts after code changes

## 🆘 Still Not Working?

Check these files for errors:

1. `src/features/auth/authThunks.ts` - Login logic
2. `src/services/apiService.ts` - API calls
3. `components/auth/LoginForm.tsx` - Form component
4. `app/_layout.tsx` - Redux Provider setup

Look for console errors and share them for further debugging.
