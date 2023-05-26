@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('misc.blood_group').' '.trans('general.total_result_count',['count' => count($blood_groups)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('misc.blood_group_name')}}</th>
                <th>{{trans('misc.blood_group_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($blood_groups as $blood_group)
        		<tr>
        			<td>{{$blood_group->name}}</td>
                    <td>{{$blood_group->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')