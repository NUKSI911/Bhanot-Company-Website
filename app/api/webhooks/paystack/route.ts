import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderToPaid } from '@/lib/actions/order.actions';
import { revalidatePath } from 'next/cache';

const secret = process.env.PAYSTACK_APP_SECRET;

// Server Action for Revalidation
async function revalidatePayments(orderId: string) {
    "use server";
    revalidatePath(`order/${orderId}`);
}


export async function POST(req: NextRequest) {
    try {
        // Get raw request body
        const body = await req.text();

        // Validate Paystack signature
        const signature = req.headers.get('x-paystack-signature');
        const hash = crypto.createHmac('sha512', secret!)
            .update(body)
            .digest('hex');

        if (hash !== signature) {
            return new NextResponse('Invalid signature', { status: 401 });
        }

        // Parse webhook payload
        const result = JSON.parse(body);
        // Handle successful charge event
        if (result.event === 'charge.success') {
            const transaction = result.data;
        if (!transaction.metadata.orderId) {
                return new NextResponse('Order ID missing from metadata', { status: 400 });
            }
            await updateOrderToPaid({
                orderId: transaction.metadata.orderId,
                paymentResult: {
                    id: transaction.reference,
                    status: 'COMPLETED',
                    email_address: transaction.customer.email,
                    pricePaid: (transaction.amount / 100).toString(),
                },
            });

            await revalidatePayments(transaction.metadata.orderId);

            return NextResponse.json({
                revalidatePath: true,
                message: 'Order payment status updated successfully'
            });
        }

        // Return response for other events
        return NextResponse.json({
            message: 'Received unhandled event type'
        });

    } catch (error) {
        console.error('Paystack webhook error:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }
}