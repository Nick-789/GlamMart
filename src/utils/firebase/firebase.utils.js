import {initializeApp} from 'firebase/app'
import { getStorage } from "firebase/storage"
import {getFirestore,getDoc,setDoc,doc,collection,writeBatch,query, getDocs} from 'firebase/firestore'
import {getAuth,signInWithPopup,signInWithRedirect,GoogleAuthProvider,
    createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut
} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyDQmW3tR-nLk4dGVQawMlB8648qJmJTDnM",
    authDomain: "clothing-marke.firebaseapp.com",
    projectId: "clothing-marke",
    storageBucket: "clothing-marke.appspot.com",
    messagingSenderId: "1073859931226",
    appId: "1:1073859931226:web:6a8eb7247fcaf369fcbc63",
    measurementId: "G-NWNHLSH0TB"
  };
  
  const app=initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
      prompt: "select_account"
  })

  export const auth = getAuth();
  export const signInWithGooglePopup =async()=>{return await signInWithPopup(auth,provider)}

  export const signInWithGoogleRedirect = ()=>{try{signInWithRedirect(auth,provider)}catch(error){console.log(error)}}

  export const db = getFirestore();

  export const AddCollectionAndDocument=async(collectionKey,objectsToAdd)=>
  {
     const collectionRef = collection(db,collectionKey)
     const batch = writeBatch(db)

     objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef,object.title.toLowerCase())
        batch.set(docRef,object)
     });
     await batch.commit();
     console.log("done");
  } 
  export const getCollectionAndDocument=async()=>
  {
    const collectionRef = collection(db,'categories')
    const q = query(collectionRef)
    const querySnapShot = await getDocs(q);
    return querySnapShot.docs.reduce((acc,docSnapShot)=>
    {
      const {title,items} = docSnapShot.data();
      acc[title.toLowerCase()]=items; 
      return acc;


    },{})

   }
  export const CreateUserFromAuth=async(userinfo,additionalinfo={})=>
  {
      const database = doc(db,'users',userinfo.uid);
      const usersnap = await getDoc(database);
     
      
      if(!usersnap.exists())
      {
         const {displayName,email} = userinfo;
         const CreatedAt = new Date();
         try{

            await setDoc(database,
                {
                    displayName,email,CreatedAt,...additionalinfo
                });

         }catch(error)
         {
            console.log("createing document error"+error)
         }

      }
      
        return database;
      
  };

export const CreateAuthUserWithEmailAndPassword=async(email,password)=>
{
    if(!email || !password)
    {
        return;
    }
    return await createUserWithEmailAndPassword(auth,email,password);
}
export const SignInWithUserEmailAndPassword=async(email,password)=>
{
    if(!email || !password)
    {
        return;
    }
    return await signInWithEmailAndPassword(auth,email,password);
}
export const SignOutUser =async()=>
{
    return await signOut(auth); 
}

const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {imgDB,txtDB};