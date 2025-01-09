// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBYXb0s_SKUAnT6W90YIwSQGC8mZIvomeo',
	authDomain: 'expenses-tracker-50c23.firebaseapp.com',
	projectId: 'expenses-tracker-50c23',
	storageBucket: 'expenses-tracker-50c23.firebasestorage.app',
	messagingSenderId: '90747227469',
	appId: '1:90747227469:web:b01e2a95f49fec2f8e3b04',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
