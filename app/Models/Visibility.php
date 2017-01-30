<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visibility extends Model
{
    //

	protected $table = 'visibilities';
	public $timestamps = false;
    protected $fillable = ['name', 'url'];

    public function company() {
        return $this->belongsToMany('App\Models\Company')->withTimeStamps();
    }
}
