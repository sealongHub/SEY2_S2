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
        Schema::create('stock_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity'); // ចំនួន (+ សម្រាប់ចូល, - សម្រាប់ចេញ)
            $table->decimal('cost_price', 10, 2)->nullable(); // តម្លៃដើមសម្រាប់គណនា Expense
            $table->enum('type', ['in', 'out', 'adjustment']); 
            $table->string('reason')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transactions');
    }
};
