@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('exam.schedule').' '.trans('general.total_result_count',['count' => count($exam_schedules)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('exam.exam')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('exam.schedule')}}</th>
                <th>{{trans('exam.assessment')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($exam_schedules as $exam_schedule)
        		<tr>
                    <td valign="top">
                        {{$exam_schedule->exam->name}}
                        @if($exam_schedule->exam->exam_term_id)
                            <br /><small>({{$exam_schedule->exam->term->courseGroup->name}})</small>
                        @endif
                    </td>
        			<td valign="top">{{$exam_schedule->batch->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($exam_schedule->records as $record)
                                @if($record->date)
                                    <table width="100%" border="0">
                                        <tr>
                                            <td style="width:60%;">{{$record->subject->name_with_code}}</td>
                                            <td>{{showDate($record->date)}}</td>
                                        </tr>
                                    </table>
                                @endif
                            @endforeach
                        </ul>
                    </td>
                    <td valign="top">
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($exam_schedule->assessment->details as $detail)
                                <li>{{$detail->name}} ({{trans('exam.assessment_detail', ['max_mark' => formatNumber($detail->max_mark), 'pass_percentage' => formatNumber($detail->pass_percentage)])}})</li>
                            @endforeach
                        </ul>
                    </td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')