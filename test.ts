import { Store } from 'vuex'
import { DefineGetters, DefineActions, DefineMutations, Dispatcher, Committer } from './'

interface RootState {
  foo: FooState
}

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

interface BarActions {
  test: string
  foo: {
    another?: string
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

const state: FooState = {
  value: 0
}

const getters: DefineGetters<FooGetters, FooState> = {
  abc (state, getters) {
    state.value
    getters.abc
    getters.def
    return ''
  },

  def: state => state.value
}

const actions: DefineActions<FooActions, FooState, any, FooMutations, BarActions> = {
  foo(ctx, payload) {
    ctx.state.value

    ctx.dispatch('foo', { bar: 1 })
    ctx.dispatch({ type: 'foo', bar: 1 })
    ctx.dispatch('baz', { qux: 1 })
    ctx.dispatch({ type: 'baz', qux: 1 })

    ctx.dispatch('test', 'value')
    ctx.dispatch('foo', { bar: 1, another: '123' })

    ctx.commit('test', { value: '123' })
    ctx.commit({ type: 'test', value: '123' })
    ctx.commit('hello', { world: '123' })
    ctx.commit({ type: 'hello', world: '123' })

    payload.bar
  },

  baz(ctx, payload) {
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
