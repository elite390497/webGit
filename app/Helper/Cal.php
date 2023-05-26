<?php
namespace App\Helper;

use Carbon\Carbon;

class Cal
{
    /**
     * Validate a date
     *
     * @param  string  $date
     * @return bool
     */
    public static function validateDate($date)
    {
        $d = \DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }

    /**
     * Get date difference
     *
     * @param  string  $date1
     * @param  string  $date2
     * @param  integer  $increment
     * @return integer
     */
    public static function dateDiff($date1, $date2, $increment = 0)
    {
        if ($date2 > $date1) {
            return date_diff(date_create($date1), date_create($date2))->days + $increment;
        } else {
            return date_diff(date_create($date2), date_create($date1))->days + $increment;
        }
    }

    /**
     * Get age difference
     *
     * @param  string  date1
     * @return array
     */
    public static function getAge($date)
    {
        $age = Carbon::parse($date)->diff(Carbon::now());

        return array(
            'years' => $age->y,
            'months' => $age->m,
            'days' => $age->d,
        );
    }

    /**
     * Get start of given date
     *
     * @param  date  $date
     * @return string
     */
    public static function startOfDate($date)
    {
        return date('Y-m-d', strtotime($date)).' 00:00';
    }

    /**
     * Get end of given date
     *
     * @param  date  $date
     * @return string
     */
    public static function endOfDate($date)
    {
        return date('Y-m-d', strtotime($date)).' 23:59';
    }

    /**
     * Get humanize date format
     *
     * @return string
     */
    public static function getDateFormat()
    {
        if (config('config.system.date_format') === 'DD-MM-YYYY') {
            return 'd-m-Y';
        } elseif (config('config.system.date_format') === 'MM-DD-YYYY') {
            return 'm-d-Y';
        } elseif (config('config.system.date_format') === 'DD-MMM-YYYY') {
            return 'd-M-Y';
        } elseif (config('config.system.date_format') === 'MMM-DD-YYYY') {
            return 'M-d-Y';
        } else {
            return 'd-m-Y';
        }
    }

    /**
     * Get system date format
     *
     * @return string
     */
    public static function getSysDateFormat()
    {
        return 'Y-m-d';
    }

    /**
     * Get humanize time format
     *
     * @return string
     */
    public static function getTimeFormat()
    {
        // return config('config.system.time_format') === 'H:mm' ? 'H:i' : 'h:i A';
        return 'h:i A';
    }

    /**
     * Get system time format
     *
     * @return string
     */
    public static function getSysTimeFormat()
    {
        return 'h:i A';
    }

    /**
     * Get humanize date time format
     *
     * @return string
     */
    public static function getDateTimeFormat()
    {
        return self::getDateFormat().' '.self::getTimeFormat();
    }

    /**
     * Get system date time format
     *
     * @return string
     */
    public static function getSysDateTimeFormat()
    {
        return self::getSysDateFormat().' '.self::getSysTimeFormat();
    }

    /**
     * Get today dat
     *
     * @return date
     */
    public static function today()
    {
        return date('Y-m-d');
    }

    /**
     * Convert to system date
     *
     * @param  date  $date
     * @return date
     */
    public static function toDate($date)
    {
        return ($date) ? date('Y-m-d', strtotime($date)) : null;
    }

    /**
     * Convert to system time
     *
     * @param  time  $time
     * @return time
     */
    public static function toTime($time)
    {
        return ($time) ? date('H:i', strtotime($time)) : null;
    }

    /**
     * Convert to system date time
     *
     * @param  datetime  $datetime
     * @return datetime
     */
    public static function toDateTime($datetime)
    {
        return ($datetime) ? date('Y-m-d H:i:s', strtotime($datetime)) : null;
    }

    /**
     * Convert date to user defined date format
     *
     * @param  date  $date
     * @return string
     */
    public static function showDate($date)
    {
        return ($date) ? date(self::getDateFormat(), strtotime($date)) : null;
    }

    /**
     * Convert date to user defined date time format
     *
     * @param  time  $time
     * @return string
     */
    public static function showDateTime($time)
    {
        return ($time) ? date(self::getDateFormat().','.(self::getTimeFormat()), strtotime($time)) : null;
    }

    /**
     * Convert time to user defined time format
     *
     * @param  time  $time
     * @return string
     */
    public static function showTime($time)
    {
        return ($time) ? date((self::getTimeFormat()), strtotime($time)) : null;
    }
}
