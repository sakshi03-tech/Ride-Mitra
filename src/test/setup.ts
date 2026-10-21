import "@testing-library/jest-dom";

// Mock localStorage for Vitest
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock HTML5 Audio for test environments
class MockAudio {
  play = () => Promise.resolve();
  pause = () => {};
  addEventListener = () => {};
  removeEventListener = () => {};
}
// @ts-expect-error Mock audio
global.Audio = MockAudio;

// Mock Notification API
// @ts-expect-error Mock notification
global.Notification = {
  permission: "granted",
  requestPermission: () => Promise.resolve("granted"),
};
