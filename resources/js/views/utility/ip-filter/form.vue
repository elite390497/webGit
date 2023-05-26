<template>
    <form @submit.prevent="proceed" @keydown="ipFilterForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('utility.start_ip')}}</label>
                    <input class="form-control" type="text" v-model="ipFilterForm.start_ip" name="start_ip" :placeholder="trans('utility.start_ip')">
                    <show-error :form-name="ipFilterForm" prop-name="start_ip"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('utility.end_ip')}}</label>
                    <input class="form-control" type="text" v-model="ipFilterForm.end_ip" name="end_ip" :placeholder="trans('utility.end_ip')">
                    <show-error :form-name="ipFilterForm" prop-name="end_ip"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('utility.ip_filter_description')}}</label>
                    <textarea class="form-control" type="text" v-model="ipFilterForm.description" rows="1" name="description" :placeholder="trans('utility.ip_filter_description')"></textarea>
                    <show-error :form-name="ipFilterForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/utility/ip-filter" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                ipFilterForm: new Form({
                    start_ip: '',
                    end_ip: '',
                    description: ''
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.getIpFilter();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.updateIpFilter();
                else
                    this.storeIpFilter();
            },
            storeIpFilter(){
                let loader = this.$loading.show();
                this.ipFilterForm.post('/api/ip-filter')
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
            getIpFilter(){
                let loader = this.$loading.show();
                axios.get('/api/ip-filter/'+this.id)
                    .then(response => {
                        this.ipFilterForm.start_ip = response.start_ip;
                        this.ipFilterForm.end_ip = response.end_ip;
                        this.ipFilterForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/utility/ip-filter');
                    });
            },
            updateIpFilter(){
                let loader = this.$loading.show();
                this.ipFilterForm.patch('/api/ip-filter/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/utility/ip-filter');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
