<template>
    <div class="card card-box with-shadow teacher-card">
        <div class="card-body">
            <div class="teacher-info">
                <span class="teacher-thumb pull-left">
                    <template v-if="!teacher.photo">
                        <i class="fas fa-user"></i>
                    </template>
                    <template v-else>
                        <img :src="getEmployeePhoto(teacher)" class="img-circle">
                    </template>
                </span>
                <p>
                    <span class="teacher-name">{{ getEmployeeName(teacher) }}</span>
                    <span class="other small text-muted" v-if="getConfig('show_teacher_contact_number')"><i class="fas fa-phone"></i> {{ teacher.contact_number }}</span>
                    <span class="other small text-muted" v-if="getConfig('show_teacher_email')"><i class="fas fa-envelope"></i> {{ teacher.email }}</span>
                    <span class="other small text-muted" v-if="getConfig('show_teacher_date_of_joining')"><i class="fas fa-calendar"></i> {{trans('general.since')}} {{ getEmployeeDateOfJoining(teacher) }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: { 
            teacher: {
              type: Object,
              default: function () {
                return {}
              }
            },
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getEmployeePhoto(employee){
                return '/' + employee.photo;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnly(employee){
                return helper.getEmployeeDesignationOnly(employee);
            },
            getEmployeeDateOfJoining(employee) {
                return helper.getEmployeeDateOfJoining(employee);
            }
        },
    }
</script>

<style scoped lang="scss">
    .card.teacher-card {
        opacity: 0.9;
        transition: all 0.3s ease-in-out;
        cursor: pointer;

        .teacher-info {
            .teacher-thumb {
                float: left;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #e1e2e3;
                margin-right: 20px;
                text-align: center;
                overflow: hidden;
                i {
                    padding-top: 25px;
                    font-size: 50px;
                }
                img {
                    width: 100%;
                }
            }
            p{
                padding-top: 10px;
                margin-bottom: 0;
                min-height: 100px;

                span {
                    display: block;

                    &.teacher-name{
                        font-size: 120%;
                        font-weight: 500;
                    }
                    &.designation{
                        font-size: 100%;
                    }
                    &.other{
                        font-size: 90%;
                    }
                }
            }
        }
    }
</style>