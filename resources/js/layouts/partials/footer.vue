<template>
	<footer class="footer">
        {{getConfig('footer_credit')}} {{trans('general.version')+' '+getConfig('v')}}
    </footer>
</template>

<script>
    export default { 
    	methods: {
    		getConfig(config){
    			return helper.getConfig(config);
    		}
    	}
    }
</script>