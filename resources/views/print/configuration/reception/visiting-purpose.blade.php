@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.visiting_purpose').' '.trans('general.total_result_count',['count' => count($visiting_purposes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('reception.visiting_purpose_name')}}</th>
                <th>{{trans('reception.visiting_purpose_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($visiting_purposes as $visiting_purpose)
        		<tr>
        			<td>{{$visiting_purpose->name}}</td>
                    <td>{{$visiting_purpose->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')