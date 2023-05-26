<template>
    <form @submit.prevent="proceed" @keydown="callingPurposeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.calling_purpose_name')}}</label>
                    <input class="form-control" type="text" v-model="callingPurposeForm.name" name="name" :placeholder="trans('reception.calling_purpose_name')">
                    <show-error :form-name="callingPurposeForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.calling_purpose_description')}}</label>
                    <input class="form-control" type="text" v-model="callingPurposeForm.description" name="description" :placeholder="trans('reception.calling_purpose_description')">
                    <show-error :form-name="callingPurposeForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/reception/calling/purpose" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                callingPurposeForm: new Form({
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
                this.callingPurposeForm.post('/api/reception/calling/purpose')
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
                axios.get('/api/reception/calling/purpose/'+this.id)
                    .then(response => {
                        this.callingPurposeForm.name = response.name;
                        this.callingPurposeForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/reception/calling/purpose');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.callingPurposeForm.patch('/api/reception/calling/purpose/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/reception/calling/purpose');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
