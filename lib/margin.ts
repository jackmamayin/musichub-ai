import {config} from "./config";
export function requiredCredits(cost:number){return Math.max(10,Math.ceil((cost/config.safeCostRatio)/config.creditUsd));}
export function economics(revenue:number,cost:number){const payment=revenue*config.paymentReserveRatio,infra=revenue*config.infraReserveRatio,profit=revenue-cost-payment-infra,margin=revenue?profit/revenue:0;return{revenueUsd:revenue,providerCost:cost,paymentReserve:payment,infraReserve:infra,profitUsd:profit,margin,safe:margin>=config.targetMargin};}
export function priceForMargin(cost:number,target=config.targetMargin){const floor=Number(process.env.TARGET_MARGIN_HARD_FLOOR||0.5);const t=Math.max(floor,target);return cost/(1-t-config.paymentReserveRatio-config.infraReserveRatio);}
