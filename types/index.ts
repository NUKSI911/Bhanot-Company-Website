import { insertProductSchema } from '@/lib/validators';
import { z } from 'zod'

export type Product = z.infer<typeof insertProductSchema> & {
    id:string;
    name:string;
    rating:string;
}