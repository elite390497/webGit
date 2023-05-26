<script>
    import { Line  } from 'vue-chartjs'

    export default {
        extends: Line,
        props: ['chart'],
        data: () => ({
         options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: {}
                }]
              }
            }
        }),
        mounted(){
            this.render(this.chart);
        },
        methods:{
          render(data){
            this.renderChart(data, this.options);
          }
        },
        watch: {
          chart(val){
            this.render(val);
          }
        }
    }
</script>
