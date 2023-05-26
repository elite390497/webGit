@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.complaint_type').' '.trans('general.total_result_count',['count' => count($complaint_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('reception.complaint_type_name')}}</th>
                <th>{{trans('reception.complaint_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($complaint_types as $complaint_type)
        		<tr>
        			<td>{{$complaint_type->name}}</td>
                    <td>{{$complaint_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')