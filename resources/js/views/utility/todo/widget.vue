<template>
	<div class="mr-4">
	    <form @submit.prevent="submit" @keydown="todoForm.errors.clear($event.target.name)">
	    	<div class="px-2">
		        <div class="form-group">
		            <input class="form-control" type="text" v-model="todoForm.title" name="title" :placeholder="trans('utility.todo_title')">
		            <show-error :form-name="todoForm" prop-name="title"></show-error>
		        </div>
		    </div>
	    </form>
	    <div>
	    	<div v-bar>
			  <div style="max-height:200px;" class="m-b-20">
		    	<div v-for="todo in todos" @click="toggleTodo(todo)" :class="['pointer','px-2', todo.status ? 'completed' : '']">
		    		<div class="checkbox checkbox-success">
		                <input type="checkbox" :id="`todo_${todo.id}`" :checked="todo.status ? true : false">
		                <label :for="`todo_${todo.id}`">{{todo.title}}</label>
		            </div>
		    	</div>
			  </div>
			</div>
	    </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				todoForm: new Form({
					title: '',
					date: ''
				}),
				todos: []
			}
		},
		mounted(){
			this.getTodo();
		},
		methods: {
			getTodo(){
				let loader = this.$loading.show();
				axios.get('/api/todo/today')
					.then(response => {
						this.todos = response;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			submit(){
				let loader = this.$loading.show();
				this.todoForm.date = helper.today();
				this.todoForm.post('/api/todo')
					.then(response => {
						toastr.success(response.message);
						this.getTodo();
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			toggleTodo(todo){
				let loader = this.$loading.show();
                axios.post('/api/todo/'+todo.id+'/status')
                    .then(response => {
                        this.getTodo();
						loader.hide();
                    })
                    .catch(error => {
                    	loader.hide();
                    });
			}
		}
	}
</script>

<style>
	.completed{
		text-decoration: line-through;
	}
</style>