@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('misc.religion').' '.trans('general.total_result_count',['count' => count($religions)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('misc.religion_name')}}</th>
                <th>{{trans('misc.religion_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($religions as $religion)
        		<tr>
        			<td>{{$religion->name}}</td>
                    <td>{{$religion->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')