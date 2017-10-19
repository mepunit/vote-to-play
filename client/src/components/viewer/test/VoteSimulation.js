
import _ from 'lodash'
import { mapState } from 'vuex'
import { SIMULATE_VOTE, START_NEW_VOTE } from '@/store/actions'

export default {
    data(){
        return {
            intervalID: 0,
            maxSimulationVotes: 200,
            voteDelay: 150
        }
    },
    computed:{
        ...mapState(['TESTING']),
        game(){
            return this.$store.getters.game
        },
        isSimulating(){
            return this.TESTING.isSimulating
        },
        heroes(){
            return _.sortBy(this.game.heroes,'name')
        },
    },
    watch:{
        ['votes.length'](){
            if(!this.isSimulating)
                return;

            if(this.votes.length >= this.maxSimulationVotes){
                this.$store.dispatch(START_NEW_VOTE)
            }else if(this.votes.length == 0){
                clearInterval(this.intervalID)
                this.intervalID = this.simulateVotes()
            }
        },
        isSimulating(){
            if(this.isSimulating)
                this.intervalID = this.simulateVotes()
            else
                clearInterval(this.intervalID)
        }
    },
    methods:{
        simulateVotes(){
            let votes = this.maxSimulationVotes
            let heroPool = Math.min(25, this.heroes.length);
            let intervalID = setInterval(()=>{
                let userId = this.randomIntFromInterval(0, 100000)
                let heroIndex = this.randomIntFromInterval(0, heroPool)

                if(userId == this.userId)
                    return;

                if(this.heroes.length == 0)
                    return;
                let heroName = this.heroes[heroIndex].name
                this.$store.dispatch(SIMULATE_VOTE, { vote: heroName, userId  })
                
            },500)
            return intervalID
        },
        randomIntFromInterval(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }
    }
}