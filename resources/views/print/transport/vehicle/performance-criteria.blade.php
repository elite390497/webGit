@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_performance_criteria').' '.trans('general.total_result_count',['count' => count($vehicle_performance_criterias)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.vehicle')}}</th>
                <th>{{trans('transport.vehicle_performance_criteria_date_effective')}}</th>
                <th>{{trans('transport.vehicle_performance_criteria_mileage_range')}} ({{trans('transport.unit_km_per_liter')}})</th>
                <th>{{trans('transport.vehicle_performance_criteria_run_range')}} ({{trans('transport.unit_km')}})</th>
                <th>{{trans('transport.vehicle_performance_criteria_service_charge_range')}}</th>
                <th>{{trans('transport.vehicle_performance_criteria_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_performance_criterias as $vehicle_performance_criteria)
        		<tr>
        			<td>{{$vehicle_performance_criteria->Vehicle->detail}}</td>
                    <td>{{showDate($vehicle_performance_criteria->date_effective)}}</td>
                    <td>{{formatNumber($vehicle_performance_criteria->min_mileage).' '.trans('general.to').' '.formatNumber($vehicle_performance_criteria->max_mileage)}}</td>
                    <td>{{$vehicle_performance_criteria->min_run.' '.trans('general.to').' '.$vehicle_performance_criteria->max_run}}</td>
                    <td>{{currency($vehicle_performance_criteria->min_service_charge,1).' '.trans('general.to').' '.currency($vehicle_performance_criteria->max_service_charge,1)}}</td>
                    <td>{{$vehicle_performance_criteria->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')