<template>
    <div class="flex-center is-size-7">
        <table class="table is-narrow m-b-0">
            <tbody>
                <tr><td>Category</td><td>{{ currentVote.voteCategory }}</td></tr>
                <tr><td>Mode</td><td>{{ currentVote.voteMode }}</td></tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name:'vote-stats',
    computed:{
        ...mapState(['currentVote']),
    }
}

</script>

<style lang="scss" scoped>

.table{
    background: transparent;
}

</style>
