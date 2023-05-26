<?php

namespace App\Models\Library;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class BookLogDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'book_log_id',
                            'book_post_detail_id',
                            'date_of_return',
                            'return_remarks',
                            'is_non_returnable',
                            'non_returnable_charge',
                            'non_returnable_at',
                            'non_returnable_remarks',
                            'late_fee',
                            'options'
                        ];
    protected $casts = ['options' => 'array', 'date_of_return' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'book_log_details';
    protected static $logName = 'book_log_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function bookLog()
    {
        return $this->belongsTo('App\Models\Library\BookLog');
    }
    
    public function bookPostDetail()
    {
        return $this->belongsTo('App\Models\Library\BookPostDetail');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }

    public function scopeFilterByBookLogId($q, $book_post_id)
    {
        if (! $book_post_id) {
            return $q;
        }

        return $q->where('book_post_id', '=', $book_post_id);
    }
}
