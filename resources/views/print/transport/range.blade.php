@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.range').' '.trans('general.total_result_count',['count' => count($ranges)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.range_name')}}</th>
                <th>{{trans('transport.range_description')}}</th>
                <th>{{trans('general.created_at')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($ranges as $range)
        		<tr>
        			<td>{{$range->name}}</td>
                    <td>{{$range->description}}</td>
                    <td>{{showDateTime($range->created_at)}}</td>
                    <td>{{showDateTime($range->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')