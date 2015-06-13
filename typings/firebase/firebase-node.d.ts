/// <reference path="firebase.d.ts" />

declare module 'firebase' {
	var firebase: FirebaseStatic;
	export = firebase;
}