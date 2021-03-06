<template>
	<div class="config">
        <h3 class="title">Thanks for installing Vote to Play!</h3>
        <p>
            If you would like to suggest any features, please feel free to
            email me at guanzo91@gmail.com.
        </p>
        <h3 class="title is-4">Usage</h3>
        <p>
            If you want viewers to vote on game characters, set the game in
            your stream information.<br>For example, if you want viewers to
            vote on a Dota 2 hero, set Dota 2 as the game on Twitch, and
            click <span v-html="startVoteExample" />
        </p>
		<p>
            If you want viewers to vote on games, select
            <span v-html="radioBtnSample('All Games')" />
            under <span class="tag is-medium"><b>Vote Category</b></span>, and click
            <span v-html="startVoteExample" />
        </p>
        <p>You can do all this on your Live Dashboard.</p>
        <p><b>Tip:</b> When you update the game on Twitch, a new vote automatically starts.</p>
        <p>Remember, you also get to vote!</p>
        <h3 class="title is-4">Settings</h3>
        <p>By default, viewers can vote on any candidate in the pool.<br>If you want viewers to vote only on specific candidates, you can configure that here. Make sure to save your changes.</p>
        <p>You can toggle between
            <span v-html="radioBtnSample( VOTE_MODE_VIEWER )" />
            and
            <span v-html="radioBtnSample( VOTE_MODE_STREAMER )" />
            under <span class="tag is-medium"><b>Vote Mode</b></span>
            on your Live Dashboard.
        </p>
        <div class="select">
            <select v-model="selectedVoteCategory" id="vote-type" class="m-b-15">
                <option v-for="game in supportedGames" :key="game">
                    {{ game }}
                </option>
            </select>
        </div>

        <div class="box">
            <game-master
                v-if="voteCategory"
                :injectedComponent="whitelist"
                :voteCategory="selectedVoteCategory"
             />
        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'

import whitelist from './Whitelist'
import GameMaster from '@/components/game/_GameMaster'

const { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER } = require('@shared/constants')

export default {
    name: 'config',
    data(){
        return {
            selectedVoteCategory: '',
            whitelist,
            VOTE_MODE_VIEWER,
            VOTE_MODE_STREAMER,
            startVoteExample: '<button class="button is-small is-static">Start a vote</button>'
        }
    },
    computed:{
        ...mapState(['voteCategory']),
        supportedGames(){
            return this.$store.getters.supportedGames
        },
    },
    watch:{
        //change game when streamer does,
        //cannot be computed property to also allow streamer to change game thru select
        voteCategory(newCategory){
            this.selectedVoteCategory = newCategory
        }
    },
    methods:{
        radioBtnSample(label){
            return `<label class="radio"><input type="radio" disabled> ${label}</label>`
        }
    },
    components:{
        GameMaster
    }
}
</script>


<style lang="scss" scoped>

.config {
    background: $white-bis;
    color: #333;
    padding: 15px;
    p{
        margin-bottom: 15px;
    }
    span{
        margin: 0px 5px;
        pointer-events: none;
    }
    /deep/ .game{
        min-height: 400px;
    }
}

</style>
