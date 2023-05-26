@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('resource.syllabus').' '.trans('general.total_result_count',['count' => count($syllabuses)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('academic.subject')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('resource.syllabus_title')}}</th>
                <th>{{trans('resource.syllabus_created_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($syllabuses as $syllabus)
        		<tr>
                    <td>{{$syllabus->subject->name_with_code}}</td>
                    <td>{{$syllabus->subject->batch->batch_with_course}}</td>
                    <td>{{$syllabus->title}}</td>
                    <td>{{$syllabus->employee->name}} <br /> {{getEmployeeDesignationName($syllabus->employee, $syllabus->date_created)}}</td>
                    <td>{{showDateTime($syllabus->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')