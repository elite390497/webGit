@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.enquiry_type').' '.trans('general.total_result_count',['count' => count($enquiry_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('reception.enquiry_type_name')}}</th>
                <th>{{trans('reception.enquiry_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($enquiry_types as $enquiry_type)
        		<tr>
        			<td>{{$enquiry_type->name}}</td>
                    <td>{{$enquiry_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')