import {Injectable} from 'angular2/di';
import * as Firebase from 'firebase';

@Injectable()
export class FirebaseService {
	ref: Firebase;
	
	constructor() {
		this.ref = new Firebase("https://sizzling-torch-3178.firebaseio.com");
	}
}

