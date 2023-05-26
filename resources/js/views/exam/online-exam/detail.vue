<template>
	<div>
    	<div class="card border-right">
            <div class="card-body">
                <h4 class="card-title m-3">{{onlineExam.name}}
                    <div class="action-buttons pull-right">
                        <button class="btn btn-success btn-sm" v-if="! onlineExam.is_published" v-confirm="{ok: confirmStatusChange('publish')}" key="publishExam" @click="('publish')"><i class="fas fa-check"></i> {{trans('exam.publish_online_exam')}}</button>
                        <button class="btn btn-danger btn-sm" v-if="onlineExam.is_published" v-confirm="{ok: confirmStatusChange('draft')}" key="draftExam" ><i class="fas fa-times"></i> {{trans('exam.draft_online_exam')}}</button>
                    </div>
                </h4>
                <div class="table-responsive">
                    <table class="table table-sm custom-show-table">
                        <tbody>
                            <tr>
                                <td>{{trans('exam.online_exam_is_published')}}</td>
                                <td style="font-weight: bold; font-size: 120%;">
                                    <span v-if="onlineExam.is_published" class="text-success">{{trans('exam.online_exam_published')}}</span>
                                    <span v-else class="text-danger">{{trans('exam.online_exam_not_published')}}</span>
                                </td>
                            </tr>
                            <tr v-if="onlineExam.id">
                                <td>{{trans('exam.online_exam_status')}}</td>
                                <td>
                                    <span :class="['label', 'label-'+onlineExam.status_detail.type]">{{onlineExam.status_detail.text}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('academic.batch')}}</td>
                                <td>
                                    {{onlineExam.batch.course.name+' '+onlineExam.batch.name}}
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('academic.subject')}}</td>
                                <td>
                                    {{onlineExam.subject.name+' ('+onlineExam.subject.name+')'}}
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('exam.online_exam_date')}}</td>
                                <td>
                                    {{onlineExam.date | moment}} 
                                    {{onlineExam.start_time | momentTime}} {{trans('general.to')}}
                                    {{onlineExam.end_time | momentTime}}
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('exam.online_exam_type')}}</td>
                                <td>
                                    {{trans('exam.online_exam_type_'+onlineExam.exam_type)}}
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('exam.online_exam_passing_percentage')}}</td>
                                <td>
                                    {{onlineExam.passing_percentage}}%
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('exam.online_exam_is_negative_mark_applicable')}}</td>
                                <td>
                                    {{onlineExam.is_negative_mark_applicable ? trans('list.yes') : trans('list.no')}} {{onlineExam.is_negative_mark_applicable ? onlineExam.negative_mark_percentage_per_question+'%' : ''}}
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('general.created_at')}}</td>
                                <td>
                                    {{onlineExam.created_at | momentDateTime}}
                                </td>
                            </tr>
                            <tr>
                                <td>{{trans('general.updated_at')}}</td>
                                <td>
                                    {{onlineExam.updated_at | momentDateTime}}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="text-align:left;">
                                    {{onlineExam.description}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
	export default {
		props: ['onlineExam'],
        methods: {
            confirmStatusChange(status){
                return dialog => this.changeExamStatus(status);
            },
            changeExamStatus(status) {
                let loader = this.$loading.show();
                axios.post('/api/online-exam/'+this.onlineExam.uuid+'/status?status='+status)
                    .then(response => {
                        this.$emit('updateExam');
                        toastr.success(response.message);
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
	}
</script>