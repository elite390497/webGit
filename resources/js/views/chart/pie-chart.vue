<script>
    import { Pie } from 'vue-chartjs'

    export default {
        extends: Pie,
        props: ['chart'],
        mounted(){
            this.render(this.chart);
        },
        methods:{
          render(data){
            this.renderChart(data, {responsive: true, maintainAspectRatio: false});
          }
        },
        watch: {
          chart(val){
            this.render(val);
          }
        }
    }
</script>
