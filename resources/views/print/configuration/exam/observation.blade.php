@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('exam.observation').' '.trans('general.total_result_count',['count' => count($exam_observations)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('exam.observation_name')}}</th>
            	<th>{{trans('exam.observation_type')}}</th>
                <th>{{trans('exam.observation_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($exam_observations as $exam_observation)
        		<tr>
        			<td>{{$exam_observation->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($exam_observation->details as $detail)
                                <li>{{$detail->name}} ({{trans('exam.observation_detail', ['max_mark' => formatNumber($detail->max_mark), 'pass_percentage' => formatNumber($detail->pass_percentage)])}})</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{$exam_observation->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')