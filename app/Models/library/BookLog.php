<?php

namespace App\Models\Library;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class BookLog extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'student_record_id',
                            'employee_id',
                            'date_of_issue',
                            'issue_remarks',
                            'due_date',
                            'late_fee_applicable',
                            'late_fee_frequency',
                            'late_fee_charge',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_issue' => 'date', 'due_date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'book_logs';
    protected static $logName = 'book_log';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function studentRecord()
    {
        return $this->belongsTo('App\Models\Student\StudentRecord');
    }
    
    public function employee()
    {
        return $this->belongsTo('App\Models\Employee\Employee');
    }
    
    public function bookLogDetails()
    {
        return $this->hasMany('App\Models\Library\BookLogDetail');
    }

    public function scopeInfo($q)
    {
        return $this->with('bookLogDetails', 'bookLogDetails.bookPostDetail', 'bookLogDetails.bookPostDetail.bookPost', 'bookLogDetails.bookPostDetail.bookCondition', 'bookLogDetails.bookPostDetail.bookPost.book', 'bookLogDetails.bookPostDetail.bookPost.book.bookAuthor', 'bookLogDetails.bookPostDetail.bookPost.book.bookLanguage', 'bookLogDetails.bookPostDetail.bookPost.book.bookTopic', 'bookLogDetails.bookPostDetail.bookPost.book.bookPublisher', 'studentRecord', 'studentRecord.batch', 'studentRecord.batch.course', 'studentRecord.student', 'studentRecord.student.parent', 'employee', 'employee.employeeDesignations', 'employee.employeeTerms', 'employee.employeeDesignations.designation', 'employee.employeeDesignations.designation.employeeCategory', 'employee.employeeDesignations.department');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
    
    public function scopeFilterByUuid($q, $uuid)
    {
        if (! $uuid) {
            return $q;
        }

        return $q->where('uuid', '=', $uuid);
    }

    public function scopeFilterByStudentRecordId($q, $student_record_id)
    {
        if (! $student_record_id) {
            return $q;
        }

        return $q->where('student_record_id', '=', $student_record_id);
    }

    public function scopeFilterByEmployeeId($q, $employee_id)
    {
        if (! $employee_id) {
            return $q;
        }

        return $q->where('employee_id', '=', $employee_id);
    }

    public function scopeDateOfIssueBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('date_of_issue', '>=', getStartOfDate($dates['start_date']))->where('date_of_issue', '<=', getEndOfDate($dates['end_date']));
    }

    public function scopeDueDateBetween($q, $dates)
    {
        if ((! $dates['start_date'] || ! $dates['end_date']) && $dates['start_date'] <= $dates['end_date']) {
            return $q;
        }

        return $q->where('due_date', '>=', getStartOfDate($dates['start_date']))->where('due_date', '<=', getEndOfDate($dates['end_date']));
    }
}
