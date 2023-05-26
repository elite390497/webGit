@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('exam.grade').' '.trans('general.total_result_count',['count' => count($exam_grades)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('exam.grade_name')}}</th>
                <th>{{trans('exam.grade_range')}}</th>
                <th>{{trans('exam.grade_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($exam_grades as $exam_grade)
        		<tr>
        			<td valign="top">{{$exam_grade->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($exam_grade->details as $detail)
                                <li>{{$detail->name}} ({{trans('exam.grade_detail', ['max_percentage' => formatNumber($detail->max_percentage), 'min_percentage' => formatNumber($detail->min_percentage)])}})</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{$exam_grade->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')