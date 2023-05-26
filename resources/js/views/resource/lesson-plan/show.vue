<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="lesson_plan.id">
                        <slot name="header">
                            <span>{{lesson_plan.topic}}</span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="lesson_plan.id">
                        <slot name="body">
                            <h6 class="card-title">
                                <strong>{{trans('academic.subject')}}:</strong> {{lesson_plan.subject.name+' ('+lesson_plan.subject.code+')'}} 
                                <br />
                                <strong>{{trans('academic.batch')}}:</strong> {{lesson_plan.subject.batch.course.name+' '+lesson_plan.subject.batch.name}} 
                                <br />
                                <strong>{{trans('resource.lesson_plan_start_date')}}:</strong> {{lesson_plan.start_date | moment}} 
                                <br />
                                <strong>{{trans('resource.lesson_plan_end_date')}}:</strong> {{lesson_plan.end_date | moment}} 
                                <p class="pull-right" v-if="lesson_plan.employee">
                                    <strong>{{trans('resource.lesson_plan_created_by')}}:</strong> {{getEmployeeName(lesson_plan.employee)}} {{getEmployeeDesignation(lesson_plan.employee, lesson_plan.start_date)}}
                                </p>
                            </h6>
                            <div class="m-t-20" v-for="lesson_plan_detail in lesson_plan.lesson_plan_details">
                                <h6 class="card-title">{{lesson_plan_detail.title}}</h6>
                                <p class="font-90pc" v-text="lesson_plan_detail.description"></p>
                                <hr v-if="!$last(lesson_plan_detail, lesson_plan.lesson_plan_details)" />
                            </div>
                            <div v-if="attachments.length">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/resource/lesson/plan/${lesson_plan.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{lesson_plan.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{lesson_plan.updated_at | momentDateTime}}</small>
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
                lesson_plan: [],
                attachments: []
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/lesson/plan/'+this.uuid)
                    .then(response => {
                        this.lesson_plan = response.lesson_plan;
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
            getEmployeeDesignation(employee, date){
                return helper.getEmployeeDesignation(employee, date);
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
          }
        }
    }
</script>