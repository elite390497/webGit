@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.calling_purpose').' '.trans('general.total_result_count',['count' => count($calling_purposes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('reception.calling_purpose_name')}}</th>
                <th>{{trans('reception.calling_purpose_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($calling_purposes as $calling_purpose)
        		<tr>
        			<td>{{$calling_purpose->name}}</td>
                    <td>{{$calling_purpose->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')