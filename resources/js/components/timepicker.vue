<template>
	<div>
	    <select :value="hour" class="custom-select" style="width:auto;" name="hour" @change="updateHour">
	      <option value="">{{trans('general.select_hour')}}</option>
	      <option v-for="hr in hours" v-bind:value="hr">
	        {{ timePadding(hr) }}
	      </option>
	    </select>
	    <select :value="minute" class="custom-select m-l-10" style="width:auto;" name="minute" @change="updateMinute">
	      <option value="">{{trans('general.select_minute')}}</option>
	      <option v-for="min in mins" v-bind:value="min">
	        {{ timePadding(min) }}
	      </option>
	    </select>
	    <select :value="meridiem" class="custom-select m-l-10" style="width:auto;" name="meridiem" @change="updateMeridiem">
	      <option v-for="mer in meridiems" v-bind:value="mer.value">
	        {{ mer.text }}
	      </option>
	    </select>
	</div>
</template>

<script>
	export default {
        props: ['hour','minute','meridiem'],
        data(){
        	return{
                hours: [1,2,3,4,5,6,7,8,9,10,11,12],
                mins: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],
                meridiems: [
                	{
                		text: i18n.general.am,
                		value: 'am'
                	},
                	{
                		text: i18n.general.pm,
                		value: 'pm'
                	}
                ]
        	}
        },
		methods: {
			timePadding(time){
                return helper.formatWithPadding(time,2);
			},
            updateHour(val){
                this.$emit('update:hour',val.target.value);
            },
            updateMinute(val){
                this.$emit('update:minute',val.target.value);
            },
            updateMeridiem(val){
                this.$emit('update:meridiem',val.target.value);
            }
		}
	}
</script>