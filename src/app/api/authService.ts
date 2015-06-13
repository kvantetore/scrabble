import {FirebaseService} from './firebaseService';
import {Injectable} from 'angular2/di';

import {User} from 'app/models/user';

@Injectable()
export class AuthService {
	constructor(private firebase: FirebaseService) {
	}

	get hasAuth() {
		return this.firebase.ref.getAuth() != null;
	}

	ensureAuth(provider: string): Promise<FirebaseAuthData> {
		var auth = this.firebase.ref.getAuth();
		if (auth != null) {
			return new Promise(resolve => resolve(auth));
		}

		return new Promise<FirebaseAuthData>((resolve, reject) => {
			this.firebase.ref.authWithOAuthPopup(provider, function(error, authData) {
				if (error) {
					console.warn("Login Failed!", error);
					reject(error);
				} else {
					//console.log("Authenticated successfully with payload:", authData);
					resolve(authData);
				}
			}, {
				scope: "email"
			});
		})
		.then(auth => this.saveUser(auth))
		.then(() => this.firebase.ref.getAuth());
	}

	logOut() {
		this.firebase.ref.unauth();
	}
	
	private saveUser(auth: FirebaseAuthData): Promise<void> {
		var user = new User
		user.id = auth.uid;
		if (auth.provider === "facebook") {
			let userData = (<any>auth).facebook;
			user.name = userData.displayName;
			user.email = userData.email;
			user.firstName = userData.cachedUserProfile.first_name;
			user.pictureUrl = userData.cachedUserProfile.picture.data.url;
		}
		else if (auth.provider == "google") {
			let userData = (<any>auth).google;
			user.name = userData.displayName;
			user.email = userData.email;
			user.firstName = userData.cachedUserProfile.given_name;
			user.pictureUrl = userData.cachedUserProfile.picture
		} else {
			return new Promise<void>((callback, reject) => reject(new Error("Unknown provider " + auth.provider)));
		}
		
		return new Promise<void>((resolve, reject) => {
			this.firebase.ref.root().child("users/" + auth.uid).set(user.serialize(), (error) => {
				if (error) {
					reject(error)
				}
				else {
					resolve();
				}
			}) 
		});
	}
}