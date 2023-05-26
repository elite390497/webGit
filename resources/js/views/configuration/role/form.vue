<template>
    <form @submit.prevent="storeRole" @keydown="roleForm.errors.clear($event.target.name)">
        <div class="form-group">
            <label for="">{{trans('configuration.role_name')}}</label>
            <input class="form-control" type="text" v-model="roleForm.name" name="name" :placeholder="trans('configuration.role_name')">
            <show-error :form-name="roleForm" prop-name="name"></show-error>
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
                roleForm: new Form({
                    'name' : ''
                })
            };
        },
        methods: {
            storeRole(){
                let loader = this.$loading.show();
                this.roleForm.post('/api/role')
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
