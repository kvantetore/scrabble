

export class User {
	id: string;
	email: string;
	name: string;
	firstName: string;
	pictureUrl: string;
	
	serialize() {
		return {
			id: this.id,
			email: this.email,
			name: this.name,
			firstName: this.firstName,
			pictureUrl: this.pictureUrl,
		};
	}
	
	static load(data: any) {
		var user = new User();
		user.id = data.id;
		user.email = data.email;
		user.name = data.name;
		user.firstName = data.firstName;
		user.pictureUrl = data.pictureUrl;
	}
	
}