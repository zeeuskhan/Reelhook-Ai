export type TdeeSex = "male" | "female";
export type TdeeFormula = "mifflin" | "harris" | "katch";
export const ACTIVITY_LEVELS = [
 {value:1.2,label:"Sedentary",description:"Mostly sitting; little planned exercise"},
 {value:1.375,label:"Lightly active",description:"Light movement or exercise about 1–3 days a week"},
 {value:1.55,label:"Moderately active",description:"Moderate exercise about 3–5 days a week"},
 {value:1.725,label:"Very active",description:"Hard exercise or a physically active routine about 6–7 days a week"},
 {value:1.9,label:"Extra active",description:"Very demanding daily activity, hard training or physical work"}
] as const;
export interface TdeeInput {sex:TdeeSex;age:number;heightCm:number;weightKg:number;activity:number;formula:TdeeFormula;bodyFatPercent?:number}
export function calculateBmr(i:TdeeInput):number {
 const {sex,age,heightCm,weightKg,formula,bodyFatPercent}=i;
 if(![age,heightCm,weightKg].every(Number.isFinite)) throw new Error("Enter valid age, height and weight.");
 if(age<18||age>100) throw new Error("Age must be between 18 and 100 years.");
 if(heightCm<120||heightCm>230) throw new Error("Height must be between 120 and 230 cm.");
 if(weightKg<25||weightKg>350) throw new Error("Weight must be between 25 and 350 kg.");
 if(formula==="mifflin") return 10*weightKg+6.25*heightCm-5*age+(sex==="male"?5:-161);
 if(formula==="harris") return sex==="male" ? 88.362+13.397*weightKg+4.799*heightCm-5.677*age : 447.593+9.247*weightKg+3.098*heightCm-4.330*age;
 if(bodyFatPercent===undefined||!Number.isFinite(bodyFatPercent)||bodyFatPercent<=0||bodyFatPercent>=75) throw new Error("Enter a body-fat percentage greater than 0 and less than 75 for Katch–McArdle.");
 return 370+21.6*weightKg*(1-bodyFatPercent/100);
}
export function calculateTdee(i:TdeeInput) {
 if(!ACTIVITY_LEVELS.some(x=>x.value===i.activity)) throw new Error("Choose a valid activity level.");
 const bmr=calculateBmr(i), tdee=bmr*i.activity;
 return {bmr:Math.round(bmr),tdee:Math.round(tdee),fatLossMild:Math.round(tdee-250),fatLoss:Math.round(tdee-500),muscleGain:Math.round(tdee+250),...(i.formula==="katch"?{leanBodyMassKg:Math.round(i.weightKg*(1-(i.bodyFatPercent||0)/100)*10)/10}:{})};
}
export const poundsToKg=(v:number)=>v*0.45359237;
export const inchesToCm=(v:number)=>v*2.54;
