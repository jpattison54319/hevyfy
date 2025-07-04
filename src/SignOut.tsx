import { auth, provider } from './firebase';
import { signOut } from 'firebase/auth';

export function handleSignOut() {
  signOut(auth).then(() => {
    console.log('Signed out!');
  }).catch((error) => {
    console.error('Sign out error:', error) ;
  });
}
