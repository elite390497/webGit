<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('communication.meeting')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button @click="$router.go(-1)" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('general.back')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row" v-if="isDemo">
                <div class="col-12">
                    <p class="alert alert-info m-4">{{trans('communication.demo_mode_meeting_description')}}</p>
                </div>
            </div>

            <div class="row" v-if="meeting.uuid">
                <div class="col-12 col-sm-6">
                	<div class="card border-right">
                		<div class="card-body">
                			<h4 class="card-title m-3"><span class="d-none d-sm-inline">{{trans('communication.meeting_detail')}}</span> 
                            <span v-if="meeting.is_live" class="badge badge-success">{{trans('communication.live')}}</span>

                            <span v-if="meeting.is_expired" class="badge badge-danger">{{trans('communication.expired')}}</span>
                            </h4>
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                        	<td>{{trans('communication.meeting_title')}}</td>
                                        	<td>{{meeting.title}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('communication.meeting_duration')}}</td>
                                        	<td>
                                                {{meeting.date | moment}} <span v-if="meeting.start_time">{{meeting.start_time | momentTime }}</span> 
                                                <span v-if="meeting.end_time"> {{trans('general.to')}} 
                                                {{meeting.end_time | momentTime }}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('communication.meeting_audience')}}</td>
                                            <td><meeting-audience :meeting="meeting" /></td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('communication.meeting_created_by')}}</td>
                                            <td>
                                                {{getEmployeeName(meeting.user.employee)}} <br > {{getEmployeeDesignationOnDate(meeting.user.employee, meeting.date)}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('general.created_at')}}</td>
                                            <td>{{meeting.created_at | momentDateTime}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('general.updated_at')}}</td>
                                            <td>{{meeting.updated_at | momentDateTime}}</td>
                                        </tr>
                                   	</tbody>
                                </table>

                                <div class="p-3">
                                    <div class="m-t-20 html-view" v-html="meeting.description"></div>
                                    <div v-if="attachments.length">
                                        <ul class="m-t-10 upload-file-list">
                                            <li class="upload-file-list-item" v-for="attachment in attachments">
                                                <a :href="`/communication/meeting/${meeting.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                		</div>
                	</div>
                </div>
                <div class="col-12 col-sm-6 p-r-40">
                    <div class="mt-4 btn btn-block btn-success btn-sm" @click="$router.push('/communication/meeting/' + meeting.uuid+'/live')">{{trans('communication.join_meeting')}}</div>

                    <template v-if="is_editable">
                        <h4 class="card-title m-3">{{trans('communication.audience')}}</h4>
                        <user-search @searched="addToSearchResult"></user-search>

                        <div class="form-group">
                            <ul class="font-80pc">
                                <li v-for="result in searchResults" :key="result.key">
                                    {{result.name+' '+result.description_1}} <span class="text-right text-danger" @click="deleteResult(result)"><i class="fas fa-times-circle"></i></span>
                                    <span class="d-block">{{result.description_2}} {{result.contact_number}}</span>
                                </li>
                            </ul>
                        </div>

                        <button type="button" @click="addAudience" v-if="searchResults.length" class="btn btn-info waves-effect waves-light">{{trans('communication.add_audience')}}</button>
                        
                        <hr />
                    </template>

                    <h4 class="card-title m-3">{{trans('communication.individual_audiences')}}</h4>
                    <ol class="font-80pc">
                        <li v-for="result in individual_audiences" :key="result.key">
                            {{result.name+' '+result.description_1}} <span v-if="is_editable" :key="result.key" class="text-right text-danger custom-button" v-confirm="{ok: confirmDelete(result)}"><i class="fas fa-times-circle"></i></span>
                            <span class="d-block">{{result.description_2}} {{result.contact_number}}</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import meetingAudience from './audience'
import userSearch from "@components/user-search"

export default {
    components: {meetingAudience, userSearch},
    data() {
        return {
            uuid:this.$route.params.uuid,
            meeting: {},
            attachments: [],
            is_editable: false,
            is_owner: false,
            additionalAudienceForm: new Form({
                individual_students: [],
                individual_employees: []
            }),
            searchResults: [],
            individual_audiences: []
        }
    },
    mounted(){
        if(!helper.hasPermission('list-meeting')){
            helper.notAccessibleMsg();
            this.$router.push('/dashboard');
        }

        this.getMeeting();
    },
    methods: {
        getMeeting(){
            let loader = this.$loading.show();
            axios.get('/api/meeting/'+this.uuid+'?individual_audiences=true')
                .then(response => {
                    this.meeting = response.meeting;
                    this.attachments = response.attachments;
                    this.is_editable = response.is_editable;
                    this.individual_audiences = response.individual_audiences;

                    if (this.meeting.user_id === helper.getAuthUser('id')) {
                        this.is_owner = true;
                    }

                    loader.hide();
                })
                .catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                    this.$router.push('/communication/meeting');
                })
        },
        hasPermission(permission){
            return helper.hasPermission(permission);
        },
        getEmployeeName(employee){
            return helper.getEmployeeName(employee);
        },
        getEmployeeDesignationOnDate(employee, date){
            return helper.getEmployeeDesignationOnDate(employee, date);
        },
        addToSearchResult(result) {
            let existing_result = this.searchResults.findIndex(o => o.type === result.type && o.id === result.id)

            if (existing_result < 0) {
                this.searchResults.push(result)
            }
        },
        deleteResult(result) {
            let idx = this.searchResults.findIndex(o => o.type === result.type && o.id === result.id)
            this.searchResults.splice(idx, 1);
        },
        addAudience()
        {
            let loader = this.$loading.show();
            this.additionalAudienceForm.individual_students = [];
            this.additionalAudienceForm.individual_employees = [];
            this.searchResults.forEach(result => {
                if (result.type === 'student') {
                    this.additionalAudienceForm.individual_students.push(result.id)
                } else {
                    this.additionalAudienceForm.individual_employees.push(result.id)
                }
            })
            this.additionalAudienceForm.post('/api/meeting/'+this.meeting.uuid+'/audience')
                .then(response => {
                    toastr.success(response.message);
                    this.searchResults = [];
                    loader.hide();
                    this.getMeeting();
                })
                .catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                });
        },
        confirmDelete(result){
            return dialog => this.deleteAudience(result);
        },
        deleteAudience(result){
            let loader = this.$loading.show();
            axios.delete('/api/meeting/'+this.meeting.uuid+'/audience/'+result.type+'/'+result.id)
                .then(response => {
                    toastr.success(response.message);
                    loader.hide();
                    this.getMeeting();
                }).catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                });
        },
    },
    filters: {
        moment(date) {
            return helper.formatDate(date);
        },
        momentDateTime(date) {
            return helper.formatDateTime(date);
        },
        momentTime(time) {
            return helper.formatTime(time);
        }
    },
    computed: {
        authToken(){
            return helper.getAuthToken();
        },
        isDemo() {
            return ! helper.getConfig('mode') ? true : false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .video-list {
        display: flex;
        background-color: blue;
    }

    .video-item {
        margin: 10px;
        height: 150px;
        min-width: 150px;
        background: white;
    }

</style>