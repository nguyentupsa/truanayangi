import { foods, type Food } from './foods';
import { createFoodSelector, priceRarity } from './case-mechanics';
export type CustomFood = { id: string; name: string; price: number; veg: boolean };
export type PoolProfile = { disabled: number[]; custom: CustomFood[]; revision: number };
export const emptyProfile = (): PoolProfile => ({ disabled: [], custom: [], revision: 0 });
const ids = new Set(foods.map(f => f.image));
export function validateProfile(input: unknown): PoolProfile {
 if (!input || typeof input !== 'object') throw new Error('Invalid profile');
 const p = input as Record<string, unknown>;
 if (Object.keys(p).some(k => !['disabled','custom','revision'].includes(k)) || !Array.isArray(p.disabled) || !Array.isArray(p.custom) || !Number.isSafeInteger(p.revision) || (p.revision as number)<0) throw new Error('Invalid profile');
 if (p.disabled.length>foods.length || p.custom.length>50 || new Set(p.disabled).size!==p.disabled.length || p.disabled.some(id=>!ids.has(id))) throw new Error('Invalid dishes');
 const custom = p.custom.map((item: unknown): CustomFood => {
  if (!item || typeof item!=='object') throw new Error('Invalid dish');
  const f=item as Record<string,unknown>;
  if(Object.keys(f).some(k=>!['id','name','price','veg'].includes(k)) || typeof f.id!=='string' || !/^[0-9a-f-]{36}$/i.test(f.id) || typeof f.name!=='string' || !f.name.trim() || f.name.length>60 || /[\x00-\x1f\x7f]/.test(f.name) || !Number.isInteger(f.price) || (f.price as number)<10 || (f.price as number)>500 || typeof f.veg!=='boolean') throw new Error('Invalid dish');
  return {id:f.id,name:f.name.trim().normalize('NFC'),price:f.price as number,veg:f.veg};
 });
 if(new Set(custom.map(f=>f.id)).size!==custom.length || foods.length-p.disabled.length+custom.length<1) throw new Error('Keep at least one dish');
 return {disabled:p.disabled as number[],custom,revision:p.revision as number};
}
// Dishes kept out of the office lunch case. Add an `image` id to drop a dish,
// remove one to bring it back. Custom dishes ("Món của tôi") are never filtered.
export const excludedDishes = new Set<number>([
 // Không ship được / cần bếp tại bàn
 14, 15, 18, 32, 44, 71, 101, 102, 105,
 // Bánh mì — không ai đặt cho bữa trưa văn phòng
 2, 34, 107, 124,
 // Ăn vặt / phần quá nhẹ / thiên về bữa sáng
 27, 49, 123,
 // Salad ăn kiêng
 51, 60, 61,
 // Mì lạnh / kén người ăn chung / mùi nặng
 58, 96, 77, 83,
 // Món Âu bày đĩa, nguội là mất ngon, hiếm khi đặt ship trưa
 53, 62, 63, 112, 114, 115, 116, 117, 118, 119,
 // Trùng loại — giữ lại bản phổ biến hơn
 54, 55, 69, 70, 82, 110, 111,
 // Vùng miền ít gặp ở HCM / cao tiền, ít đặt trưa
 19, 68, 81, 90, 103, 104, 106, 108,
]);
export function personalFoods(profile: PoolProfile): Food[] {
 return [...foods.filter(f=>!excludedDishes.has(f.image)&&!profile.disabled.includes(f.image)), ...profile.custom.map(f=>({...f,customId:f.id,image:-1,sub:'Món của tôi',quip:'',rarity:priceRarity(f.price)}))];
}
export function personalSelector(population: Food[], target: number) {
 if(!population.length) return null;
 const prices=population.map(f=>f.price);
 const min=Math.min(...prices),max=Math.max(...prices);
 let feasible=Math.max(min,Math.min(target,max));
 // createFoodSelector puts 100% of the probability on the priciest/cheapest
 // dish when the target lands exactly on min or max (the only way to hit that
 // exact average). A filtered pool (e.g. vegetarian-only) is often narrower
 // than the chosen budget, which pins the target to max on every spin and
 // makes the wheel deterministic. Nudge inward so every dish keeps a real
 // chance, as long as there's more than one price point to spread across.
 if(new Set(prices).size>2){
  const margin=Math.min((max-min)*.3,(max-min)/2);
  if(feasible>=max)feasible=max-margin;
  if(feasible<=min)feasible=min+margin;
 }
 return createFoodSelector(population,feasible);
}
