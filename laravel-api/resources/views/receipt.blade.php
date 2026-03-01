<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        /* Setup Font */
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #444; margin: 0; padding: 0; }
        
        /* Layout Container */
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; background: #fff; }
        
        /* Header Section */
        .header-table { width: 100%; border: none; margin-bottom: 30px; }
        .shop-name { font-size: 28px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; }
        .receipt-label { font-size: 20px; color: #888; text-align: right; text-transform: uppercase; }
        
        /* Information Grid */
        .info-table { width: 100%; margin-bottom: 40px; }
        .info-table td { vertical-align: top; width: 50%; }
        .info-label { color: #999; text-transform: uppercase; font-size: 10px; font-weight: bold; margin-bottom: 5px; }
        .info-value { font-size: 14px; color: #333; }

        /* Main Table Style */
        .items-table { width: 100%; border-collapse: collapse; text-align: left; }
        .items-table thead th { 
            background: #1a1a1a; 
            color: #ffffff; 
            padding: 12px; 
            font-size: 12px; 
            text-transform: uppercase;
            border: none;
        }
        .items-table tbody td { 
            padding: 15px 12px; 
            border-bottom: 1px solid #eee; 
        }
        .items-table tr:last-child td { border-bottom: 2px solid #1a1a1a; }

        /* Calculation Section */
        .total-section { float: right; width: 35%; margin-top: 20px; }
        .total-table { width: 100%; }
        .total-table td { padding: 8px 0; }
        .grand-total { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1a1a1a; 
            border-top: 1px solid #ddd;
            padding-top: 10px !important;
        }

        /* Footer */
        .footer { 
            margin-top: 100px; 
            text-align: center; 
            color: #aaa; 
            font-size: 11px; 
            border-top: 1px solid #eee; 
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="header-table">
            <tr>
                <td>
                    <div class="shop-name">SHEERLONG SHOP</div>
                    <div style="color: #888;">Modern Fashion & Lifestyle</div>
                </td>
                <td class="receipt-label">Official Receipt</td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 2px solid #f4f4f4; margin-bottom: 30px;">

        <table class="info-table">
            <tr>
                <td>
                    <div class="info-label">Billed To:</div>
                    <div class="info-value"><strong>{{ $order->buyer_name }}</strong></div>
                    <div class="info-value">{{ $order->buyer_phone }}</div>
                    <div class="info-value">{{ $order->address }}</div>
                </td>
                <td style="text-align: right;">
                    <div class="info-label">Transaction Details:</div>
                    <div class="info-value">Order ID: <strong>#{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}</strong></div>
                    <div class="info-value">Date: {{ date('d M Y, H:i', strtotime($order->created_at)) }}</div>
                    <div class="info-value">Payment: <span style="color: #52c41a;">{{ strtoupper($order->payment_method) }}</span></div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($details as $item)
                <tr>
                    <td>
                        <div style="font-weight: bold; color: #333;">Product #{{ $item->product_id }}</div>
                        <div style="font-size: 11px; color: #999;">SKU-{{ 1000 + $item->product_id }}</div>
                    </td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">${{ number_format($item->price, 2) }}</td>
                    <td style="text-align: right; font-weight: bold;">${{ number_format($item->subtotal, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-section">
            <table class="total-table">
                <tr>
                    <td style="color: #888;">Subtotal</td>
                    <td style="text-align: right;">${{ number_format($order->total, 2) }}</td>
                </tr>
                <tr>
                    <td style="color: #888;">Tax (0%)</td>
                    <td style="text-align: right;">$0.00</td>
                </tr>
                <tr class="grand-total">
                    <td>Total Amount</td>
                    <td style="text-align: right;">${{ number_format($order->total, 2) }}</td>
                </tr>
            </table>
        </div>

        <div style="clear: both;"></div>

        <div class="footer">
            <p>Thank you for shopping at <strong>SHEERLONG SHOP</strong>!</p>
            <p>Terms: Goods sold are not returnable. Please keep this receipt for warranty if applicable.</p>
            <p>&copy; {{ date('Y') }} SHEERLONG SHOP. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>