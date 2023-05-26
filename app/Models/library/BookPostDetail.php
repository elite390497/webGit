<?php

namespace App\Models\Library;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class BookPostDetail extends Model
{
    use LogsActivity;

    protected $fillable = [
                            'book_post_id',
                            'number',
                            'location',
                            'book_condition_id',
                            'is_not_available',
                            'remarks',
                            'options'
                        ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'book_post_details';
    protected static $logName = 'book_post_detail';
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    
    public function bookPost()
    {
        return $this->belongsTo('App\Models\Library\BookPost');
    }

    public function bookCondition()
    {
        return $this->belongsTo('App\Models\Configuration\Library\BookCondition');
    }

    public function bookLogDetails()
    {
        return $this->hasMany('App\Models\Library\BookLogDetail');
    }

    public function scopeInfo($q)
    {
        return $q->with('bookPost', 'bookPost.book');
    }
    
    public function scopeFilterById($q, $id)
    {
        if (! $id) {
            return $q;
        }

        return $q->where('id', '=', $id);
    }
    
    public function scopeFilterByNumber($q, $number)
    {
        if (! $number) {
            return $q;
        }

        return $q->where('number', '=', $number);
    }
    
    public function scopeFilterByAvailability($q)
    {
        return $q->where('is_not_available', '=', 0);
    }
}
