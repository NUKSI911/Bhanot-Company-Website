"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useToast } from "@/hooks/use-toast";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constant";
import { paymentMethodSchema } from "@/lib/validators";
import { PaymentMethod } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<PaymentMethod>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: { type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: PaymentMethod) => {
    startTransition(async () => {
      const response = await updateUserPaymentMethod(values);
      if (!response.success) {
        toast({
          variant: "destructive",
          description: response.message,
        });
        return
      }
      router.push('/place-order')
    });
  };
  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Methods</h1>
        <p className="text-sm text-muted-foreground">
          Please select a payment method
        </p>
        <Form {...form}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-5 ">
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="sapce-y-3">
                    <FormControl>
                      <RadioGroup
                        className="flex itms-center space-x-2"
                        onValueChange={field.onChange}
                      >
                        {PAYMENT_METHODS.map((value) => (
                          <FormItem
                            key={value}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={value}
                                checked={field.value === value}
                              />
                            </FormControl>
                            <FormLabel>{value}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{" "}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
