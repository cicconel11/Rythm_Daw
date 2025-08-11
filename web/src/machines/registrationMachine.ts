import { createMachine, fromPromise } from "xstate";

export type RegistrationContext = {
  email?: string;
  password?: string;
  requestId?: string;
  token?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  error?: string;
  completed?: boolean;
};

type SubmitCredentials = { type: "SUBMIT_CREDENTIALS"; email: string; password: string };
type SubmitBio = { type: "SUBMIT_BIO"; displayName: string; bio: string; avatarUrl?: string };
type Reset = { type: "RESET" };
type SetError = { type: "SET_ERROR"; error: string };

export type RegistrationEvent = SubmitCredentials | SubmitBio | Reset | SetError;

const STORAGE_KEY = "registration_ctx_v1";

const persist = (ctx: RegistrationContext) => {
  if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
    } catch (error) {
      console.warn('Failed to persist registration context:', error);
    }
  }
};

const hydrate = (): RegistrationContext => {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RegistrationContext) : {};
  } catch {
    return {};
  }
};

export const registrationMachine = createMachine(
  {
    id: "registration",
    context: {} as RegistrationContext,
    initial: "boot",
    on: {
      RESET: {
        target: ".credentials",
        actions: ({ context }) => {
          if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
            try {
              sessionStorage.removeItem(STORAGE_KEY);
            } catch (error) {
              console.warn('Failed to clear registration context:', error);
            }
          }
          Object.assign(context, {});
        },
      },
      SET_ERROR: {
        actions: ({ context, event }) => {
          context.error = (event as SetError).error;
        },
      },
      // internal navigation events used by pages
      "goto.credentials": { target: ".credentials" },
      "goto.bio": { target: ".bio" },
      "goto.complete": { target: ".complete" },
    },
    states: {
      boot: {
        entry: ({ context, self }) => {
          // Try to hydrate from sessionStorage
          try {
            const data = hydrate();
            Object.assign(context, data);
            
            // If we have complete data, go to bio
            if (data.completed) {
              self.send({ type: "goto.complete" } as any);
            } else if (data.email && data.requestId && data.token) {
              self.send({ type: "goto.bio" } as any);
            } else {
              // Default to credentials
              self.send({ type: "goto.credentials" } as any);
            }
          } catch (error) {
            console.warn('Failed to hydrate state:', error);
            // Default to credentials on error
            self.send({ type: "goto.credentials" } as any);
          }
        },
        on: {
          "goto.credentials": { target: ".credentials" },
          "goto.bio": { target: ".bio" },
          "goto.complete": { target: ".complete" },
        },
      },

      credentials: {
        description: "Step 1: Credentials",
        on: {
          SUBMIT_CREDENTIALS: { target: "submittingCredentials" },
        },
      },

      submittingCredentials: {
        invoke: {
          src: fromPromise(async ({ input }) => {
            const { email, password } = (input as SubmitCredentials);
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
              const error = await res.json().catch(() => ({}));
              throw new Error(error.error || "Registration failed");
            }
            const data = await res.json();
            return { email, requestId: data.requestId as string, token: data.token as string };
          }),
          input: ({ event }) => event,
          onDone: {
            target: "bio",
            actions: ({ context, event }) => {
              const { email, requestId, token } = event.output as { email: string; requestId: string; token: string };
              Object.assign(context, { email, requestId, token, error: undefined });
              persist(context);
            },
          },
          onError: {
            target: "credentials",
            actions: ({ context, event }) => {
              context.error = (event.error as Error)?.message || "Registration failed";
            },
          },
        },
      },

      bio: {
        description: "Step 2: Bio",
        entry: ({ context }) => {
          // guard: cannot be here without step1
          if (!(context.email && context.requestId && context.token)) {
            throw Object.assign(new Error("invalid_state"), { redirectTo: "/register/credentials" });
          }
        },
        on: { 
          SUBMIT_BIO: { 
            target: "submittingBio",
            actions: ({ context, event }) => {
              // Pass context data to the promise
              (event as any).requestId = context.requestId;
              (event as any).token = context.token;
            }
          } 
        },
      },

      submittingBio: {
        invoke: {
          src: fromPromise(async ({ input }) => {
            const { displayName, bio, avatarUrl, requestId, token } = (input as SubmitBio & { requestId: string; token: string });
            const res = await fetch("/api/register/bio", {
              method: "PUT",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                requestId,
                bio,
                avatarUrl,
              }),
            });
            if (!res.ok) {
              const error = await res.json().catch(() => ({}));
              throw new Error(error.error || "Bio submission failed");
            }
            return { displayName, bio, avatarUrl };
          }),
          onDone: {
            target: "complete",
            actions: ({ context, event }) => {
              Object.assign(context, { ...(event.output as any), completed: true, error: undefined });
              persist(context);
            },
          },
          onError: {
            target: "bio",
            actions: ({ context, event }) => {
              context.error = (event.error as Error)?.message || "Bio submission failed";
            },
          },
        },
      },

      complete: {
        description: "Registration completed",
        entry: ({ context }) => {
          // Clear session storage after successful completion
          if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
            try {
              sessionStorage.removeItem(STORAGE_KEY);
              // Set a cookie to indicate registration is completed
              document.cookie = "registration_completed=true; path=/; max-age=86400"; // 24 hours
            } catch (error) {
              console.warn('Failed to clear registration context:', error);
            }
          }
        },
      },
    },
  },
  {
    guards: {},
  }
);

// Helper functions for checking registration state
export const hasCompletedCredentials = (context: RegistrationContext): boolean => {
  return !!(context.email && context.requestId && context.token);
};

export const hasCompletedRegistration = (context: RegistrationContext): boolean => {
  return !!context.completed;
};