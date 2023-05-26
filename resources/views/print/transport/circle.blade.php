@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.circle').' '.trans('general.total_result_count',['count' => count($circles)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.circle_name')}}</th>
                <th>{{trans('transport.circle_description')}}</th>
                <th>{{trans('general.created_at')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($circles as $circle)
        		<tr>
        			<td>{{$circle->name}}</td>
                    <td>{{$circle->description}}</td>
                    <td>{{showDateTime($circle->created_at)}}</td>
                    <td>{{showDateTime($circle->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')