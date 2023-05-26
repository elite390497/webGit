<template>
    <form @submit.prevent="proceed" @keydown="localeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('configuration.locale_name')}}</label>
                    <input class="form-control" type="text" v-model="localeForm.name" name="name" :placeholder="trans('configuration.locale_name')">
                    <show-error :form-name="localeForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('configuration.locale')}}</label>
                    <input class="form-control" type="text" v-model="localeForm.locale" name="locale" :placeholder="trans('configuration.locale')">
                    <show-error :form-name="localeForm" prop-name="locale"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/locale" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                localeForm: new Form({
                    name : '',
                    locale : ''
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.getLocale();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateLocale();
                else
                    this.storeLocale();
            },
            storeLocale(){
                let loader = this.$loading.show();
                this.localeForm.post('/api/locale')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed')
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getLocale(){
                let loader = this.$loading.show();
                axios.get('/api/locale/'+this.id)
                    .then(response => {
                        this.localeForm.name = response.name;
                        this.localeForm.locale = response.locale;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/locale');
                    });
            },
            updateLocale(){
                let loader = this.$loading.show();
                this.localeForm.patch('/api/locale/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$router.push('/configuration/locale');
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
