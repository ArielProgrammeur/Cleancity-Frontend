type Factory<T> = () => T;

class ServiceContainer {
  private services = new Map<string, unknown>();
  private factories = new Map<string, Factory<unknown>>();

  register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory as Factory<unknown>);
  }

  registerSingleton<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  resolve<T>(key: string): T {
    if (this.services.has(key)) {
      return this.services.get(key) as T;
    }

    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service not found: ${key}`);
    }

    const instance = factory() as T;
    this.services.set(key, instance);
    return instance;
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

export const container = new ServiceContainer();
