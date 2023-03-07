import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, writeBatch } from "firebase/firestore";

const isUserSignedIn = () => !!getAuth().currentUser;
const getUserId = () => getAuth().currentUser.uid;

const signInUser = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

const signOutUser = () => {
  signOut(getAuth());
}

const performBatch = (callback) => {
  if (typeof callback !== 'function') return;

  const batch = writeBatch(getFirestore());
  callback(batch);
  batch.commit();
};

export { signInUser, signOutUser, getUserId, isUserSignedIn, performBatch }
