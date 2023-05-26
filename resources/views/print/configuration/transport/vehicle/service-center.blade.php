@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_service_center').' '.trans('general.total_result_count',['count' => count($vehicle_service_centers)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('transport.vehicle_service_center_name')}}</th>
                <th>{{trans('transport.vehicle_service_center_phone')}}</th>
                <th>{{trans('transport.vehicle_service_center_contact_person')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_service_centers as $vehicle_service_center)
        		<tr>
        			<td>{{$vehicle_service_center->name}}</td>
                    <td>{{$vehicle_service_center->phone}}</td>
                    <td>{{$vehicle_service_center->contact_person}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')