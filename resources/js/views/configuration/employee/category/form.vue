<template>
    <form @submit.prevent="proceed" @keydown="categoryForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.category_name')}}</label>
                    <input class="form-control" type="text" v-model="categoryForm.name" name="name" :placeholder="trans('employee.category_name')">
                    <show-error :form-name="categoryForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('employee.category_description')}}</label>
                    <input class="form-control" type="text" v-model="categoryForm.description" name="description" :placeholder="trans('employee.category_description')">
                    <show-error :form-name="categoryForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/employee/category" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                categoryForm: new Form({
                    name : '',
                    description : ''
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.categoryForm.post('/api/employee/category')
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
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/category/'+this.id)
                    .then(response => {

                        if (response.name == helper.getConfig('system_admin_employee_category')) {
                            toastr.error(i18n.user.permission_denied);
                            loader.hide();
                            this.$router.push('/configuration/employee/category');
                        }

                        this.categoryForm.name = response.name;
                        this.categoryForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/employee/category');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.categoryForm.patch('/api/employee/category/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/employee/category');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
