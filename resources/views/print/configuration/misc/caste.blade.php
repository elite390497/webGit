@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('misc.caste').' '.trans('general.total_result_count',['count' => count($castes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('misc.caste_name')}}</th>
                <th>{{trans('misc.caste_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($castes as $caste)
        		<tr>
        			<td>{{$caste->name}}</td>
                    <td>{{$caste->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')