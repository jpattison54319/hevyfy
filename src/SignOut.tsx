import { auth, provider } from './firebase';
import { signOut } from 'firebase/auth';

export function handleSignOut() {
  signOut(auth).then(() => {
    console.log('Signed out!');
  });
}
