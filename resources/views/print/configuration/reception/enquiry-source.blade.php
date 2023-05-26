@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.enquiry_source').' '.trans('general.total_result_count',['count' => count($enquiry_sources)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('reception.enquiry_source_name')}}</th>
                <th>{{trans('reception.enquiry_source_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($enquiry_sources as $enquiry_source)
        		<tr>
        			<td>{{$enquiry_source->name}}</td>
                    <td>{{$enquiry_source->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')