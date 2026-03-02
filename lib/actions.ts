// lib/actions.ts
'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

interface CartItem {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export async function placeOrder(customerDetails: CustomerDetails, cartItems: CartItem[]) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // 1. Create order records from cart items
  const orderData = cartItems.map((item: CartItem) => ({
    name: customerDetails.name,
    phone: customerDetails.phone,
    address: customerDetails.address,
    design: item.name,
    color: item.color, // Assuming color is selected
    size: item.size,   // Assuming size is selected
    price: item.price,
    quantity: item.quantity,
    payment_status: 'pending',
  }));

  const { data, error } = await supabase.from('orders').insert(orderData).select();

  if (error) {
    console.error('Supabase order insert error:', error);
    return { success: false, error: 'Failed to place order.' };
  }

  // 2. Log the activity
  try {
    await supabase.from('activity_logs').insert({
      activity_type: 'NEW_ORDER',
      details: { customerName: customerDetails.name, itemCount: cartItems.length, orderIds: data.map(d => d.id) },
    });
  } catch (logError) {
    console.error('Failed to log new order activity:', logError);
    // Don't fail the whole transaction if logging fails, but log it.
  }
  
  // 3. Revalidate paths if needed (though real-time should handle the dashboard)
  revalidatePath('/dashboard');

  return { success: true, orderIds: data.map(d => d.id) };
}

// --- Shop Storefront Order ---

interface ShopCustomer {
  name: string;
  phone: string;
  address: string;
  facebook?: string;
  chapter?: string;
}

interface ShopCartItem {
  designName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export async function placeShopOrder(
  customer: ShopCustomer,
  items: ShopCartItem[],
  paymentMethod: 'gcash' | 'cod'
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Generate order reference
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderRef = `UG-${ts}-${rand}`;

  // 2. Calculate total
  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // 3. Insert shop order header
  const { data: order, error: orderError } = await supabase
    .from('shop_orders')
    .insert({
      order_ref: orderRef,
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_address: customer.address,
      customer_facebook: customer.facebook || '',
      customer_chapter: customer.chapter || '',
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'awaiting_payment',
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Shop order insert error:', orderError);
    return { success: false, error: orderError.message };
  }

  // 4. Insert line items
  const orderItems = items.map((item) => ({
    shop_order_id: order.id,
    design_name: item.designName,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { error: itemsError } = await supabase
    .from('shop_order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Shop order items insert error:', itemsError);
    return { success: false, error: itemsError.message };
  }

  // 5. Deduct stock for each item
  for (const item of items) {
    const { data: stock } = await supabase
      .from('stocks')
      .select('quantity')
      .eq('color', item.color)
      .eq('size', item.size)
      .single();

    if (stock && stock.quantity > 0) {
      await supabase
        .from('stocks')
        .update({ quantity: Math.max(0, stock.quantity - item.quantity) })
        .eq('color', item.color)
        .eq('size', item.size);
    }
  }

  return { success: true, orderRef };
}
