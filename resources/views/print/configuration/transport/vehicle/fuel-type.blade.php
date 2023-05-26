@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_fuel_type').' '.trans('general.total_result_count',['count' => count($vehicle_fuel_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('transport.vehicle_fuel_type_name')}}</th>
                <th>{{trans('transport.vehicle_fuel_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_fuel_types as $vehicle_fuel_type)
        		<tr>
        			<td>{{$vehicle_fuel_type->name}}</td>
                    <td>{{$vehicle_fuel_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')