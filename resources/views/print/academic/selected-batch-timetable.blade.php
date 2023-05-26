@foreach($batches as $batch)
    @foreach($batch->Timetables->filter(function($timetable) use($filter) { return $timetable->date_effective <= $filter['date_effective']; })->sortByDesc('date_effective')->values()->take(1)->all() as $timetable)

        @include('print.academic.batch-timetable',compact($timetable))

        <div style="page-break-after: always;"></div>
    @endforeach
@endforeach