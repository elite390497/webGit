<template>
    <form @submit.prevent="proceed" @keydown="visitingPurposeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.visiting_purpose_name')}}</label>
                    <input class="form-control" type="text" v-model="visitingPurposeForm.name" name="name" :placeholder="trans('reception.visiting_purpose_name')">
                    <show-error :form-name="visitingPurposeForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('reception.visiting_purpose_description')}}</label>
                    <input class="form-control" type="text" v-model="visitingPurposeForm.description" name="description" :placeholder="trans('reception.visiting_purpose_description')">
                    <show-error :form-name="visitingPurposeForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/reception/visiting/purpose" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                visitingPurposeForm: new Form({
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
                this.visitingPurposeForm.post('/api/reception/visiting/purpose')
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
                axios.get('/api/reception/visiting/purpose/'+this.id)
                    .then(response => {
                        this.visitingPurposeForm.name = response.name;
                        this.visitingPurposeForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/reception/visiting/purpose');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.visitingPurposeForm.patch('/api/reception/visiting/purpose/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/reception/visiting/purpose');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
