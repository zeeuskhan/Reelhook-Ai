import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateBmr, calculateTdee, poundsToKg, inchesToCm } from "./tdee.ts";
test("Mifflin male metric: 30y, 80kg, 180cm",()=>{const x={sex:"male" as const,age:30,heightCm:180,weightKg:80,activity:1.55,formula:"mifflin" as const};assert.equal(calculateBmr(x),1755);assert.equal(calculateTdee(x).tdee,2720);});
test("Mifflin female metric: 30y, 65kg, 165cm",()=>{assert.equal(calculateBmr({sex:"female",age:30,heightCm:165,weightKg:65,activity:1.55,formula:"mifflin"}),1370.25);});
test("imperial inputs convert to equivalent metric values",()=>{assert.ok(Math.abs(poundsToKg(176.3698)-80)<0.001);assert.ok(Math.abs(inchesToCm(70.8661417)-180)<0.001);});
test("revised Harris-Benedict male example",()=>{assert.equal(Math.round(calculateBmr({sex:"male",age:30,heightCm:180,weightKg:80,activity:1.2,formula:"harris"})),1849);});
test("Katch-McArdle uses lean body mass",()=>{assert.equal(calculateBmr({sex:"male",age:30,heightCm:180,weightKg:80,activity:1.2,formula:"katch",bodyFatPercent:20}),1751.2);});
test("invalid age and missing Katch body fat are rejected",()=>{assert.throws(()=>calculateBmr({sex:"male",age:17,heightCm:180,weightKg:80,activity:1.2,formula:"mifflin"}));assert.throws(()=>calculateBmr({sex:"male",age:30,heightCm:180,weightKg:80,activity:1.2,formula:"katch"}));});
