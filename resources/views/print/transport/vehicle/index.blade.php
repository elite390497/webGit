@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle').' '.trans('general.total_result_count',['count' => count($vehicles)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.vehicle_name')}}</th>
                <th>{{trans('transport.vehicle_registration_number')}}</th>
                <th>{{trans('transport.vehicle_model')}}</th>
                <th><small>{{trans('transport.vehicle_max_seating_capacity')}}</small></th>
                <th>{{trans('transport.vehicle_max_allowed')}}</th>
                <th>{{trans('transport.vehicle_owner')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicles as $vehicle)
        		<tr>
        			<td>{{$vehicle->name}}</td>
                    <td>{{$vehicle->registration_number}}</td>
                    <td>{{$vehicle->model.' '.trans('transport.vehicle_make').': '.$vehicle->make}}</td>
                    <td>{{$vehicle->max_seating_capacity}}</td>
                    <td>{{$vehicle->max_allowed}}</td>
                    <td>
                        <p>{{$vehicle->is_owned ? trans('transport.vehicle_owned') : trans('transport.vehicle_contract')}}</p>
                        <ul style="list-style:none;padding:0;margin:0">
                            <li><strong>{{trans('transport.vehicle_owner_name')}}:</strong> {{$vehicle->owner_name}}</li>
                            <li><strong>{{trans('transport.vehicle_owner_company_name')}}:</strong> {{$vehicle->owner_company_name}}</li>
                            <li><strong>{{trans('transport.vehicle_owner_phone')}}:</strong> {{$vehicle->owner_phone}}</li>
                            <li><strong>{{trans('transport.vehicle_owner_email')}}:</strong> {{$vehicle->owner_email}}</li>
                        </ul>
                    </td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')