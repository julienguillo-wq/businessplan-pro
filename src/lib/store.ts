"use client";

import { FormData, BusinessPlan, INITIAL_FORM_DATA } from "./types";

const FORM_KEY = "bp-form-data";
const PLAN_KEY = "bp-plan-data";
const PAID_KEY = "bp-is-paid";

export function saveFormData(data: FormData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(FORM_KEY, JSON.stringify(data));
  }
}

export function loadFormData(): FormData {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(FORM_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return INITIAL_FORM_DATA;
}

export function savePlanData(data: BusinessPlan): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PLAN_KEY, JSON.stringify(data));
  }
}

export function loadPlanData(): BusinessPlan | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(PLAN_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return null;
}

export function setIsPaid(paid: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PAID_KEY, JSON.stringify(paid));
  }
}

export function getIsPaid(): boolean {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(PAID_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return false;
}
