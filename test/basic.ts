import { Store } from 'vuex'
import { DefineGetters, DefineActions, DefineMutations, Dispatcher, Committer } from '../'

/**
 * External getters/actions/mutations
 */
interface BarGetters {
  ghi: boolean
}

interface BarActions {
  test: string
  foo: {
    another?: string
  }
}

interface BarMutations {
  inc: number
}

/**
 * Module type declarations
 */
interface FooState {
  value: number
}

interface FooGetters {
  abc: string
  def: number
}

interface FooActions {
  foo: {
    bar: number
  }
  baz: {
    qux: number
  }
}

interface FooMutations {
  test: {
    value: string
  }
  hello: {
    world: string
  }
}

/**
 * Module implementation
 */
const state: FooState = {
  value: 0
}

const getters: DefineGetters<FooGetters, FooState, BarGetters> = {
  abc (state, getters) {
    state.value
    getters.abc
    getters.def
    getters.ghi
    return ''
  },

  def: state => state.value
}

const actions: DefineActions<FooActions, FooState, FooGetters, FooMutations & BarMutations, BarActions> = {
  foo(ctx, payload) {
    ctx.state.value

    // dispatch inner actions
    ctx.dispatch('foo', { bar: 1 })
    ctx.dispatch({ type: 'foo', bar: 1 })
    ctx.dispatch('baz', { qux: 1 })
    ctx.dispatch({ type: 'baz', qux: 1 })

    // dispatch outer actions
    ctx.dispatch('test', 'value')
    ctx.dispatch('foo', { bar: 1, another: '123' })

    // commit inner mutations
    ctx.commit('test', { value: '123' })
    ctx.commit({ type: 'test', value: '123' })
    ctx.commit('hello', { world: '123' })
    ctx.commit({ type: 'hello', world: '123' })

    // commit outer mutations
    ctx.commit('inc', 123)

    // dispatch root actions
    ctx.dispatch('anything', 'value', { root: true })
    ctx.dispatch({ type: 'anything' }, { root: true })

    // commit root mutations
    ctx.commit('anything', 'value', { root: true })
    ctx.commit({ type: 'anything' }, { root: true })

    payload.bar
  },

  baz(ctx, payload) {
    ctx.getters.abc
    ctx.getters.def

    payload.qux
  }
}

const mutations: DefineMutations<FooMutations, FooState> = {
  test(state, payload) {
    state.value

    payload.value
  },

  hello(state, payload) {
    payload.world
  }
}

/**
 * Create store
 */
const store = new Store({
  modules: {
    foo: {
      state,
      actions,
      mutations
    }
  }
})

store.dispatch<Dispatcher<FooActions>>({
  type: 'foo',
  bar: 123
})

store.commit<Committer<FooMutations>>({
  type: 'test',
  value: ''
})
