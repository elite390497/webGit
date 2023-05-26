@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('library.issue').' '.trans('general.total_result_count',['count' => count($book_logs)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('library.date_of_issue')}}</th>
                <th>{{trans('library.due_date')}}</th>
                <th>{{trans('library.issue_to')}}</th>
                <th></th>
                <th>{{trans('library.no_of_books_issued')}}</th>
                <th>{{trans('library.no_of_books_returned')}}</th>
                <th>{{trans('library.issue_remarks')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($book_logs as $book_log)
        		<tr>
        			<td>{{showDate($book_log->date_of_issue)}}</td>
                    <td>{{showDate($book_log->due_date)}}</td>
                    <td>
                        @if($book_log->student_record_id) {{trans('student.student')}} @endif
                        @if($book_log->employee_id) {{trans('employee.employee')}} @endif
                    </td>
                    <td>
                        @if($book_log->student_record_id)
                            <span>{{trans('student.name').': '.$book_log->StudentRecord->Student->name}}</span> <br />
                            <span>{{trans('academic.batch').': '.$book_log->StudentRecord->Batch->batch_with_course}}</span><br />
                            <span>{{trans('student.first_guardian_name').': '.$book_log->StudentRecord->Student->Parent->first_guardian_name}}</span><br />
                        @endif

                        @if($book_log->employee_id)
                            <span>{{trans('employee.name').': '.$book_log->Employee->name_with_code}}</span> <br />
                            <span>{{trans('employee.father_name').': '.$book_log->Employee->father_name}}</span><br />
                            <span>{{trans('employee.contact_number').': '.$book_log->Employee->contact_number}}</span>

                        @endif
                    </td>
                    <td>{{$book_log->book_issue_count}}</td>
                    <td>{{$book_log->book_return_count}}</td>
        			<td>{{$book_log->issue_remarks}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')