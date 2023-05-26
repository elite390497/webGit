<template>
    <div>
        <form @submit.prevent="proceed" @keydown="transportRouteForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('transport.route_name')}}</label>
                        <input class="form-control" type="text" v-model="transportRouteForm.name" name="name" :placeholder="trans('transport.route_name')">
                        <show-error :form-name="transportRouteForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('transport.route_description')}}</label>
                        <input class="form-control" type="text" v-model="transportRouteForm.description" name="description" :placeholder="trans('transport.route_description')">
                        <show-error :form-name="transportRouteForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('transport.stoppage')}} </label> 
                        <v-select label="name" track-by="id" v-model="selected_transport_stoppages" name="transport_stoppages" id="transport_stoppages" :options="transport_stoppages" :placeholder="trans('transport.select_stoppage')" @select="onTransportStoppageSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onTransportStoppageRemove" :selected="selected_transport_stoppages">
                            <div class="multiselect__option" slot="afterList" v-if="!transport_stoppages.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="transportRouteForm" prop-name="transport_stoppages"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <div class="row">
                    <div class="col-12 col-sm-6">
                    </div>
                    <div class="col-12 col-sm-6 text-right">
                        <router-link to="/transport/route" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
                        <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                        <button type="submit" class="btn btn-info waves-effect waves-light">
                            <span v-if="id">{{trans('general.update')}}</span>
                            <span v-else>{{trans('general.save')}}</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                transportRouteForm: new Form({
                    name : '',
                    description : '',
                    transport_stoppages: []
                }),
                transport_stoppages: [],
                selected_transport_stoppages: null,
                showTransportStoppageModal: false
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-transport-route') && !helper.hasPermission('edit-transport-route')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                this.showTransportStoppageModal = false;
                axios.get('/api/transport/route/pre-requisite')
                    .then(response => {
                        this.transport_stoppages = response;

                        if(this.id)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            store(){
                let loader = this.$loading.show();
                this.transportRouteForm.post('/api/transport/route')
                    .then(response => {
                        toastr.success(response.message);
                        this.transportRouteForm.transport_stoppages = [];
                        this.selected_transport_stoppages = null;
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
                axios.get('/api/transport/route/'+this.id)
                    .then(response => {
                        this.transportRouteForm.name = response.transport_route.name;
                        this.transportRouteForm.description = response.transport_route.description;
                        this.selected_transport_stoppages = response.selected_transport_stoppages;
                        response.selected_transport_stoppages.forEach(transport_route => {
                            this.transportRouteForm.transport_stoppages.push(transport_route.id);
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/transport/route');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.transportRouteForm.patch('/api/transport/route/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/transport/route');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config);
            },
            onTransportStoppageSelect(selectedOption){
                this.transportRouteForm.transport_stoppages.push(selectedOption.id);
            },
            onTransportStoppageRemove(removedOption){
                this.transportRouteForm.transport_stoppages.splice(this.transportRouteForm.transport_stoppages.indexOf(removedOption.id), 1);
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>
