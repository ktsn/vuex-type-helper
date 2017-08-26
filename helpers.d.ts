import 'vuex'

declare module 'vuex/types/helpers' {
  interface ComputedMapper<T> {
    <Key extends keyof T, Map extends Dictionary<Key>>(map: Map): { [K in keyof Map]: () => T[Map[K]] }
    <Key extends keyof T>(map: Key[]): { [K in Key]: () => T[K] }
  }

  interface MethodsMapper<T, R> {
    <Key extends keyof T, Map extends Dictionary<Key>>(map: Map): { [K in keyof Map]: (payload: T[Map[K]]) => R }
    <Key extends keyof T>(map: Key[]): { [K in Key]: (payload: T[K]) => R }
  }

  interface NamespacedHelpers<State, Getters, Mutations, Actions> {
    mapState: ComputedMapper<State>
    mapGetters: ComputedMapper<Getters>
    mapMutations: MethodsMapper<Mutations, void>
    mapActions: MethodsMapper<Actions, Promise<any>>
  }

  export function createNamespacedHelpers<State, Getters, Mutations, Actions>(namespace: string): NamespacedHelpers<State, Getters, Mutations, Actions>
}