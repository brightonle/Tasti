// Minimal Timestamp shim so mock data doesn't need Firebase
export const Timestamp = {
  now: () => ({
    toDate: () => new Date(),
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0,
  }),
} as any;
