<?php

namespace App\Models\Upload;

use Illuminate\Database\Eloquent\Model;

class Upload extends Model
{
    protected $fillable = [];
    protected $hidden = [
                        'user_id',
                        'is_temp_delete',
                        'status',
                        'module',
                        'module_id',
                        'options'
                    ];
    protected $casts = ['options' => 'array'];
    protected $primaryKey = 'id';
    protected $table = 'uploads';
    protected $appends = ['file_info'];

    protected $icons = array(
        "application/json" => "fa-file-code",
        "application/msword" => "fa-file-word",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" => "fa-file-powerpoint",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => "fa-file-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "fa-file-word",
        "application/vnd.ms-excel" => "fa-file-excel",
        "application/vnd.ms-powerpoint" => "fa-file-powerpoint",
        "application/xml" => "fa-file-code",
        "application/&" => "fa-file-pdf",
        "application/pdf" => "fa-file-pdf",
        "image/jpeg" => "fa-file-image",
        "image/png" => "fa-file-image",
        "image/svg+xml" => "fa-file-image",
        "image/vnd.adobe.photoshop" => "fa-file-image",
        "image/vnd.microsoft.icon" => "fa-file-image",
        "image/&" => "fa-file-image",
        "text/plain" => "fa-file-alt",
        "video/mp4" => "fa-file-video",
        "video/ogg" => "fa-file-video",
        "video/quicktime" => "fa-file-video",
        "video/&" => "fa-file-video",
        "video/x-&" => "fa-file-video"
    );

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }

    public function getMimeAttribute()
    {
        return \Storage::mimeType($this->filename);
    }

    public function getFileInfoAttribute()
    {
        $mime = \Storage::mimeType($this->filename);
        $size = formatSizeUnits(\Storage::size($this->filename));

        if (array_key_exists($mime, $this->icons)) {
            return array('icon' => $this->icons[$mime], 'mime' => $mime, 'size' => $size);
        }

        return array('icon' => 'fa-file', 'mime' => $mime, 'size' => $size);
    }

    public function scopeFilterByModule($q, $module)
    {
        if (! $module) {
            return $q;
        }

        return $q->where('module', '=', $module);
    }

    public function scopeFilterByModuleId($q, $module_id)
    {
        if (! $module_id) {
            return $q;
        }

        return $q->where('module_id', '=', $module_id);
    }

    public function scopeFilterByUploadToken($q, $upload_token)
    {
        if (! $upload_token) {
            return $q;
        }

        return $q->where('upload_token', '=', $upload_token);
    }

    public function scopeFilterByIsTempDelete($q, $temp_delete)
    {
        return $q->where('is_temp_delete', '=', $temp_delete);
    }

    public function scopeFilterByStatus($q, $status)
    {
        return $q->where('status', '=', $status);
    }

    public function scopeFilterByUuId($q, $uuid)
    {
        return $q->where('uuid', '=', $uuid);
    }

    public function scopeFilterById($q, $id)
    {
        return $q->where('id', '=', $id);
    }
}
