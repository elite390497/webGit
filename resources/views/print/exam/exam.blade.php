@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('exam.exam').' '.trans('general.total_result_count',['count' => count($exams)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('exam.exam_name')}}</th>
                <th>{{trans('exam.term')}}</th>
                <th>{{trans('exam.exam_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($exams as $exam)
        		<tr>
                    <td valign="top">{{$exam->name}}</td>
        			<td valign="top">
                        @if($exam->exam_term_id)
                            {{$exam->term->name}} ({{$exam->term->courseGroup->name}})
                        @else
                            -
                        @endif
                    </td>
                    <td valign="top">{{$exam->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')