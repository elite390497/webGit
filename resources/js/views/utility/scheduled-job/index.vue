<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('utility.scheduled_job')}}</h3>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body p-4">
                            <p>Add below cron command in your server:</p>
                            <blockquote>
                                php /path-to-artisan schedule:run >> /dev/null 2>&1
                            </blockquote>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-stripped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>Frequency</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Birthday/Anniversary wish to Staff/Customer</td>
                                            <td>Once per day at 09:00 AM</td>
                                        </tr>
                                        <tr>
                                            <td>Daily Backup</td>
                                            <td>Once per day at 01:00 AM</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        components : { },
        data() {
            return {

            }
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        },
        methods: {
        }
    }
</script>
