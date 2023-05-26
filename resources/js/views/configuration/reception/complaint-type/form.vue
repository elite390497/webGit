<template>
    <form @submit.prevent="proceed" @keydown="complaintTypeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.complaint_type_name')}}</label>
                    <input class="form-control" type="text" v-model="complaintTypeForm.name" name="name" :placeholder="trans('reception.complaint_type_name')">
                    <show-error :form-name="complaintTypeForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.complaint_type_description')}}</label>
                    <input class="form-control" type="text" v-model="complaintTypeForm.description" name="description" :placeholder="trans('reception.complaint_type_description')">
                    <show-error :form-name="complaintTypeForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/reception/complaint/type" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
        data() {
            return {
                complaintTypeForm: new Form({
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
                this.complaintTypeForm.post('/api/reception/complaint/type')
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
                axios.get('/api/reception/complaint/type/'+this.id)
                    .then(response => {
                        this.complaintTypeForm.name = response.name;
                        this.complaintTypeForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/reception/complaint/type');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.complaintTypeForm.patch('/api/reception/complaint/type/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/reception/complaint/type');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
