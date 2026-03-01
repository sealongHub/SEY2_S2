<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('buyer_name');
            $table->string('buyer_phone', 50);
            $table->string('address');
            $table->text('note')->nullable();
            $table->enum('payment_method', ['aba', 'acleda']);
            $table->decimal('total', 10, 2);
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->string('transaction_image')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('province_id')->references('id')->on('provinces')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
