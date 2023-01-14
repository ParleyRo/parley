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
						<div class="box">
						
							<div class="field">
								<div class="control has-icons-left has-icons-right">
									<input v-on:keyup="fieldChanged('username')" v-model="username.value" name="username" class="input" type="text" placeholder="Username/Email">
									<span class="icon is-small is-left">
										<i class="fas fa-user"></i>
									</span>
									<span 
										class="icon is-small is-right"
										:class=[username.classes]
									>
										<i class="fas fa-check"></i>
									</span>
								</div>
								<p v-if="errors.username" class="help is-danger">{{errors.username}}</p>
							</div>
							
							<div class="field">
								<div class="control has-icons-left has-icons-right">
									<input v-on:keyup="fieldChanged('password')" v-model="password.value" name="password" class="input" type="password" placeholder="Password" autocomplete="on">
									<span class="icon is-small is-left">
										<i class="fas fa-lock"></i>
									</span>
									<span 
										class="icon is-small is-right"
										:class=[password.classes]
									>
										<i class="fas fa-check"></i>
									</span>
								</div>
								<p v-if="errors.password" class="help is-danger">{{errors.password}}</p>
							</div>
							
							<div class="field">
								<p class="control">
									<button class="button is-success">
										Login
									</button>
								</p>
							</div>

							<div v-if="errors.default" class="field has-text-centered">
								<span class="tag is-danger is-light">{{errors.default}}</span>
							</div>
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
			errors: {},
			username: {
				value: '',
				classes: []
			},
			password: {
				value: '',
				classes: []
			},
		}
	},
	async created(){
		
	},
	components: {
	
	},
	methods: {
		fieldChanged: function(fieldName){

			const index = this[fieldName]?.classes.indexOf('has-text-info');

			if((this[fieldName]?.value != '')){

				if(index === -1){
					this[fieldName].classes.push('has-text-info');
				}
				
				return;
			}
			
			this[fieldName].classes.splice(index, 1);

		},
		checkForm: async function (e) {

			e.preventDefault();
		
			this.errors = {};

			if (!this.username.value) {
				this.errors['username'] = "Username required.";
			}

			if (!this.password.value) {
				this.errors['password'] = "Password required.";
			}

			if (Object.keys(this.errors).length) {
				return false;
			}

			const response = await fetch(e.target.action,{
				method: 'post',
				body: JSON.stringify({
					username: this.username.value,
					password: this.password.value
				}),
				headers: {'Content-Type': 'application/json'}
			});

			if(response.redirected && response.url){
				window.location.href = response.url;
			}
			
			const data = await response.json();

			if(data.error){
				this.errors['default'] = data.message;
			}
			
			
		}
	}

}