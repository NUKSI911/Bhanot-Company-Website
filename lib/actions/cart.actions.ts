import { useRouter } from "next/router"
import { insertCartSchema } from "../validators"
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types";


export const addItemToCart = async (item:CartItem) =>{

    return { success:true,message:""}
}