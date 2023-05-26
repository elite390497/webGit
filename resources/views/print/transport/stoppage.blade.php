@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.stoppage').' '.trans('general.total_result_count',['count' => count($stoppages)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.stoppage_name')}}</th>
                <th>{{trans('transport.stoppage_description')}}</th>
                <th>{{trans('general.created_at')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($stoppages as $stoppage)
        		<tr>
        			<td>{{$stoppage->name}}</td>
                    <td>{{$stoppage->description}}</td>
                    <td>{{showDateTime($stoppage->created_at)}}</td>
                    <td>{{showDateTime($stoppage->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')