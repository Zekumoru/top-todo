import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const isUserSignedIn = () => !!getAuth().currentUser;
const getUserId = () => getAuth().currentUser.uid;

const signInUser = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

const signOutUser = () => {
  signOut(getAuth());
}

export { signInUser, signOutUser, getUserId, isUserSignedIn }
