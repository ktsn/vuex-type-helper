import { Store } from 'vuex'
import {
  DefineGetters,
  DefineActions,
  DefineMutations,
  Dispatcher,
  Committer
} from '../'

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
  actionWithUnionPayload: 'active' | 'inactive'
  actionWithoutPayload: undefined
}

interface FooMutations {
  test: {
    value: string
  }
  hello: {
    world: string
  }
  mutationWithUnionPayload: 'active' | 'inactive'
  mutationWithoutPayload: undefined
}

/**
 * Module implementation
 */
const state: FooState = {
  value: 0
}

const getters: DefineGetters<FooGetters, FooState, BarGetters> = {
  abc(state, getters) {
    state.value
    getters.abc
    getters.def
    getters.ghi
    return ''
  },

  def: state => state.value
}

const actions: DefineActions<
  FooActions,
  FooState,
  FooMutations & BarMutations,
  FooGetters,
  BarActions
> = {
  foo(ctx, payload) {
    ctx.state.value

    // dispatch inner actions
    ctx.dispatch('foo', { bar: 1 })
    ctx.dispatch({ type: 'foo', bar: 1 })
    ctx.dispatch('baz', { qux: 1 })
    ctx.dispatch({ type: 'baz', qux: 1 })

    const getStatus = (): 'active' | 'inactive' => {
      const statusArray = ['active', 'inactive'] as ['active', 'inactive']
      return statusArray[Math.floor(Math.random() * statusArray.length)]
    }
    ctx.dispatch('actionWithUnionPayload', getStatus())

    ctx.dispatch('actionWithoutPayload')
    ctx.dispatch({ type: 'actionWithoutPayload' })

    // dispatch outer actions
    ctx.dispatch('test', 'value')
    ctx.dispatch('foo', { bar: 1, another: '123' })

    // commit inner mutations
    ctx.commit('test', { value: '123' })
    ctx.commit({ type: 'test', value: '123' })
    ctx.commit('hello', { world: '123' })
    ctx.commit({ type: 'hello', world: '123' })
    ctx.commit('mutationWithUnionPayload', getStatus())
    ctx.commit('mutationWithoutPayload')
    ctx.commit({ type: 'mutationWithoutPayload' })

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
  },

  actionWithUnionPayload(ctx, payload) {
    ctx.commit('mutationWithUnionPayload', payload)
  },

  actionWithoutPayload(ctx) {
    ctx.state.value
  }
}

const mutations: DefineMutations<FooMutations, FooState> = {
  test(state, payload) {
    state.value

    payload.value
  },

  hello(state, payload) {
    payload.world
  },

  mutationWithUnionPayload(state, payload) {
    payload
  },

  mutationWithoutPayload(state) {
    state.value
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

store.dispatch<Dispatcher<FooActions>>({
  type: 'actionWithoutPayload'
})

store.commit<Committer<FooMutations>>({
  type: 'test',
  value: ''
})

store.commit<Committer<FooMutations>>({
  type: 'mutationWithoutPayload',
})
