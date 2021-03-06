import gameApi from '@/api/game-api'
import * as M from '@/store/mutations'
import * as A from '@/store/actions'
import whitelistMixin from './util/whitelistMixin'
import { gameOptions, gameMixin } from './util/gameMixin'

export const NAMESPACE = 'League of Legends'

const lol = _.merge({}, gameMixin, whitelistMixin, {
    namespaced: true,
    state: {
        gameName: NAMESPACE,
        candidateNomenclature: 'champion',
        className: 'league-of-legends',
        gameOptions: gameOptions(),
        candidates: [],
        filters: [
            {
                id: 'name',
                type: 'text',
                vmodel: '',
                placeholder: 'Search champions'
            },
            {
                id: 'role',
                type: 'select',
                vmodel: 'Role',
                options: ['Role']
            }
        ]
    },
    mutations: {
        [M.SET_CANDIDATES] (state, { candidates }) {
            state.candidates = candidates
        },
        [M.SET_FILTERS] (state, { candidates }) {
            const roles = _(candidates).map(d => d.tags).flatMap().uniq().sort().value()
            state.filters[1].options.push(...roles)
        }

    },
    actions: {
        async [A.GET_CANDIDATES] ({ commit }) {
            const resp = await gameApi.fetch('lol')
            const candidates = await resp.data
            commit(M.SET_CANDIDATES, { candidates })
            commit(M.SET_FILTERS, { candidates })
        }
    },
    getters: {
        candidates (state) {
            return state.candidates
        },
        filteredCandidates ({ candidates }, { activeFilters }) {
            return candidates.filter(candidate => {
                return activeFilters.every(({ id, vmodel, options }) => {
                    if (id === 'name') { return candidate.name.toLowerCase().includes(vmodel.toLowerCase()) } else if (id === 'role' && vmodel !== options[0]) { return candidate.tags.includes(vmodel) }
                })
            })
        }
    }
})
export default lol
