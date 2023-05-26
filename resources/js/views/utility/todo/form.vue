<template>
    <form @submit.prevent="proceed" @keydown="todoForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('utility.todo_title')}}</label>
                    <input class="form-control" type="text" v-model="todoForm.title" name="title" :placeholder="trans('utility.todo_title')">
                    <show-error :form-name="todoForm" prop-name="title"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('utility.todo_date')}}</label>
                    <datepicker v-model="todoForm.date" :bootstrapStyling="true" @selected="todoForm.errors.clear('date')" :placeholder="trans('utility.todo_date')"></datepicker>
                    <show-error :form-name="todoForm" prop-name="date"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('utility.todo_description')}}</label>
                    <autosize-textarea v-model="todoForm.description" rows="1" name="description" :placeholder="trans('utility.todo_description')"></autosize-textarea>
                    <show-error :form-name="todoForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/utility/todo" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                todoForm: new Form({
                    title : '',
                    description : '',
                    date: ''
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.getTodo();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateTodo();
                else
                    this.storeTodo();
            },
            storeTodo(){
                let loader = this.$loading.show();
                this.todoForm.post('/api/todo')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getTodo(){
                let loader = this.$loading.show();
                axios.get('/api/todo/'+this.id)
                    .then(response => {
                        this.todoForm.title = response.title;
                        this.todoForm.description = response.description;
                        this.todoForm.date = response.date;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/utility/todo');
                    });
            },
            updateTodo(){
                let loader = this.$loading.show();
                this.todoForm.patch('/api/todo/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/utility/todo');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
