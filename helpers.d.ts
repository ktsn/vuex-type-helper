import Vue from 'vue'
import 'vuex'

type Accessor<T, State, Getters> = {
  [K in keyof T]: <V extends Vue>(
    this: V,
    state: State,
    getters: Getters
  ) => T[K]
} & {
  [key: string]: <V extends Vue>(this: V, state: State, getters: Getters) => any
}

interface ComputedMapper<T> {
  <Key extends keyof T, Map extends Record<string, Key>>(map: Map): {
    [K in keyof Map]: () => T[Map[K] & Key]
  }
  <Key extends keyof T>(map: Key[]): { [K in Key]: () => T[K] }
}

interface ComputedStateMapper<State, Getters> {
  <T>(map: Accessor<T, State, Getters>): { [K in keyof T]: () => T[K] }
}

interface MethodsMapper<T, R> {
  <Key extends keyof T, Map extends Record<string, Key>>(map: Map): {
    [K in keyof Map]: (payload: T[Map[K] & Key]) => R
  }
  <Key extends keyof T>(map: Key[]): { [K in Key]: (payload: T[K]) => R }
}

interface StrictNamespacedMappers<State, Getters, Mutations, Actions> {
  mapState: ComputedMapper<State> & ComputedStateMapper<State, Getters>
  mapGetters: ComputedMapper<Getters>
  mapMutations: MethodsMapper<Mutations, void>
  mapActions: MethodsMapper<Actions, Promise<any>>
}

declare module 'vuex/types/helpers' {
  interface Mapper<R> {
    <K extends string>(map: K[]): Record<K, R>
    <K extends string>(map: Record<K, string>): Record<K, R>
  }

  interface MapperWithNamespace<R> {
    <K extends string>(namespace: string, map: K[]): Record<K, R>
    <K extends string>(namespace: string, map: Record<K, string>): Record<K, R>
  }

  interface FunctionMapper<F, R> {
    <K extends string>(
      map: Record<K, (this: Vue, fn: F, ...args: any[]) => any>
    ): Record<K, R>
  }

  interface FunctionMapperWithNamespace<F, R> {
    <K extends string>(
      namespace: string,
      map: Record<K, (this: Vue, fn: F, ...args: any[]) => any>
    ): Record<K, R>
  }

  interface MapperForState {
    <S, K extends string>(
      map: Record<K, (this: Vue, state: S, getters: any) => any>
    ): Record<K, Computed>
  }

  interface MapperForStateWithNamespace {
    <S, K extends string>(
      namespace: string,
      map: Record<K, (this: Vue, state: S, getters: any) => any>
    ): Record<K, Computed>
  }

  export function createNamespacedHelpers(namespace: string): NamespacedMappers
  export function createNamespacedHelpers<State, Getters, Mutations, Actions>(
    namespace: string
  ): StrictNamespacedMappers<State, Getters, Mutations, Actions>
}
