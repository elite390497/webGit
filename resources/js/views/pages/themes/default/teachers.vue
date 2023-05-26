<template>
    <div>
        <div class="page-title">
            <div class="fix-width fix-width-mobile">
                <h2>{{ page.title }}</h2>
            </div>
        </div>

        <div v-if="page.body" class="fix-width fix-width-mobile p-t-80">
            <div class="page-body" v-html="page.body"></div>
        </div>

        <div class="fix-width fix-width-mobile p-y-80">
            <div class="row">
                <div class="col-12">
                    <div class="teacher-feed">
                        <div class="row teacher-group m-b-30" v-for="(teachers, teacherGroup) in teachers" :key="teacherGroup">
                            <div class="col-12">
                                <h2 class="teacher-group-title m-b-20">{{ teacherGroup }}</h2>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4" v-for="teacher in teachers" :key="teacher.id" >
                                <teacher-card class="teacher-item" :teacher="teacher"></teacher-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TeacherCard from '@js/widgets/teacher-card'

    export default {
        components: {
            TeacherCard
        },
        data(){
            return {
                page: {},
                teachers: {}
            }
        },
        mounted(){
            this.getData();
            this.getTeachers();

            helper.showDemoNotification(['frontend_teacher']);
        },
        methods: {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/teachers/content')
                    .then(response => {
                        this.page = response.page;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/');
                    })
            },
            getTeachers(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/teacher/list')
                    .then(response => {
                        this.teachers = response.teachers;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
    }
</script>
<style lang="scss">
    .teacher-group-title {
        font-weight: 500;
    }
</style>