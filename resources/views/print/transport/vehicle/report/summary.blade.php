@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_summary_report').' '.trans('general.total_result_count',['count' => count($list)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.vehicle')}}</th>
                <th>{{trans('transport.vehicle_age')}}</th>
                <th>{{trans('transport.vehicle_fuel_input')}} ({{trans('transport.unit_liter')}})</th>
                <th>{{trans('transport.vehicle_fuel_cost')}} ({{gv(getDefaultCurrency(), 'symbol')}})</th>
                <th>{{trans('transport.vehicle_run')}} ({{trans('transport.unit_km')}})</th>
                <th>{{trans('transport.vehicle_mileage')}}</th>
                <th>{{trans('transport.vehicle_service_charge')}}</th>
                <th>{{trans('transport.vehicle_rating')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($list as $item)
        		<tr>
                    <td>{{gv($item, 'vehicle')}}</td>
                    <td>{{gv($item, 'age')}}</td>
                    <td>{{gv($item, 'total_fuel', 0)}}</td>
                    <td>{{gv($item, 'total_fuel_cost', 0)}}</td>
                    <td>{{gv($item, 'total_run', 0)}}</td>
                    <td>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_actual_mileage')}}</span>: {{gv($item, 'mileage')}} {{trans('transport.unit_km_per_liter')}}</p>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_proposed_mileage')}}</span>: {{gv($item, 'proposed_mileage_range')}} {{trans('transport.unit_km_per_liter')}}</p>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_mileage_diff')}}</span>: 
                            @if(gv($item, 'mileage_diff'))
                                <span class="text-success font-weight-bold">{{gv($item, 'mileage_diff')}}% </span>
                            @else
                                <span class="text-danger font-weight-bold">{{gv($item, 'mileage_diff')}}% </span>
                            @endif
                        </p>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_rating')}}</span>: {{gv($item, 'mileage_rating')}}</p>
                    </td>
                    <td>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_actual_service_charge')}}</span>: {{currency(gv($item, 'total_service_charge'))}}</p>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_proposed_service_charge')}}</span>: {{gv($item, 'proposed_service_charge_range')}} ({{gv(getDefaultCurrency(), 'symbol')}})</p>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_service_charge_diff')}}</span>: 
                            @if(gv($item, 'service_charge_diff'))
                                <span class="text-success font-weight-bold">{{gv($item, 'service_charge_diff')}}% </span>
                            @else
                                <span class="text-danger font-weight-bold">{{gv($item, 'service_charge_diff')}}% </span>
                            @endif
                        </p>
                        <p><span class="font-weight-bold">{{trans('transport.vehicle_rating')}}</span>: {{gv($item, 'service_charge_rating')}}</p>
                    </td>
                    <td>
                        {{gv($item, 'rating', 0).'/'.gv($item, 'total_rating', 0)}}
                    </td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')