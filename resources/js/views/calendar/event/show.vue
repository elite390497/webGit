<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg" v-if="event.id">
                    <div class="modal-header">
                        <slot name="header">
                            <span>{{event.title}}</span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <h6 class="card-title">
                                <strong>{{trans('calendar.event_duration')}}:</strong> {{event.start_date | moment}} <span v-if="event.start_time">{{event.start_time | momentTime }}</span> {{trans('general.to')}}  {{event.end_date | moment}} <span v-if="event.end_time">{{event.end_time | momentTime }}</span>
                                <br /><br />
                                <strong>{{trans('calendar.event_venue')}}:</strong> {{event.venue}}<br /><br />
                                <strong>{{trans('calendar.event_audience')}}:</strong>

                                <span v-if="event.audience == 'everyone'">{{trans('calendar.event_for_everyone')}}</span>
                                <template v-if="event.audience == 'selected_course'">
                                    {{trans('academic.course')}} <br />
                                    <ul style="list-style:none;">
                                        <template v-for="course in event.courses"><li><i class="fas fa-check"></i> {{course.name+' ('+course.course_group.name+')'}}</li></template>
                                    </ul>
                                </template>
                                <template v-else-if="event.audience == 'selected_batch'">
                                    {{trans('academic.batch')}} <br />
                                    <ul style="list-style:none;">
                                        <template v-for="batch in event.batches"><li><i class="fas fa-check"></i> {{batch.name+' ('+batch.course.name+')'}}</li></template>
                                    </ul>
                                </template>
                                <template v-else-if="event.audience == 'selected_department'">
                                    {{trans('employee.department')}} <br />
                                    <ul style="list-style:none;">
                                        <template v-for="department in event.departments"><li><i class="fas fa-check"></i> {{department.name}}</li></template>
                                    </ul>
                                </template>
                                <template v-else-if="event.audience == 'selected_employee_category'">
                                    {{trans('employee.category')}} <br />
                                    <ul style="list-style:none;">
                                        <template v-for="employee_category in event.employee_categorys"><li><i class="fas fa-check"></i> {{employee_category.name}}</li></template>
                                    </ul>
                                </template>

                                <p class="pull-right" v-if="event.user">
                                    <strong>{{trans('calendar.event_posted_by')}}:</strong> {{getEmployeeName(event.user.employee)}} {{getEmployeeDesignationOnDate(event.user.employee, event.start_date)}}
                                </p>
                            </h6>
                            <div class="m-t-20" v-html="event.description"></div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/calendar/event/${event.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{event.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{event.updated_at | momentDateTime}}</small>
                                </span>
                            </p>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        components: {},
        props: ['uuid', 'url'],
        mounted(){
            if(this.uuid)
                this.get();
        },
        data(){
            return {
                event: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                let eventUrl = this.url ? '/api' + this.url : '/api/event/' + this.uuid;
                axios.get(eventUrl)
                    .then(response => {
                        this.event = response.event;
                        this.attachments = response.attachments;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        }
    }
</script>