export default {
	template: `
		<div class="container mt-6">
			<form 
				method="post"
				action="/oauth/connect/"
				@submit="checkForm"
			
			>
			<div class="columns is-centered is-vcentered is-centered">
				<div class="column is-one-third">
				
					<div class="field">
						<p class="control has-icons-left has-icons-right">
							<input v-model="username" name="username" class="input" type="text" placeholder="Username/Email">
							<span class="icon is-small is-left">
								<i class="fas fa-user"></i>
							</span>
							<span class="icon is-small is-right">
								<i class="fas fa-check"></i>
							</span>
						</p>
					</div>
					
					<div class="field">
						<p class="control has-icons-left">
							<input v-model="password" name="password" class="input" type="password" placeholder="Password" autocomplete="on">
							<span class="icon is-small is-left">
								<i class="fas fa-lock"></i>
							</span>
						</p>
					</div>
					
					<div class="field">
						<p class="control">
							<button class="button is-success">
								Login
							</button>
						</p>
					</div>

				</div>
			</div>
			</form>
		</div>
	`,
	props: {
		
	},
	data() {
		return {
			errors: [],
			username: '',
			password: ''
		}
	},
	async created(){
		
	},
	components: {
	
	},
	methods: {
		checkForm: async function (e) {

			this.errors = [];

			if (!this.name) {
				this.errors.push("Name required.");
			}

			if (!this.password) {
				this.errors.push("Password required.");
			}

			if (!this.errors.length) {
				return true;
			}

			e.preventDefault();

			const response = await fetch(e.target.action,{
				method: 'post',
				body: JSON.stringify({
					username: this.username,
					password: this.password
				}),
				headers: {'Content-Type': 'application/json'}
			});
			
		}
	}

}