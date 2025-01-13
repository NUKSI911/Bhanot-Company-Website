import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata:Metadata = {
title: 'Select Payment Method'
}

const PaymentMethodPage = async () => {
    const session = await auth();
    const userId =  session?.user?.id;

    if(!userId) throw new Error('User Not Found');

    const user =await getUserById(userId);
    
    if(!user) throw new Error('User Not Found')

    return ( <>
       <CheckoutSteps current={2} />
       <PaymentMethodForm preferredPaymentMethod={user?.paymentMethod} /></> );
}
 
export default PaymentMethodPage;