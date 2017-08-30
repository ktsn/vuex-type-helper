import { createNamespacedHelpers } from 'vuex'
import { CounterState, CounterGetters, CounterMutations, CounterActions } from './counter'

const {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} = createNamespacedHelpers<CounterState, CounterGetters, CounterMutations, CounterActions>('counter')

mapState({ counter: 'count' })
mapState(['count'])
mapState({
  counter (state, getters) {
    return state.count + getters.half
  }
})

mapGetters({ halfValue: 'half' })
mapGetters(['half'])

mapMutations({ add: 'inc' })
mapMutations(['inc'])

mapActions({ addAsync: 'incAsync' })
mapActions(['incAsync'])
