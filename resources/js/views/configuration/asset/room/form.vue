<template>
    <form @submit.prevent="proceed" @keydown="roomForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('asset.building')}}</label>
                    <v-select label="name" v-model="selected_building" name="building_id" id="building_id" :options="buildings" :placeholder="trans('asset.select_building')" @select="onBuildingSelect" @close="roomForm.errors.clear('building_id')" @remove="roomForm.building_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!buildings.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="roomForm" prop-name="building_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('asset.room_name')}}</label>
                    <input class="form-control" type="text" v-model="roomForm.name" name="name" :placeholder="trans('asset.room_name')">
                    <show-error :form-name="roomForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('asset.room_floor_number')}}</label>
                    <input class="form-control" type="text" v-model="roomForm.floor_number" name="floor_number" :placeholder="trans('asset.room_floor_number')">
                    <show-error :form-name="roomForm" prop-name="floor_number"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-12">
                <div class="form-group">
                    <label for="">{{trans('asset.room_description')}}</label>
                    <input class="form-control" type="text" v-model="roomForm.description" name="description" :placeholder="trans('asset.room_description')">
                    <show-error :form-name="roomForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/asset/room" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                roomForm: new Form({
                    name : '',
                    floor_number: '',
                    building_id: '',
                    description : ''
                }),
                buildings: [],
                selected_building: null
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/asset/room/pre-requisite')
                    .then(response => {
                        this.buildings = response.buildings;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
                },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.roomForm.post('/api/asset/room')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_building = null;
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
                axios.get('/api/asset/room/'+this.id)
                    .then(response => {
                        this.roomForm.name = response.room.name;
                        this.roomForm.floor_number = response.room.floor_number;
                        this.roomForm.building_id = response.room.building_id;
                        this.selected_building = response.selected_building;
                        this.roomForm.description = response.room.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/asset/room');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.roomForm.patch('/api/asset/room/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/asset/room');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBuildingSelect(selectedOption){
                this.roomForm.building_id = selectedOption.id;
            }
        }
    }
</script>
