@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_document_type').' '.trans('general.total_result_count',['count' => count($vehicle_document_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('transport.vehicle_document_type_name')}}</th>
                <th>{{trans('transport.vehicle_document_type_description')}}</th>
                <th>{{trans('transport.has_expiry_date')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_document_types as $vehicle_document_type)
        		<tr>
        			<td>{{$vehicle_document_type->name}}</td>
                    <td>{{$vehicle_document_type->description}}</td>
                    <td>{{$vehicle_document_type->has_expiry_date ? trans('list.yes') : trans('list.no')}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')