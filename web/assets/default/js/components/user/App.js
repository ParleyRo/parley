export default {
	template: `
		<div>message prop: {{ message }} </div>
		<div>user from prop: {{ userData.user.name }} </div>

		<div>user from created: {{ user.username }} </div>
	`,
	props: {
		message: {
			type: String,
			default: 'AAA'
		},
		userData:{
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			user: { username: 'not set'}
		}
	},
	async created(){
		try {
			
			const dataResponse = await fetch('/users/1');
			const data = await dataResponse.json();

			if(data.exists === true){
				this.user.username = data.username;
			}

		} catch (error) {
			
		}
		
	},
	components: {
	
	}

}