<template>
    <div class="form-group">
        <label for="">{{label || trans('general.date_range')}}</label>
        <div class="input-group">
            <datepicker :bootstrapStyling="true" input-class="form-control" :value="startDate" :placeholder="trans('general.start_date')" :clear-button="clearButton" @selected="updateStartDate" @cleared="clearStartDate"></datepicker>
            <datepicker :bootstrapStyling="true" input-class="form-control m-l-10" :value="endDate" :placeholder="trans('general.end_date')" @selected="updateEndDate" @cleared="clearEndDate"></datepicker>
        </div>
    </div>
</template>
<script>
    export default {
        components: {},
        props: ['startDate','endDate','label'],
        data(){
            return {
                clearButton: true
            }
        },
        methods: {
            updateStartDate(val){
                let date = helper.toDate(val);
                if(date > this.endDate)
                    this.$emit('update:endDate',date);
                this.$emit('update:startDate',date);
            },
            updateEndDate(val){
                let date = helper.toDate(val);
                if(!this.startDate || this.startDate > date)
                    this.$emit('update:startDate',date);
                this.$emit('update:endDate',date);
            },
            clearStartDate(){
                this.$emit('update:startDate','');
                this.$emit('update:endDate','');
            },
            clearEndDate(){
                this.$emit('update:endDate','');
            }
        }
    }
</script>
