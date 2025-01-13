import { cn } from "@/lib/utils";
import React from "react";

const CheckoutSteps = ({current}:{current:number}) => {
  return (
    <div className="flex-between flex-col items-center md:flex-row space-x-2 space-y-2 mb-10 ">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
            <React.Fragment key={step}>
          <p className={
            cn('p-2 w-56 rounded-full text-center text-sm',index=== current?'bg-secondary':'')
          }>
            {step}
          </p>
          {step !== 'Place Order' &&
          <hr className="w-16 border-t border-gray-300 "/>
          }
            </React.Fragment>
        )
      )}
    </div>
  );
};

export default CheckoutSteps;
