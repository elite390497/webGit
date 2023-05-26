<template>
    <form @submit.prevent="storePermission" @keydown="permissionForm.errors.clear($event.target.name)">
        <div class="form-group">
            <label for="">{{trans('configuration.permission_name')}}</label>
            <input class="form-control" type="text" v-model="permissionForm.name" name="name" :placeholder="trans('configuration.permission_name')">
            <show-error :form-name="permissionForm" prop-name="name"></show-error>
        </div>
        <div class="card-footer text-right">
            <button type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        data() {
            return {
                permissionForm: new Form({
                    'name' : ''
                })
            };
        },
        methods: {
            storePermission(){
                let loader = this.$loading.show();
                this.permissionForm.post('/api/permission')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
