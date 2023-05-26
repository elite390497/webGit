<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.edit_batch')}}
                        <button class="btn btn-info btn-sm" @click="$router.push('/academic/batch')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('academic.batch')}}</span></button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body">
                    <batch-form :id="id"></batch-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import batchForm from './form';

    export default {
        components : { batchForm },
        data() {
            return {
                id:this.$route.params.id
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-batch')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>
