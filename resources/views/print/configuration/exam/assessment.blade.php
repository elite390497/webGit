@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('exam.assessment').' '.trans('general.total_result_count',['count' => count($exam_assessments)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('exam.assessment_name')}}</th>
            	<th>{{trans('exam.assessment_type')}}</th>
                <th>{{trans('exam.assessment_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($exam_assessments as $exam_assessment)
        		<tr>
        			<td>{{$exam_assessment->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($exam_assessment->details as $detail)
                                <li>{{$detail->name}} ({{trans('exam.assessment_detail', ['max_mark' => formatNumber($detail->max_mark), 'pass_percentage' => formatNumber($detail->pass_percentage)])}})</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{$exam_assessment->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')