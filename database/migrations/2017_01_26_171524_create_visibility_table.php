<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisibilityTable extends Migration
{

    public function up()
    {
        Schema::create('visibilities', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->string('url')->nullable();

        });
    }


    public function down()
    {
        Schema::dropIfExists('visibilities');
    }
}
