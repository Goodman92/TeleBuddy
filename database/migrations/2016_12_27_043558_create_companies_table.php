<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompaniesTable extends Migration
{

    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->string('name');
            $table->string('businessId');
            $table->date('registrationDate')->nullable();
            $table->date('endDate')->nullable();
            $table->string('companyForm')->nullable();
            $table->string('street')->nullable();
            $table->string('postCode')->nullable();
            $table->string('city')->nullable();
            
            $table->string('liquidations')->nullable();

            $table->integer('businessLine')->unsigned()->nullable();
            $table->foreign('businessLine')->references('id')->on('businesslines')->onUpdate('cascade')->onDelete('set null')->nullable();

            $table->integer('contactDetails')->unsigned()->nullable();
            $table->foreign('contactDetails')->references('id')->on('contact-details')->onUpdate('cascade')->onDelete('set null')->nullable();
            $table->primary('businessId');
        });
    }

    public function down()
    {
        Schema::dropIfExists('companies');
    }
}
