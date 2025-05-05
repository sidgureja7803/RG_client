import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase/firebaseConfig';

class FirebaseAuthService {
  // Register with email and password
  async registerWithEmailPassword(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with displayName (first name + last name)
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
        photoURL: userData.profilePicture || null
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Sign in with email and password
  async signInWithEmailPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Sign in with GitHub
  async signInWithGithub() {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Handle Firebase auth errors
  _handleError(error) {
    let errorMessage = 'An unexpected error occurred';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'The email address is invalid.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled.';
        break;
      case 'auth/weak-password':
        errorMessage = 'The password is too weak.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This user account has been disabled.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'The password is invalid.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'The credentials are invalid.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'The sign-in popup was closed before completing the sign in.';
        break;
      default:
        errorMessage = error.message || 'An unexpected error occurred';
    }
    
    return new Error(errorMessage);
  }
}

export default new FirebaseAuthService(); 