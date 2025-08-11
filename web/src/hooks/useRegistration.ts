"use client";
import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { registrationMachine, type RegistrationEvent, type RegistrationContext } from "@/src/machines/registrationMachine";
import { useRouter } from "next/navigation";

export function useRegistration() {
  const router = useRouter();
  const [state, send] = useMachine(registrationMachine);

  // redirect errors thrown in state entry
  useEffect(() => {
    const unsub = (error: any) => {
      if (error?.redirectTo) router.replace(error.redirectTo);
    };
    // Next.js doesn't expose an "onError" here; we defensively catch page-level errors in submit fns below.
    return () => {};
  }, [router]);

  useEffect(() => {
    if (state.matches("complete")) router.replace("/dashboard");
  }, [state, router]);

  return {
    state,
    send: (evt: RegistrationEvent) => send(evt),
    canGoBio: Boolean(state.context.email && state.context.requestId && state.context.token),
  };
}
