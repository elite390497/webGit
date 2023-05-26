@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.vehicle_document').' '.trans('general.total_result_count',['count' => count($vehicle_documents)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.vehicle')}}</th>
                <th>{{trans('transport.vehicle_document_type')}}</th>
                <th>{{trans('transport.vehicle_document_title')}}</th>
                <th>{{trans('transport.date_of_expiry')}}</th>
                <th>{{trans('transport.vehicle_document_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vehicle_documents as $vehicle_document)
        		<tr>
        			<td>{{$vehicle_document->Vehicle->detail}}</td>
                    <td>{{$vehicle_document->VehicleDocumentType->name}}</td>
                    <td>{{$vehicle_document->title}}</td>
                    <td>
                        @if($vehicle_document->date_of_expiry)
                            {{showDate($vehicle_document->date_of_expiry)}}
                        @endif
                    </td>
                    <td>{{$vehicle_document->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')