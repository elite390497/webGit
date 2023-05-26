<template>
    <form @submit.prevent="proceed" @keydown="leaveTypeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('employee.leave_type_name')}}</label>
                    <input class="form-control" type="text" v-model="leaveTypeForm.name" name="name" :placeholder="trans('employee.leave_type_name')">
                    <show-error :form-name="leaveTypeForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('employee.leave_type_alias')}}</label>
                    <input class="form-control" type="text" v-model="leaveTypeForm.alias" name="alias" :placeholder="trans('employee.leave_type_alias')">
                    <show-error :form-name="leaveTypeForm" prop-name="alias"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('employee.leave_type_is_active')}}</label>
                    <br />
                    <switches class="" v-model="leaveTypeForm.is_active" theme="bootstrap" color="success"></switches> 
                </div>
            </div>
            <div class="col-12 col-sm-12">
                <div class="form-group">
                    <label for="">{{trans('employee.leave_type_description')}}</label>
                    <input class="form-control" type="text" v-model="leaveTypeForm.description" name="description" :placeholder="trans('employee.leave_type_description')">
                    <show-error :form-name="leaveTypeForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/employee/leave/type" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                leaveTypeForm: new Form({
                    name : '',
                    alias: '',
                    is_active: 0,
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
                this.leaveTypeForm.post('/api/employee/leave/type')
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
                axios.get('/api/employee/leave/type/'+this.id)
                    .then(response => {
                        this.leaveTypeForm.name = response.name;
                        this.leaveTypeForm.alias = response.alias;
                        this.leaveTypeForm.is_active = response.is_active;
                        this.leaveTypeForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/employee/leave/type');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.leaveTypeForm.patch('/api/employee/leave/type/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/employee/leave/type');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
