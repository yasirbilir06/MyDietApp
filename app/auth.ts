// app/auth.ts
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';

// Expo, oturum tamamlanma sorunlarını çözmek için:
WebBrowser.maybeCompleteAuthSession();

// Redirect URI'yi oluşturuyoruz. 
// useProxy: true sayesinde Expo, auth.expo.io tabanlı URI üretecektir.
// app.json'daki scheme 'myapp' ile uyumlu olmalı.
// TypeScript hatasını aşmak için "as any" ile cast ediyoruz.
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'myapp',
  useProxy: true,
} as any);

export async function signInWithGoogle(): Promise<User | null> {
  // Google OAuth URL'sini oluşturuyoruz:
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=785721866692-70basij134sm96sefuka34itfqd3v1nr.apps.googleusercontent.com` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=profile%20email`;

  try {
    // OAuth akışını başlatıyoruz. startAsync metodunu "as any" ile çağırarak type hatalarını geçiyoruz.
    const result = await (AuthSession as any).startAsync({
      authUrl,
      returnUrl: REDIRECT_URI,
    });
    
    if (result.type === 'success' && result.url) {
      // URL, access token bilgisini fragment (#access_token=xxx&...) olarak içerir.
      const fragment = result.url.split('#')[1];
      if (!fragment) {
        console.log('Access token bulunamadı');
        return null;
      }
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      if (!accessToken) {
        console.log('access_token parametresi yok');
        return null;
      }
      // Firebase için Google kimlik bilgisi oluşturuyoruz:
      const credential = GoogleAuthProvider.credential(null, accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      console.log('Google ile giriş başarılı:', userCredential.user);
      return userCredential.user;
    } else {
      console.log('Kullanıcı iptal etti veya hata oluştu:', result.type);
      return null;
    }
  } catch (error) {
    console.error('Google OAuth akışında hata:', error);
    return null;
  }
}
