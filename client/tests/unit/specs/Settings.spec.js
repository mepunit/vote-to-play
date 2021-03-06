import Settings from '@/components/page-liveconfig/Settings'
import { SET_GAME } from '@/store/mutations'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
import { state, mutations, getters, actions, modules } from '@/store'
const { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER } = require('@shared/constants')

const unsupportedGame = 'werwetds'
function mockStore(selectedGame, voteCategory){
    return new Vuex.Store({
        state: Object.assign({},state, {selectedGame, voteCategory}),
        mutations,
        actions,
        getters,
        modules
    })
}

const Constructor = Vue.extend(Settings)

describe('Settings.vue', () => {

    it('does not change vote category when game is set on page load', (done) => {
        const game = 'Dota 2'
        const voteCategory = game
        const vm = new Constructor({
            store: mockStore(null, voteCategory)
        }).$mount()
        
        vm.$store.commit(SET_GAME, game)
        
        setTimeout(()=>{//let vm watcher trigger
            expect(vm.$store.state.voteCategory).to.equal(voteCategory)
            done()
        },0)
    })
    it('changes vote category when game is changed during broadcast', done => {
        const game = 'Dota 2'
        const voteCategory = game
        const newGame = 'Overwatch'
        const vm = new Constructor({
            store: mockStore(game, voteCategory)
        }).$mount()
        vm.$store.commit(SET_GAME, newGame)
        
        setTimeout(()=>{//let vm watcher trigger

            expect(vm.$store.state.voteCategory).to.equal(newGame)
            done()
        },0)
    })
    describe('Setting Whitelist Mode',()=>{
        const game = 'Dota 2'
        const voteCategory = game

        function createInstance(){
            return new Constructor({
                store: mockStore(game, voteCategory)
            }).$mount()
        }

        it('disallows whitelist mode if whitelist is empty',()=>{
            const vm = createInstance()
            const games = vm.$store.state.games
            games[game].whitelistedNames = []
            vm.selectedVoteMode = VOTE_MODE_STREAMER
            vm.startVote()
            expect(vm.showWhitelistWarning).to.be.true
        })
        it('allows whitelist mode if whitelist is not empty',()=>{
            const vm = createInstance()
            const games = vm.$store.state.games
            games[game].whitelistedNames = ['axe']
            vm.selectedVoteMode = VOTE_MODE_STREAMER
            vm.startVote()
            expect(vm.showWhitelistWarning).to.be.false
        })
        it(`vote mode auto changes to viewer mode if mode was originally streamer 
            and voteCategory is changed to one without a whitelist`,done=>{
            const vm = createInstance()
            const games = vm.$store.state.games
            vm.selectedVoteMode = VOTE_MODE_STREAMER
            const gameNoWhitelist = 'Overwatch'
            games[gameNoWhitelist].whitelistedNames = []
            vm.$store.state.selectedGame = gameNoWhitelist

            setTimeout(()=>{//let vm watcher trigger
                expect(vm.selectedVoteMode).to.equal(VOTE_MODE_VIEWER)
                done()
            },0)
        })
    })

    
    it('hides start button and informs streamer if game is unsupported AND voteCategory is unsupported', () => {
        const vm = new Constructor({
            store: mockStore(unsupportedGame, unsupportedGame)
        }).$mount()
        
        const unsupportedComponent = vm.$el.querySelector('.game-unsupported')
        const startButton = vm.$el.querySelector('.start-vote')
        expect(unsupportedComponent).to.not.be.null
        expect(startButton).to.be.null
    })
    
    it('does not hide start button if game is unsupported AND voteCategory is all games', () => {
        const vm = new Constructor({
            store: mockStore(unsupportedGame, ALL_GAMES)
        }).$mount()
        const startButton = vm.$el.querySelector('.start-vote')

        expect(startButton).to.not.be.null
    }) 
}) 

